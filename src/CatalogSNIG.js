import React, { useEffect, useState, useRef } from 'react';

import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';

import VectorLayer from 'ol/layer/Vector'
import { Vector } from 'ol/source';
import Feature from 'ol/Feature';
import MultiPolygon from 'ol/geom/MultiPolygon';
import {fromExtent} from 'ol/geom/Polygon';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

import Header from './components/Header';
import HeaderSNIG from './components/HeaderSNIG';
import Filters from './components/Filters';
import MetadataList from './MetadataList';
import dataProvider from './utils/dataProvider';
import { getServiceUrl } from './utils';
import { create } from 'domain';


const defaultFilters = [
  {
    "id": "what",
    "type": "AnySNIG",
    "label": "O quê?",
    "query": "anysnig",
    "options": {
      "multi": true
    }
  },
  {
    "id": "where",
    "type": "RegionsSNIG",
    "query": "geometry",
    "label": "Onde?"
  }
];

const defaultSearchParams = {
  from: 1,
  rows: 20,
  sortBy: '',
  sortOrder: ''
};

const _selectedExtentStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0)',
  }),
  stroke: new Stroke({
    color: 'rgba(255, 255, 0, 1)',
    width: 5,
  }),
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.5)',
    }),
    stroke: new Stroke({
      //color: '#fff',
      color: 'rgba(255, 255, 255, 0.5)',
      width: 2,
    })
  })    
});

const _extentStyle = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0)',
  }),
  stroke: new Stroke({
    color: 'rgba(255, 0, 0, 0.5)',
    width: 4,
  }),
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.5)',
    }),
    stroke: new Stroke({
      //color: '#fff',
      color: 'rgba(255, 255, 255, 0.5)',
      width: 2,
    })
  })    
});

const defaultExtentStyle = {
  "style_color": "255, 255, 255, 0",
  "style_stroke_color": "255, 0, 0, 0.5",
  "style_stroke_width": 4
}

const defaultSelectedExtentStyle = {
  "style_color": "255, 255, 255, 0",
  "style_stroke_color": "255, 255, 0, 1",
  "style_stroke_width": 5
}

const buildStyle = (styleFn, style, defaultStyle) => {
  let new_style = {...defaultStyle}
  if (style) {
    new_style = {
      ...new_style,
      ...style
    }
  }
  return styleFn(new_style);
}

let toastEl = null;


export default function CatalogSNIG({ core, viewer, mainMap, config, actions, catalog, utils, componentId, blockPanel }) {

  const { selected_menu } = viewer.config_json
  const { dispatch, Models } = config;
  const { createStyle} = Models.MapModel;
  const { showOnPortal, getWindowSize } = utils;

  const [loaded, setLoaded] = useState(false);

  const [panel, setPanel] = useState(null);

  const [catalog_cfg, setCatalog] = useState(() => {
    const cfg = catalog || {};  
    if (!cfg.sortOptions) {
      cfg.sortOptions = [    
        {label: 'Data de referência', value: 'referenceDateOrd'},
        {label: 'Entidade responsável', value: 'orgNameSNIG'},
        {label: 'Título', value: 'title'},
        {label: 'Tema', value: 'topicCatLang'}
      ];
    }
    return cfg;
  });

  const [searchParams, setSearchParams] = useState(() => {
      const params = {...defaultSearchParams};
      if (Array.isArray(catalog_cfg.sortOptions) && catalog_cfg.sortOptions.length > 0) {
        const found = catalog_cfg.sortOptions.find(s => s.value === catalog_cfg?.sortBy);
        if (found) {
          params.sortBy = catalog_cfg?.sortBy;
        } else {
          params.sortBy = catalog_cfg?.sortOptions[0].value;
        }
      }
      return params;
    });

  const [searchCallback, setSearchCallback] = useState(null);
 
  const [data, setData] = useState(null);

  const [activeRecord, setActiveRecord] = useState(null);

  const [filters, setFilters] = useState(catalog_cfg?.filters?.length ? 
    [...catalog_cfg?.filters] : 
    [...defaultFilters]
  );
  const [filtersItems, setFiltersItems] = useState({});

  const [collapsedFacets, setCollapsedFacets] = useState([]);
  const [selectedFacetValues, setSelectedFacetValues] = useState([]);
  
  /*
  const [extentStyle] = useState(createStyle(catalog?.extents_style || defaultExtentStyle));
  const [selectedExtentStyle] = useState(createStyle(catalog?.record_extent_style || defaultSelectedExtentStyle));
  */

  const [extentStyle] = useState(buildStyle(createStyle, catalog?.extents_style, defaultExtentStyle));
  const [selectedExtentStyle] = useState(buildStyle(createStyle, catalog?.record_extent_style, defaultSelectedExtentStyle));

  const extentsLayer = useRef();


  const wsize = getWindowSize();

  const url = getServiceUrl(catalog_cfg?.url);

  const buildExtentFromGeoBox = (geoBox) => {
    const extents = [];

    const inProj = "EPSG:4326";
    const outProj = mainMap.getView().getProjection();
    
    if (Array.isArray(geoBox)) {
      geoBox.forEach(b => {
        let bbox = (b || "").split("|");
        if (bbox.length) {
          bbox = bbox.map(p => parseFloat(p));
          extents.push(bbox);
        }
      });
    } else {
      let bbox = (geoBox || "").split("|");
      if (bbox.length) {
        bbox = bbox.map(p => parseFloat(p));
        extents.push(bbox);
      }
    }

    // A metadata record can have multiple extents
    const multiPolygon = new MultiPolygon([]);
    extents.forEach(bbox => {
      try {
        // Create a polygon based on the array of coordinates
        const polygon = new fromExtent(bbox);
        multiPolygon.appendPolygon(polygon);
      } catch {}
    });

    multiPolygon.transform(inProj, outProj);

    return multiPolygon;
  }

  const addExtentFromGeoBox = (geoBox, selected) => {
    const multiPolygon = buildExtentFromGeoBox(geoBox);
    if (multiPolygon) {
      const source = extentsLayer.current.getSource();
      // Add the polygon to the layer and style it
      const feature = new Feature(multiPolygon);
      feature.set("isSelected", selected);
      source.addFeature(feature);
      if (selected) {
        feature.setStyle(selectedExtentStyle);
      } else {
        feature.setStyle(extentStyle);
      };
    }
  }

  useEffect(() => {
    if (catalog?.config_url) {
      blockPanel(true);
      const url = catalog?.config_url;
      fetch(url).then(res => {
          return res.json();
      }).then(result => {
        if (result) {
          const params = {...defaultSearchParams};
          if (Array.isArray(result.sortOptions) && result.sortOptions.length > 0) {
            const found = result.sortOptions.find(s => s.value === result?.sortBy);
            if (found) {
              params.sortBy = result?.sortBy;
            } else {
              params.sortBy = result?.sortOptions[0].value;
            }
          }

          setSearchParams(params);          
          const catalog_cfg = {
            ...catalog,
            ...(result || {})
          }
          if (!catalog_cfg.sortOptions) {
            catalog_cfg.sortOptions = [    
              {label: 'Data de referência', value: 'referenceDateOrd'},
              {label: 'Entidade responsável', value: 'orgNameSNIG'},
              {label: 'Título', value: 'title'},
              {label: 'Tema', value: 'topicCatLang'}
            ];
          }
          setCatalog(catalog_cfg);

          if (catalog_cfg?.filters?.length >0) {
            setFilters([...catalog_cfg?.filters]);
          }
        }          
      }).catch(error => {     
        setCatalog(null);
        console.log('error', error);
      }).finally(()=>{
        setTimeout(()=>setLoaded(true), 300);
        blockPanel(false);
      });      
    } else {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mainMap) return;

    // TThe extents layer has already been created
    if (extentsLayer?.current) return;

    const layerId = 'catalog-snig';

    const layer = utils.findOlLayer(mainMap, 'catalog-snig');
    
    if (layer) {
      extentsLayer.current = layer;
    } else {
      extentsLayer.current = new VectorLayer({
        id: layerId,
        renderMode: 'vector',
        source: new Vector({}),
        style: extentStyle,
        selectable: false
      });

      const parentLayer = utils.findOlLayer(mainMap, 'overlays');

      if (parentLayer) {      
        parentLayer.getLayers().getArray().push(extentsLayer.current);
      } else {
        mainMap.addLayer(extentsLayer.current);
      }
    }

  }, [mainMap]);

  useEffect(() => {
    if (!loaded) return;
    searchCatalog();
  }, [searchParams, searchCallback]);

  useEffect(() => {
    if (!loaded) return;
    searchCatalog();
  }, [selectedFacetValues]);

  useEffect(() => {
    const layer = extentsLayer?.current;

    if (!layer) return;

    if (selected_menu != componentId || catalog.show_extents === false) return;

    const source = layer.getSource();
    source.clear();
    
    let records = [];
    if (Array.isArray(data?.metadata)) {
      records = [...data.metadata];
    } else if (data?.metadata) {
      records = [data.metadata];
    }

    records.forEach(m => {
      addExtentFromGeoBox(m.geoBox, false);
    });

    //Refresh map - force render o layer
    mainMap.render();
    
    return () => {
      // unmount
      if (layer) {
        layer.getSource().clear();
        //Refresh map - force render o layer
        mainMap.render();
      }
    }

  }, [data?.metadata, selected_menu]);

  useEffect(() => {
    const layer = extentsLayer?.current;

    if (!layer) return;

    if (selected_menu != componentId || catalog.show_record_extent === false) return;

    const lst = extentsLayer.current.getSource().getFeatures().filter(f => f.get("isSelected") === true);
    if (lst?.length) {
      lst.forEach(f => extentsLayer.current.getSource().removeFeature(f));
    }

    if (activeRecord) {
      addExtentFromGeoBox(activeRecord.geoBox, true);
    }

    //Refresh map - force render o layer
    mainMap.render();

  }, [activeRecord, selected_menu]);

  function setError(message) {
    toastEl.show({
      severity: 'error',
      summary: 'Ocorreu um erro inesperado',
      detail: message
    });
  }

  const onClickFacet = (facet)=> {
    let new_values = [...collapsedFacets];
    if (new_values.includes(facet)) {
      new_values = collapsedFacets.filter(f => f !== facet);
    } else {
      new_values.push(facet);
    }
    setCollapsedFacets(new_values);
  }

  const onClickFacetItem = (facet, value) => {
    // Selects only one item from the same facet at a time
    let new_values = [...selectedFacetValues];
    const found = new_values.find((l => l.facet === facet && l.value===value));
    new_values = new_values.filter(l => l.facet !== facet);
    if (!found) {
      new_values.push({facet, value});
    }
    setSelectedFacetValues(new_values);
  }

  const onSearch = (options) => {
    setSearchParams({
      ...searchParams,
      from: options.from,
      rows: options?.rows
    });
    setSearchCallback(() => options?.callback)
  }

  const onClearSearch = (options) => {
    setFiltersItems({});
    setCollapsedFacets([]);
    setSelectedFacetValues([]);    

    setSearchParams({
      ...searchParams,
      from: 1
    });
    setSearchCallback(() => options?.callback);
  }

  const onSort = (field, order) => {
    setSearchParams({
      ...searchParams,
      sortBy: field,
      sortOrder: order
    });
    setSearchCallback(null);
  }

  const searchCatalog = (options) => {  
    // Filters
    const params = Filters.getQueryParameters(filters, filtersItems) || {};
    // Facets
    if (selectedFacetValues?.length) {
      const facetq = selectedFacetValues.map(item => `${item.facet}/${encodeURIComponent(item.value)}`).join('&');
      params["facet.q"] = facetq;
    }
    // Paging
    const from = options?.from || searchParams.from;
    params.from = from;
    params.to = from  + searchParams.rows - 1;
    // Sort
    params.sortBy = searchParams?.sortBy || '';
    params.sortOrder = searchParams?.sortOrder || '';

    blockPanel(true);

    const provider = dataProvider(url, catalog_cfg);
    const action = (catalog_cfg?.search_action && provider[catalog_cfg?.search_action]) ?
      catalog_cfg.search_action : 'searchCatalogSNIG';

    provider[action](params)
    .then(result => {
      if (!result) throw new Error("O resultado não é válido.");

      setData({...result});
      setPanel('list');

      if (searchCallback) searchCallback();        
    })
    .catch((error)=>{
      console.log(error);
      setError("Não foi possível executar a operação.");
    })
    .finally(()=>blockPanel(false));

    return false;
  };

  if (catalog_cfg === null) return (
      <Message
        className="p-col-12 p-mt-4 p-mb-4"
        severity="error"
        text="Não foi possível carregar o catálogo."
      />
    )

  if (panel==='list') {
    return <React.Fragment>
      {showOnPortal(<Toast ref={(el) => toastEl = el} />)}
      {catalog_cfg?.show_content_header !== false ? catalog_cfg?.content_header ? <Header config={catalog_cfg} /> : <HeaderSNIG /> : null}
      <MetadataList
        core={core}
        viewer={viewer}
        mainMap={mainMap}
        utils={utils}
        actions={actions}
        componentConfig={catalog_cfg}
        data={{
          ...data,
          rows: searchParams.rows,
          sortBy: searchParams.sortBy,
          sortOrder: searchParams.sortOrder,
          collapsedFacets: [...collapsedFacets],
          selectedFacets: [...selectedFacetValues]
        }}
        filters={filters} 
        filtersItems={filtersItems}        
        setError={setError}
        setCollapsedFacets={setCollapsedFacets}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        onSort={onSort}  
        onClickFacet={onClickFacet}
        onClickFacetItem={onClickFacetItem}
        onFilterChange={(filterId, e) => {
          const new_values = {...filtersItems};
          new_values[filterId] = e.value || [];
          setFiltersItems(new_values);
        }}
        onRecordHover={(item) => {
          if (!item) {
            setActiveRecord(null);
          } else {            
            const records = Array.isArray(data?.metadata) ? data?.metadata : data?.metadata ? [data?.metadata] : [];
            try {
              const rec = records.find(d => d == item);
              setActiveRecord(rec);
            } catch (ex) {
              setActiveRecord(null);
            }
          }
        }}
        onRecordClick={(item) => {
          const records = Array.isArray(data?.metadata) ? data?.metadata : data?.metadata ? [data?.metadata] : [];
          const rec = records.find(d => d == item);
          if (rec?.geoBox) {
            try {
              const geom = buildExtentFromGeoBox(rec.geoBox);
              if (geom) {
                setActiveRecord(rec);
                const extent = geom.getExtent();
                if (extent && extent?.length && extent.every(val => isFinite(val))) {
                  dispatch(actions.map_set_extent([extent[2] - extent[0], extent[3] - extent[1]], extent));
                }
              }
            } catch (ex) {}
          }
        }}
      />
    </React.Fragment>
  }

  return (
    <React.Fragment>
      {showOnPortal(<Toast ref={(el) => toastEl = el} />)}
      {catalog_cfg?.show_content_header !== false ? catalog_cfg?.content_header ? <Header config={catalog_cfg} /> : <HeaderSNIG /> : null}
      <div className="p-fluid p-grid p-pt-3">
        <Filters url={url} float_labels={catalog_cfg?.float_labels} filters={filters} filtersItems={filtersItems}
          onFilterChange={(filterId, e) => {
            const new_values = {...filtersItems};
            new_values[filterId] = e.value || [];
            setFiltersItems(new_values);
          }}
          />
      </div>
      <div className="p-grid">
        <div className="p-col" />
        <div className="p-col p-text-right">
          <Button label="Pesquisar" type="button" 
            onClick={(e) => {
              e.preventDefault();
              setSearchParams({
                ...searchParams,
                from: 1
              });
              setSearchCallback(null);
            }} 
          />
        </div>
      </div>
    </React.Fragment>
  );

}
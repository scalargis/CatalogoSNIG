import React, { useEffect, useState } from 'react';

import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';

import Header from './components/Header';
import HeaderSNIG from './components/HeaderSNIG';
import Filters from './components/Filters';
import MetadataList from './MetadataList';
import dataProvider from './utils/dataProvider';
import { getServiceUrl } from './utils';


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

let toastEl = null;


export default function CatalogSNIG({ core, viewer, mainMap, config, actions, catalog, utils, blockPanel }) {

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

  const [filters, setFilters] = useState(catalog_cfg?.filters?.length ? 
    [...catalog_cfg?.filters] : 
    [...defaultFilters]
  );
  const [filtersItems, setFiltersItems] = useState({});

  const [collapsedFacets, setCollapsedFacets] = useState([]);
  const [selectedFacetValues, setSelectedFacetValues] = useState([]);

  const wsize = getWindowSize();

  const url = getServiceUrl(catalog_cfg?.url);
 
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
    if (!loaded) return;
    searchCatalog();
  }, [searchParams, searchCallback]);


  useEffect(() => {
    if (!loaded) return;
    searchCatalog();
  }, [selectedFacetValues]);


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
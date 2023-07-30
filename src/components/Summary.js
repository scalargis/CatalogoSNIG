import React, { useState } from 'react';

import { Button } from 'primereact/button';

import MorphFacet from './Facets/MorphFacet';
import summaryConfig from '../summay.config.json';


export default function Summary({ core, utils, config, title, data, showAll=false, setCollapsedFacets, onClickFacet, onClickFacetItem }) {

  const childProps = { core, utils };

  let _config = {
    ...summaryConfig,
    ...config
  }

  if (config?.use_default === false) {
    _config = {
      ..._config,
      dimensions: (data?.summary?.dimension || [])
        .filter(d => d?.category?.length)
        .map(d=>{ return {key: d['@name'], label: d['@label']}}),      
    }
  }

  const maxDimensions = _config?.maxDimensions || 5;
  const maxRows = _config?.maxRows || 5; 
  
  const [showExtraDimensions, setShowExtraDimensions] = useState(showAll);


  const buildGroup = (group, index) => {

    const facetConfig = (_config?.dimensions || []).find(d => d.key === group?.["@name"]);

    let title = group.title || group?.["@label"];

    //Translate title by facet config
    title = facetConfig?.label || title;

    //Translate title by strings
    title = config?.strings[group?.["@name"]] || config?.strings[group?.["@label"]] ? 
      config?.strings[group?.["@name"]] || config?.strings[group?.["@label"]] : 
      title;

    return <MorphFacet key={index} {...childProps}
      facetId={group?.["@name"]} config={facetConfig}
      items={Array.isArray(group?.category) ? group.category : (group?.category ? [group.category] : [])} 
      title={title}
      maxRows={group?.maxRows || maxRows}
      strings={_config?.strings}
      collapsed={data.collapsedFacets.includes(group?.["@name"])}
      selectedFacets={data.selectedFacets.filter(f => f.facet===group?.["@name"]).map(f => f.value)}
      onClickFacet={onClickFacet}
      onClickFacetItem={onClickFacetItem} />
  }

  const dimensions = [];
  _config.dimensions.forEach((item, index) => {  
    const dimension = data.summary.dimension.find(dim => {
      return dim["@name"] === item.key;
    });

    if (dimension) {
      dimensions.push({...dimension, ...item});
    }
  });

  return (
    <div>

      <div className="p-grid">        
        <div className="p-col-12 p-mt-1 p-text-center">
          <div><strong>{data.summary["@count"]}</strong><span> resultado(s) encontrado(s)</span></div>  
        </div>
      </div>

      {data.summary["@count"] > 0 && <React.Fragment>
        <div className="p-grid p-mt-1">        
          <div className="p-col-12 p-text-center">
            <span className="p-buttonset">
              <Button label="Expandir" icon="pi pi-plus-circle" className="p-button-outlined p-button-sm"
                onClick={() => {
                  setCollapsedFacets([]);                
                }} />
              <Button label="Recolher" icon="pi pi-minus-circle" className="p-button-outlined p-button-sm"
                onClick={() => {
                  setCollapsedFacets(dimensions.map(d=> d["@name"]));
                }}
              />
            </span>
          </div>
        </div>

        <div>
          {dimensions.slice(0, maxDimensions).map((item, index) => buildGroup(item, index))}
        </div>

        {(dimensions.length > _config?.maxDimensions) &&
        <div>
          <h4 className="facet-extras-button" onClick={(e) => setShowExtraDimensions(!showExtraDimensions)}>{showExtraDimensions ? "Ocultar filtros" : "Mostrar mais filtros..."}</h4>
          {showExtraDimensions && <React.Fragment>
            {dimensions.slice(maxDimensions).map((item, index) => buildGroup(item, index))}
          </React.Fragment>}
        </div>}
      </React.Fragment>}
      
    </div>
  );

}
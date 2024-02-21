import React, { useState } from 'react';

import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';


const SearchFacet = ({ core, utils, facetId, config, title, items, strings, selectedFacets, 
  onClickFacet, onClickFacetItem, collapsed=false }) => {

  const [filter, setFilter] = useState('');

  const _items = items || [];

  const facetItemTemplate = ({index, item}) => {
    let title = item["@label"];

    title = strings?.[item["@value"]] || title;
    title = config?.strings?.[item["@value"]] || title;

    return (
      <li key={index} onClick={(e) => {onClickFacetItem(facetId, item["@value"]);}}>
        <label className={`facet-item ${selectedFacets.includes(item["@value"]) ? ' facet-item-selected' : ''}`}>
          <span className="facet-item-label">{title}</span>
          <span className="facet-item-count p-ml-1">({item["@count"]})</span>
        </label>
      </li>
    )
  }

  return (
    <div className={`facet ${collapsed ? 'facet-collapesed' : ''} facet-search ${config?.className || ''}`}>
      <h4 onClick={()=>onClickFacet(facetId)} className="facet-title">
        <i className={`pi ${collapsed ?  'pi-chevron-left' : '' }`} />
        {title}
      </h4>
      { !collapsed && <div>
        <ul className="facet-content">
          <div className="p-flex p-grid">
            <div className="p-col-12">
              <div className="p-inputgroup">
                <InputText placeholder="Filtro" value={filter}
                  className="facet-search-inputtext"
                  onChange={(e) => { 
                    setFilter(e.target.value);
                  }}
                />
                <Button icon="pi pi-times" className="p-button-info"
                  tooltip='Limpar filtro'
                  onClick={(e)=>{
                    setFilter('');
                    if (selectedFacets?.length > 0) {
                      onClickFacetItem(facetId, selectedFacets[0]);
                    }                    
                  }}/>
              </div>
            </div>
            <ul className="p-col-12 facet-search-list">
              {_items.filter(item => {
                  const val = (item["@label"] || '').toLowerCase();
                  return !filter || val.includes(filter.toLocaleLowerCase());
                }).map((item, index) => facetItemTemplate({item, index}))}
            </ul>
          </div>
        </ul>
      </div>}
    </div>
  )

}

export default SearchFacet;

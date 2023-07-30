import React, { useState, useMemo } from 'react';

import { Button } from 'primereact/button';


const getOrderedItems = (items, config, strings) => {
  let _items = [...(items || [])];

  _items = _items.map(item => {
    let txt = item["@label"];

    txt = strings?.[item["@value"]] || txt;
    txt = config?.strings?.[item["@value"]] || txt;

    const val = {...item}
    val['@label'] = txt;

    return val;
  });

  const field = config?.sortField || '@label';
  const order = config?.sortOrder || '';
  if (order.toLowerCase() === 'desc') {
    _items.sort((a, b) => b[field].localeCompare(a[field]));
  } else {
    _items.sort((a, b) => a[field].localeCompare(b[field]));
  }

  const _items_first = _items.filter(a => (!a['@value'].includes('_undefined') && !a['@value'].includes('_other')));
  const _items_last = _items.filter(a => (a['@value'].includes('_undefined') || a['@value'].includes('_other')));
  
  return [..._items_first, ..._items_last];
}

const DefaultFacet = ({ core, utils, facetId, config, title, items, selectedFacets, 
  onClickFacet, onClickFacetItem, maxRows=5, strings={}, collapsed=false}) => {

  const [showExtraRows, setShowsExtraRows] = useState(false);

  const _maxRows = maxRows;
  const _items = useMemo(() => getOrderedItems(items, config, strings), [items]);

  const facetItemTemplate = ({index, item}) => {
    return (
      <li key={index} onClick={(e) => {onClickFacetItem(facetId, item["@value"]);}}>
        <label className={`facet-item ${selectedFacets.includes(item["@value"]) ? ' facet-item-selected' : ''}`}>
          <span class="facet-item-label">{item["@label"]}</span>
          <span class="facet-item-count p-ml-1">({item["@count"]})</span>
        </label>
      </li>
    )
  }

  return (
    <div className={`facet ${collapsed ? 'facet-collapesed' : ''} facet-default ${config?.className || ''}`}>
      <h4 onClick={()=>onClickFacet(facetId)} className="facet-title">
        <i className={`pi ${collapsed ?  'pi-chevron-left' : '' }`} />
        {title}
      </h4>
      { !collapsed && <div>
        <ul className="facet-content">
          {_items.slice(0, _maxRows).map((item, index) => facetItemTemplate({item, index}))}
          {((_items.length > _maxRows) &&  !showExtraRows) && 
          <li>
            <Button label="Ver todos" className="p-button-link"
              onClick={(e) => setShowsExtraRows(true)
              }/>
          </li>}
          {((_items.length > _maxRows) &&  showExtraRows) &&
          <React.Fragment>
            {_items.slice(_maxRows).map((item, index) => facetItemTemplate({item, index}))}
            <li>
              <Button label="Ver menos" className="p-button-link"
                onClick={(e) => setShowsExtraRows(false)
                }/>
            </li>            
          </React.Fragment>}
        </ul>
      </div>}
    </div>
  )

}

export default DefaultFacet;

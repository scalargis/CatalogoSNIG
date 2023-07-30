import React, { useState, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

import dataProvider from '../../utils/dataProvider';
import { getServiceUrl } from '../../utils';


const RegionsFilter = ({id, config, items, onChange}) => {

  const [filteredRegions, setFilteredRegions] = useState(null);

  const inputText = useRef();

  const _id = id || config?.id;

  const searchRegion = (event) => {
    if (!event.query.trim().length) {
      setFilteredRegions([]);
      return true;
    }

    const filter = event.query.trim();
    const url = getServiceUrl(config?.url);

    dataProvider(url).searchRegions({filter, rows: 200})
      .then(result => { 
        let _filteredRegions = [];
        if (result?.length) {
          result.forEach(elem => {
            _filteredRegions.push({name: elem.value, code: elem.uri });
          });
  
          setFilteredRegions([..._filteredRegions]);
        } else {
          setFilteredRegions(null);
        }      
      })
      .catch((error)=>console.log(error))
      .finally(); 
  }


  const child = <AutoComplete id={_id} className="text-filter"         
    multiple
    field="name"
    value={items?.length ? items : (inputText?.current?.value ? [] : null)} 
    suggestions={filteredRegions}        
    completeMethod={searchRegion}
    onChange={onChange}
    onFocus={(e) => {
      inputText.current = e.target;
    }}
    onBlur={(e) => {
      if (inputText?.current?.value) inputText.current.value = '';
    }}           
    onSelect={(e) => {}}
  />

  return (
    <React.Fragment>
    {
      config?.float_labels === false ?
      <React.Fragment>
        <label>{config.label}</label>
        {child}
      </React.Fragment> :
      <span className="p-float-label">
        {child}
        <label htmlFor={_id}>{config.label}</label>
      </span>
    }
    </React.Fragment>
  )   

}

RegionsFilter.getQueryParameters = (items, config) => {
  const params = [];
  if (items?.length) {
    items.forEach(elem => {
      params.push(`region:${elem.code}`);
    });
  }
  return params;
}

export default RegionsFilter;
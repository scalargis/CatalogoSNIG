import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

import dataProvider from '../../utils/dataProvider';
import { getServiceUrl } from '../../utils';


const AnySNIGFilter = ({ id, config, items, onChange }) => {

  const [filteredAnySNIG, setFilteredAnySNIG] = useState(null);
    
  const inputText = useRef();
  const isSelected = useRef(false);

  const _id = id || config?.id;
  
  useEffect(() => {
    if (inputText?.current) inputText.current.value='';    
  }, [items]);

  const searchAnySNIG = (event) => {

    if (!event.query.trim().length) {
      setFilteredAnySNIG([]);
      return true;
    }

    const filter = event.query.trim();
    const url = getServiceUrl(config?.url);

    dataProvider(url).searchAnySNIG(filter)
      .then(result => { 
        let _filteredAnySNIG = [];

        if (result?.length && result[1]?.length) {
          result[1].forEach(elem => {
            _filteredAnySNIG.push({name: elem, code: elem });
          });
  
          setFilteredAnySNIG([..._filteredAnySNIG]);
        } else {
          setFilteredAnySNIG(null);
        }        
      })
      .catch((error)=>console.log(error))
      .finally();
  }  

  const child = <AutoComplete id={_id} className="text-filter" 
    multiple
    field="name"
    value={items?.length ? items : (inputText?.current?.value ? [] : null)}
    suggestions={filteredAnySNIG} 
    completeMethod={searchAnySNIG} 
    onChange={onChange}
    onFocus={(e) => {
      inputText.current = e.target;
    }}
    onBlur={(e) => {          
      isSelected.current = false;
      setTimeout(() => {
          if (!isSelected.current && inputText?.current?.value) {
          const new_values = [...(items || [])];
          const val = inputText.current.value;
          const item = (items || []).find(item => {
            return (item.code || '').toLowerCase() === val.trim().toLowerCase();
          });
          if (!item) {
            onChange({value: [...new_values, {code: val, name: val}]});
          } else {
            inputText.current.value = '';
          }
        }
      }, 300);
    }}
    onSelect={(e) => {
      isSelected.current = true;
      inputText.current.value = '';
    }}
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

AnySNIGFilter.getQueryParameters = (items, config) => {
  if (config?.options?.mode === 'any') {
    return [items.map(elem=>elem.code).join(' or ')];
  }

  const params = [];
  if (items?.length) {
    items.forEach(elem => {
      params.push(elem.code);
    });
  }
  return params;
}

export default AnySNIGFilter;
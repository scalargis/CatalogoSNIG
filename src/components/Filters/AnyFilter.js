import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

import dataProvider from '../../utils/dataProvider';
import { getServiceUrl } from '../../utils';


const AnyFilter = ({ id, config, items, onChange }) => {

  const [filteredAny, setFilteredAny] = useState(null);
    
  const inputText = useRef();
  const isSelected = useRef(false);

  const _id = id || config?.id;
  
  useEffect(() => {
    if (inputText?.current) inputText.current.value='';    
  }, [items]);

  const searchAny = (event) => {

    if (!event.query.trim().length) {
      setFilteredAny([]);
      return true;
    }

    const url = getServiceUrl(config?.url);

    const filter = {
      ...config?.options?.suggest,
      query: event.query.trim()
    }      

    dataProvider(url).searchAny(filter)
      .then(result => { 
        let _filteredAny = [];

        if (result?.length && result[1]?.length) {
          result[1].forEach(elem => {
            _filteredAny.push(elem);
          });
  
          setFilteredAny([..._filteredAny]);
        } else {
          setFilteredAny(null);
        }        
      })
      .catch((error)=>console.log(error))
      .finally();
  }  

  const child = (
    <AutoComplete id={_id} className="text-filter" 
      multiple
      value={items?.length ? items : (inputText?.current?.value ? [] : null)}
      suggestions={filteredAny} 
      completeMethod={searchAny} 
      onChange={onChange}
      onFocus={(e) => {
        inputText.current = e.target;
      }}
      onBlur={(e) => {
        if (config?.options?.forceSelection === true) {
          inputText.current.value = '';
        } else {
          isSelected.current = false;
          setTimeout(() => {
            if (!isSelected.current && inputText?.current?.value) {
              const new_values = [...(items || [])];
              const val = inputText.current.value;
              const item = (items || []).find(item => {
                return (item.code || '').toLowerCase() === val.trim().toLowerCase();
              });
              if (!item) {
                onChange({value: [...new_values, val]});
              } else {
                inputText.current.value = '';
              }
            }
          }, 300);
        }
      }}
      onSelect={(e) => {
        isSelected.current = true;
        inputText.current.value = '';
      }}
    />
  );

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

AnyFilter.getQueryParameters = (items, config) => { 
  if (config?.options?.mode === 'any') {
    return [items.join(' or ')];
  }

  const params = [];
  if (items?.length) {
    items.forEach(elem => {
      params.push(elem);
    });
  }
  return params;
}

export default AnyFilter;
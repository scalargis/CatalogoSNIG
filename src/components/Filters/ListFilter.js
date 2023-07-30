import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

import dataProvider from '../../utils/dataProvider';
import { getServiceUrl } from '../../utils';


const getOrderedItems = (items, config) => {
  let _items = [...(items || [])];

  const field = config?.sortField || 'name';
  const order = config?.sortOrder || '';
  if (order.toLowerCase() === 'desc') {
    _items.sort((a, b) => b[field].localeCompare(a[field]));
  } else {
    _items.sort((a, b) => a[field].localeCompare(b[field]));
  }

  return [..._items];
}

const ListFilter = ({ id, config, items, onChange }) => {

  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState(null);
    
  const inputText = useRef();

  const _id = id || config?.id;
  
  useEffect(() => {
    if (!config?.options?.source) return;

    if (config?.options?.source?.type === "codelist" && !config?.options?.source?.path) return


    const url = getServiceUrl(config?.url);    

    if (config?.options?.source?.type === "codelist") {
      dataProvider(url).getCodeList(config.options.source.path)
      .then(result => {      
        let _list = [];

        Object.entries(result).forEach(elem => {
          _list.push({code: elem[0], name: elem[1]});
        });

        if (config?.sortField) _list = getOrderedItems(_list, config);

        setList(_list);
      })
      .catch((error)=>console.log(error))
      .finally();

      return;
    }

    if (config?.options?.source?.type === "suggests") {
      const filter = {
        field: config?.options?.source?.field,
        sortBy: config?.options?.source?.sortBy,
        q: ''
      }

      dataProvider(url).searchAny(filter)
      .then(result => { 
        let _list = [];
        if (result?.length && result[1]?.length) {
          result[1].forEach(elem => {
            _list.push({code: elem, name: elem});
          });

          if (config?.sortField) _list = getOrderedItems(_list, config);

          setList(_list);
        }        
      })
      .catch((error)=>console.log(error))
      .finally();

      return;
    }    
    
  }, []);

  useEffect(() => {
    if (inputText?.current) inputText.current.value='';    
  }, [items]);

  const searchList = (event) => {
    if (!event?.query) { 
      setFilteredList([...list]);
      return;
    }

    let query = event.query;
    let filteredItems = list.filter((item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    setFilteredList(filteredItems || []);
  }  

  const child = <AutoComplete id={_id} className="text-filter"
      dropdown 
      multiple
      field="name"
      value={items?.length ? items : (inputText?.current?.value ? [] : null)}
      suggestions={filteredList} 
      completeMethod={searchList} 
      onChange={onChange}
      onFocus={(e) => {
        inputText.current = e.target;
      }}
      onBlur={(e) => {
        inputText.current.value = '';
      }}
      onSelect={(e) => {
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

ListFilter.getQueryParameters = (items, config) => { 
  if (config?.options?.mode === 'any') {
    const list = config?.options?.field === 'code' ? items.map(d=>d.code) : items.map(d=>d.name);
    return [list.join(' or ')];
  }

  const params = [];
  if ( items?.length) {
    const list = config?.options?.field === 'code' ? items.map(d=>d.code) : items.map(d=>d.name);
    list.forEach(elem => {
      params.push(elem);
    });
  }
  return params;
}

export default ListFilter;
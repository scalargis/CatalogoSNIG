import React, { useState, useEffect } from 'react';

import TokenAutocomplete from './TokenAutocomplete';
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


const TagsFilter = ({ id, config, items, onChange }) => {

  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState(null);

  const _id = id || config?.id;

  useEffect(() => {
    if (!config?.options?.source) return;

    const url = getServiceUrl(config?.url);

    dataProvider(url).getCodeList(config.options.source.path)
    .then(result => {
      let _list = [];
      result.forEach(elem => {
        const val = config.options.source.lang ? elem.label[config.options.source.lang] : elem.name;
        _list.push({code: elem.name, name: val});
      });

      if (config?.sortField) _list = getOrderedItems(_list, config);

      setList(_list);
    })
    .catch((error)=>console.log(error))
    .finally();

    return;

  }, []);

  const searchList = (event) => {
    if (!event?.query) {
      setFilteredList([...list]);
      return;
    }

    let query = event.query;
    let filteredItems = list.filter((item) => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    setFilteredList(filteredItems || []);
  }

  return (
    <TokenAutocomplete
      id={_id}
      className="text-filter"
      label={config.label}
      value={items || []}
      field="name"
      dropdown
      suggestions={filteredList}
      onSearch={searchList}
      onChange={onChange}
    />
  )

}

TagsFilter.getQueryParameters = (items, config) => {
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

export default TagsFilter;

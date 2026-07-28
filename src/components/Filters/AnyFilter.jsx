import React, { useState } from 'react';

import TokenAutocomplete from './TokenAutocomplete';
import dataProvider from '../../utils/dataProvider';
import { getServiceUrl } from '../../utils';


const AnyFilter = ({ id, config, items, onChange }) => {

  const [filteredAny, setFilteredAny] = useState(null);

  const _id = id || config?.id;

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

  return (
    <TokenAutocomplete
      id={_id}
      className="text-filter"
      label={config.label}
      value={items || []}
      suggestions={filteredAny}
      onSearch={searchAny}
      onChange={onChange}
      allowFreeText={config?.options?.forceSelection !== true}
    />
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

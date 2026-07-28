import React, { useState } from 'react';

import TokenAutocomplete from './TokenAutocomplete';
import dataProvider from '../../utils/dataProvider';
import { getServiceUrl } from '../../utils';


const AnySNIGFilter = ({ id, config, items, onChange }) => {

  const [filteredAnySNIG, setFilteredAnySNIG] = useState(null);

  const _id = id || config?.id;

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

  return (
    <TokenAutocomplete
      id={_id}
      className="text-filter"
      label={config.label}
      value={items || []}
      field="name"
      suggestions={filteredAnySNIG}
      onSearch={searchAnySNIG}
      onChange={onChange}
      allowFreeText
    />
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

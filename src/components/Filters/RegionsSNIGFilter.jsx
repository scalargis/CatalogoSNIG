import React, { useState } from 'react';

import TokenAutocomplete from './TokenAutocomplete';
import dataProvider from '../../utils/dataProvider';
import { getServiceUrl } from '../../utils';


const RegionsFilter = ({id, config, items, onChange}) => {

  const [filteredRegions, setFilteredRegions] = useState(null);

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

  return (
    <TokenAutocomplete
      id={_id}
      className="text-filter"
      label={config.label}
      value={items || []}
      field="name"
      suggestions={filteredRegions}
      onSearch={searchRegion}
      onChange={onChange}
    />
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

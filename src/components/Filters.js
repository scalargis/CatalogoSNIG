import React from 'react';

import MorphFilter from './Filters/MorphFilter';


const Filters = ({url, float_labels, filters, filtersItems, onFilterChange}) => {

  const _filters = filters || [];

  return (
    <React.Fragment>
      {_filters.map((f, index) => 
        <div key={index} className="p-col-12">
          <MorphFilter config={{...f, url, float_labels}} items={filtersItems[f.id] || null} onChange={(e) => onFilterChange(f.id, e)} />
        </div>
      )}
    </React.Fragment>
  );
}

Filters.getQueryParameters = (filters, filtersItems) => {
  const params = {};
  filters.forEach(f => {
    if (f.id && filtersItems[f.id]?.length) {
      const vals = MorphFilter.getQueryParameters(filtersItems[f.id], f);
      if (vals?.length) {
        if (Array.isArray(f.query)) {
          f.query.forEach((query, index) => {
            if (vals[index]) {
              params[query] = [vals[index]];
            }
          });          
        } else {
          params[f.query] = [...vals];
        }
      }
    }
  });
  return params;
}

export default Filters;
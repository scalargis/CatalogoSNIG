import React from "react";

import components from './index.js';

const getComponent = (type) => {
  if (!type) return null;
  
  const FilterComponent = components[type];

  if (!FilterComponent) return null;

  return FilterComponent
}

const MorphFilter = ({ config, items, onChange }) => {

  if (!config?.type) return null;

  // Create component layer
  const FilterComponent = getComponent(config.type);

  if (!FilterComponent) return null;

  // Render component layer
  return (
    <FilterComponent 
      key={config?.id}
      config={{
        ...config
      }}
      items={items}
      onChange={onChange}
    />
  )

};

MorphFilter.getQueryParameters = (items, config) => {
  if (!config?.type) return null;

  const component = getComponent(config.type);

  if (!component) return null;

  return component.getQueryParameters(items, config);
}

export default MorphFilter;
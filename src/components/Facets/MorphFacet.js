import React from "react";

import components from './index.js';

const getComponent = (type) => {
  const _type = type || 'Default';
  
  const FacetComponent = components[_type];

  if (!FacetComponent) return getComponent("Default");

  if (!FacetComponent) return null;

  return FacetComponent;
}

const MorphFacet = ({ core, utils, facetId, config, title, items, selectedFacets, 
  onClickFacet, onClickFacetItem, maxRows=5, strings={}, showFilter=false, collapsed=false }) => {

  // Create component layer
  const FacetComponent = getComponent(config?.type);

  if (!FacetComponent) return null;

  // Render component layer
  return (
    <FacetComponent
      core={core}
      utils={utils}
      facetId={facetId} 
      config={config}
      items={items} 
      title={title}
      maxRows={maxRows}
      strings={strings}
      collapsed={collapsed}
      selectedFacets={selectedFacets}
      onClickFacet={onClickFacet}
      onClickFacetItem={onClickFacetItem} />
  )

};

export default MorphFacet;
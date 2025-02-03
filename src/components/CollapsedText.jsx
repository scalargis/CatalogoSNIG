import React, { useState } from "react";
import { Button } from 'primereact/button';

function CollapsedText(props) {

  const { text, maxLength, showAll } = props;
  
  const [collapsed, setCollapsed] = useState(!showAll);

  if ((text || '').length > maxLength) {
    const label = collapsed ? "... mais" : "... menos";
    return <>
      <span>{collapsed ? text.substring(0, maxLength || 300) : text}</span>
      <Button label={label} className="p-button-link" onClick={(e) => {
        e.preventDefault();
        setCollapsed(!collapsed);
      }} />
    </>
  }

  return text;

}

export default CollapsedText;
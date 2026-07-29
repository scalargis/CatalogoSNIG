import React, { useState } from "react";
import { Button } from '@mantine/core';

function CollapsedText(props) {

  const { text, maxLength, showAll } = props;

  const [collapsed, setCollapsed] = useState(!showAll);

  if ((text || '').length > maxLength) {
    const label = collapsed ? "... mais" : "... menos";
    return <>
      <span>{collapsed ? text.substring(0, maxLength || 300) : text}</span>
      <Button variant="subtle" size="compact-sm" onClick={(e) => {
        e.preventDefault();
        setCollapsed(!collapsed);
      }}>{label}</Button>
    </>
  }

  return text;

}

export default CollapsedText;

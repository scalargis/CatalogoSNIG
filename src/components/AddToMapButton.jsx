import React, { useEffect, useState } from 'react';

import { Button, Menu } from '@mantine/core';
import { IconPlus, IconRefresh, TourTarget } from '@scalargis/ui';

import { getViewLinks } from '../utils';
import { registerServicesMenu } from '../onboardingMenuBridge';


export default function AddToMapButton({ core, utils, componentConfig, data, className, size, firstResult = false }) {

  const links = (getViewLinks(data) || []).filter((l) => {
    if (Array.isArray(componentConfig?.allow_service_types)) {
      return componentConfig?.allow_service_types.includes(l.type.toUpperCase());
    }
    return true;
  });

  // The first result's menu is the tour's services target (improvement 03).
  // Control it so the tour before/after hooks can open and close it through the
  // bridge. Other rows keep the plain uncontrolled menu.
  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (!firstResult) return;
    return registerServicesMenu(setOpened);
  }, [firstResult]);

  if (!links.length) return null;

  const items = links.map((l, idx) => (
    <Menu.Item key={idx} title={l.url} leftSection={<IconRefresh />}
      onClick={() => {
        core.pubsub.publish("ThemeWizard/AddService", { type: l.type, url: l.url, callback: null });
      }}>
      {l.type}
    </Menu.Item>
  ));

  return (
    <Menu shadow="md" position="bottom-end"
      opened={firstResult ? opened : undefined}
      onChange={firstResult ? setOpened : undefined}>
      <Menu.Target>
        <Button variant="outline" size={size} className={className} leftSection={<IconPlus />} style={{ flexShrink: 0 }}>Mapa</Button>
      </Menu.Target>
      <Menu.Dropdown>
        {firstResult
          ? <TourTarget id="catalogosnig:add-map-services"><div>{items}</div></TourTarget>
          : items}
      </Menu.Dropdown>
    </Menu>
  )
}

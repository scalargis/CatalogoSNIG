import React, { useEffect, useRef, useState } from 'react';

import { Button, Menu } from '@mantine/core';
import { IconPlus, IconRefresh, TourTarget } from '@scalargis/ui';

import { getViewLinks } from '../utils';
import { registerServicesMenu } from '../onboardingMenuBridge';


/** The services of a record that the "+ Mapa" menu offers. */
export function addMapLinks(data, componentConfig) {
  return (getViewLinks(data) || []).filter((l) => {
    if (Array.isArray(componentConfig?.allow_service_types)) {
      return componentConfig?.allow_service_types.includes(l.type.toUpperCase());
    }
    return true;
  });
}

export default function AddToMapButton({ core, utils, componentConfig, data, className, size, tourRecord = false }) {

  const links = addMapLinks(data, componentConfig);

  // The tour record's menu is the tour's services target.
  // Control it so the tour before/after hooks can open and close it through the
  // bridge. Other rows keep the plain uncontrolled menu.
  const [opened, setOpened] = useState(false);
  const buttonRef = useRef(null);
  useEffect(() => {
    if (!tourRecord) return;
    return registerServicesMenu(setOpened, () => buttonRef.current);
  }, [tourRecord]);

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
      opened={tourRecord ? opened : undefined}
      onChange={tourRecord ? setOpened : undefined}>
      <Menu.Target>
        <Button ref={buttonRef} variant="outline" size={size} className={className} leftSection={<IconPlus />} style={{ flexShrink: 0 }}>Mapa</Button>
      </Menu.Target>
      <Menu.Dropdown>
        {tourRecord
          ? <TourTarget id="catalogosnig:add-map"><div>{items}</div></TourTarget>
          : items}
      </Menu.Dropdown>
    </Menu>
  )
}

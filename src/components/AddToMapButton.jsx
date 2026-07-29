import React from 'react';

import { Button, Menu } from '@mantine/core';
import { IconPlus, IconRefresh } from '@scalargis/ui';

import { getViewLinks } from '../utils';


export default function AddToMapButton({ core, utils, componentConfig, data, className, size }) {

  const links = (getViewLinks(data) || []).filter((l) => {
    if (Array.isArray(componentConfig?.allow_service_types)) {
      return componentConfig?.allow_service_types.includes(l.type.toUpperCase());
    }
    return true;
  });

  if (!links.length) return null;

  return (
    <Menu shadow="md" position="bottom-end">
      <Menu.Target>
        <Button variant="outline" size={size} className={className} leftSection={<IconPlus />}>Mapa</Button>
      </Menu.Target>
      <Menu.Dropdown>
        {links.map((l, idx) => (
          <Menu.Item key={idx} title={l.url} leftSection={<IconRefresh />}
            onClick={() => {
              core.pubsub.publish("ThemeWizard/AddService", { type: l.type, url: l.url, callback: null });
            }}>
            {l.type}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  )
}

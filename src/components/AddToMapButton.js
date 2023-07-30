import React, { useRef } from 'react';

import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';

import { getViewLinks } from '../utils';


export default function AddToMapButton({ core, utils, componentConfig, data, className }) {

  const menu = useRef(null);

  const links = (getViewLinks(data) || []).filter((l) => {
    if (Array.isArray(componentConfig?.allow_service_types)) {
      return componentConfig?.allow_service_types.includes(l.type.toUpperCase());
    }
    return true;
  }).map(l => {
    return { 
      label: l.type,
      icon: 'pi pi-refresh',
      template: (item, options) => {
        return (
            /* custom element */
            <a className={options.className} target={item.target} onClick={options.onClick} title={l.url}>
              <span className={options.labelClassName}>{item.label}</span>
            </a>
        );
      },
      command: (e) => {
        const data = {
          type: l.type,
          url: l.url
        }
        core.pubsub.publish("ThemeWizard/AddService", {...data, callback: null});
      }
    }
  });

  if (!links.length) return null;

  return (
    <div>
      <Menu model={links} popup ref={menu} id="popup_menu" />
      <Button className={`p-button-outlined ${className}`} label="Mapa" icon="pi pi-plus" onClick={(event) => menu.current.toggle(event)} aria-controls="popup_menu" aria-haspopup />
    </div>
  )
}
import React, { useState, useRef } from 'react';
import { ActionIcon, LoadingOverlay, Paper, Text } from '@mantine/core';

import Catalogs from './Catalogs';
import CatalogSNIG from './CatalogSNIG';

import './style.css';

/**
 * Round main-menu button — the viewer plugin-contract control Core.jsx mounts
 * in the sidebar strip. Mirrors libs/components MainMenuButton: `active`
 * derives from the shell's `p-button-outlined` className contract, and the
 * `p-button-*` tokens are stripped before reaching the DOM.
 */
function MainMenuButton({ className = '', title, style, icon, onClick, children }) {
  const isActive = !String(className).includes('p-button-outlined');
  const passthrough = String(className)
    .split(/\s+/)
    .filter((c) => c && !c.startsWith('p-button'))
    .join(' ');

  return (
    <ActionIcon
      type="button"
      variant={isActive ? 'filled' : 'outline'}
      size={38}
      radius="xl"
      className={passthrough || undefined}
      style={style}
      title={title}
      aria-label={title}
      aria-pressed={isActive}
      onClick={onClick}
    >
      {children ?? (React.isValidElement(icon) ? icon : <i className={icon} aria-hidden="true" />)}
    </ActionIcon>
  );
}

/**
 * Main menu component
 */
export function MainMenu({ className, config, actions, record }) {

  const title = record?.title || "Catálogo de Metadados"

  if (record && record.target === 'mainmenu') {

      if (record?.config_json?.btn_image) {
        return (
          <MainMenuButton
            title={title}
            className={className ? className + ' catalog-snig-main-menu-btn' : ''}
            style={{ backgroundImage: `url("${record.config_json.btn_image}")` }}
            onClick={e => config.dispatch(actions.viewer_set_selectedmenu(record.id))}
          >
            <span />
          </MainMenuButton>
        )
      }

      return (
          <MainMenuButton
            title={title}
            className={className}
            icon={record?.config_json?.btn_icon ? record.config_json.btn_icon : "pi pi-book"}
            onClick={e => config.dispatch(actions.viewer_set_selectedmenu(record.id))}
          />
      )
    } else {
      return null;
    }
}

export default function Main(props) {

  const {as, core, config, actions, record, utils} = props;
  const { viewer, mainMap } = config;

  const component_cfg = record.config_json || {};
  const header = component_cfg.header;

  const ref = useRef(null);
  const [blockedPanel, setBlockedPanel] = useState(false);

  const className = config?.classname ? `catolog-snig ${config?.classname}` : 'catolog-snig';

  function renderContent() {

    if (Array.isArray(component_cfg?.catalogs) || component_cfg?.catalogs?.url) {
      return (
        <Catalogs
          core={core}
          config={config}
          actions={actions}
          viewer={viewer}
          mainMap={mainMap}
          record={record?.config_json}
          utils={utils}
          componentId={record?.id}
          blockPanel={setBlockedPanel}
        />
      )
    }

    return (
      <CatalogSNIG
        core={core}
        config={config}
        actions={actions}
        viewer={viewer}
        mainMap={mainMap}
        catalog={record?.config_json}
        utils={utils}
        componentId={record?.id}
        blockPanel={setBlockedPanel}
      />
    )
  }

  if (as === 'panel') return (
    <div ref={ref} style={{height: 'calc(100%)', position: 'relative'}}>
      <LoadingOverlay visible={blockedPanel} zIndex={1003}
        loaderProps={{ size: 50 }} overlayProps={{ blur: 1 }} />
      <Paper className={className} p="md" withBorder>
        { header && <Text fw={600} mb="sm">{header}</Text> }
        { renderContent() }
      </Paper>
    </div>

  )

  // Render component
  return renderContent()
}

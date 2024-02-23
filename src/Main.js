import React, { useState, useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Panel } from 'primereact/panel';
import { ProgressSpinner } from 'primereact/progressspinner';

import Catalogs from './Catalogs';
import CatalogSNIG from './CatalogSNIG';


/**
 * Main menu component
 */
export function MainMenu({ className, config, actions, record }) {

  const title = record?.title || "Catálogo de Metadados"

  if (record && record.target === 'mainmenu') {

      if (record?.config_json?.btn_image) {
        return (
          <Button
            title={title}
            className={className ? className + ' catalog-snig-main-menu-btn' : null}
            icon="pi"
            style={{ margin: '0.5em 1em', backgroundImage: `url("${record.config_json.btn_image}")` }}
            onClick={e => config.dispatch(actions.viewer_set_selectedmenu(record.id))}
          />
        )
      }

      return (
          <Button
            title={title}
            className={className}
            icon="pi pi-book"
            style={{ margin: '0.5em 1em' }}
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


  const getBlockFullHeight = () => {

    const oDiv = ref.current;
    
    let clientHeight = 0;
    let height = 0;
    
    try {
      clientHeight = oDiv.clientHeight;
    
      const sOriginalOverflow = oDiv.style.overflow;
      const sOriginalHeight = oDiv.style.height;
      oDiv.style.overflow = "";
      oDiv.style.height = "";

      height = oDiv.offsetHeight;
      oDiv.style.height = sOriginalHeight;
      oDiv.style.overflow = sOriginalOverflow;
    } catch {}
        
    return clientHeight > height ? clientHeight : height;
  }

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
    <div ref={ref} className="p-blockui-container" style={{height: 'calc(100%)'}}>
      <Panel header={header} className={className}>
        { renderContent() }
      </Panel>
      { blockedPanel && <div className="p-blockui p-component-overlay p-component-overlay-enter" style={{zIndex: 1003, height: getBlockFullHeight()}}>
        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" fill="#EEEEEE" animationDuration=".5s"/>
      </div> }
    </div>

  )  

  // Render component
  return renderContent()
}
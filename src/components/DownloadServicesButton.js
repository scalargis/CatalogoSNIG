import React, { useState } from 'react';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { copyToClipboard, getDownloadLinks } from '../utils';


export default function DownloadServicesButton({ core, utils, data, className }) {
  const { getWindowSize, showOnPortal } = utils;

  const [showForm, setShowForm] = useState(false);
  
  const wsize = getWindowSize();
  const isMobile = wsize[0] <= 768;
  

  const openForm = () => {
    setShowForm(true);
  }

  const footer = (
    <div>
        <Button label="Fechar" icon="pi pi-times" onClick={()=>setShowForm(false)} />
    </div>
  );  

  const links = getDownloadLinks(data) || [];

  if (!links.length) return null;

  return (
    <React.Fragment>
      <Button icon="pi pi-download" className={`p-button-outlined p-button-info ${className} p-mr-1`}
        tooltip="Ver Url de serviço de descarregamento (Ficheiro, WFS, WCS, ATOM)"
        onClick={e => openForm()}
      />      

      {showOnPortal(<Dialog
        header={data?.title || 'Serviços de Visualização'}
        footer={footer}
        visible={showForm}
        style={{width: isMobile ? '90%' : '35vw' }} 
        modal 
        onHide={e => setShowForm(false)}>
          { links.map((l, idx) => {
            return <div key={idx}>
              <div><strong>{l.type}:</strong></div>              
              <div className="p-grid">
                <div className="p-col-12 p-md-11" style={{"wordBreak": "break-all"}}>
                  {l.url}
                </div>
                <div className="p-col-12 p-md-1">
                  <Button
                    style={{marginLeft:"0px", color: "#2196F"}} 
                    icon="pi pi-copy"
                    className="p-button-sm p-button-rounded p-button-outlined p-button-help p-button-icon-only"
                    onClick={(e) => { e.preventDefault(); e.currentTarget.blur(); copyToClipboard(l.url) }}
                    tooltip="Copiar Url" tooltipOptions={{position: 'top'}}
                  />
                </div>
              </div>
            </div>
          }) }
      </Dialog>)}

    </React.Fragment>
  )
}

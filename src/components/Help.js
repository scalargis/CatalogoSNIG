import React, { useState, useRef } from 'react';
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'


export function Help(props)  {
  const { className, style, utils, catalog } = props;

  const { getWindowSize, showOnPortal } = utils;

  const [showPopup, setShowPopup] = useState(false);
  const [size, setSize] = useState(null);
  const [maximized, setMaximized] = useState(false);

  const dialog = useRef();

  const config = catalog?.help ? catalog.help : {};

  const wsize = getWindowSize();
  const isMobile = wsize[0] <= 768;

  const show = props.showButton || (config?.url || config?.html || config?.description || catalog?.description);
  const disabled = props.disabled === true || !(config?.url || config?.html || config?.description || catalog?.description);

  if (config.as === 'popup' && show) {    
    const closeLabel = "Fechar";    
    return (
      <React.Fragment>

        <Button
          ref={el => {
            if (el) {
              el.style.setProperty('border-radius', '50%', 'important');
            }
          }}        
          title={config?.title || catalog?.title || 'Informação'}
          className={className}
          style={style}
          icon="pi pi-info-circle"
          disabled={disabled}
          onClick={e => { e.preventDefault(); setShowPopup(true) }}
        />

        {showOnPortal(<Dialog
          ref={dialog}        
          header={config?.title || catalog?.title || 'Informação'}
          visible={showPopup}
          style={{width: isMobile ? '90%' : '50vw', height: '80%' }}
          maximizable
          maximized={maximized} 
          modal
          footer={(
            <div className="p-grid">
              <div className="p-col" style={{ textAlign: 'right'}}>
                <Button label={closeLabel} onClick={e => setShowPopup(false)} />
              </div>
            </div>
          )}
          onShow={() => {
            const elem = dialog.current.contentEl;
            setSize({x: elem.clientWidth, y: elem.clientHeight - 25 });
          }}
          onResize={e => {
            const elem = dialog.current.contentEl;
            setSize({x: elem.clientWidth, y: elem.clientHeight - 25 });
          }}
          onMaximize={e => {
            setMaximized(e.maximized);
            const elem = dialog.current.contentEl;
            setTimeout(() => {setSize({x: elem.clientWidth, y: elem.clientHeight - 25 }, 200)});
          }}
          onHide={e => setShowPopup(false)}>

          {(() => {
            if (config.url) {
              return (
                <iframe title={config.title || 'Ajuda'} src={config.url} style={ size ? { border: 'none', width: '100%', height: size.y } : {border: 'none', width: '100%'}}></iframe>
              )
            } else if (config.html) {
              return (
                <div dangerouslySetInnerHTML={{__html: config.html}} />
              )
            } else if (config.description || catalog.description) {
              return (
                <div>{catalog.description || catalog.description || ''}</div>
              )            
            } else {
              return null;
            }
          })()}            
          
        </Dialog>)}

      </React.Fragment>
    )
  } else if (config.as === 'external' && show) { 
    return (
      <Button
        title={config?.title || catalog?.title || 'Informação'}
        className={className}
        icon="pi pi-info-circle"
        disabled={props.disabled || !config.url}
        onClick={e => { e.preventDefault(); window.open(config.url)}} />
    )
  } else if (props.showButton) {
    return (
      <Button
        title={config?.title || catalog?.title || 'Informação'}
        className={className}
        icon="pi pi-info-circle"
        disabled={true} />
    )    
  } else {
    return null;
  }
}
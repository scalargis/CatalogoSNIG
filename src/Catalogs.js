import React, { useEffect, useState} from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';

import CatalogSNIG from './CatalogSNIG';
import { Help } from './components/Help';

export default function Catalogs ({core, viewer, mainMap, config, actions, record, utils, componentId, extentsLayer, blockPanel}) {

  const [selected, setSelected] = useState(-1);

  const [catalogs, setCatalogs] = useState([]);


  useEffect(() => {
    if (Array.isArray(record?.catalogs)) {
      setCatalogs(record?.catalogs.map((cat, index) => {return { label: cat.title, value: index, data: cat }}));
      return;
    }

    if (record?.catalogs?.url) {
      const url = record?.catalogs?.url;
      fetch(url).then(res => {
        return res.json();
      }).then(result => {
        if (Array.isArray(result)) {
          setCatalogs(result.map((cat, index) => {return { label: cat.title, value: index, data: cat }}));

          if (result?.length > 0 && record?.selectedCatalog != null ) {
            let selectedIndex;
            if (Number.isInteger(record?.selectedCatalog)) {
              selectedIndex = record.selectedCatalog;
            } else {
              selectedIndex = result.findIndex(v => v.id === record.selectedCatalog);
            }
            if (selectedIndex >= 0 && selectedIndex < result?.length) {
              setSelected(selectedIndex);
            }
          }
        }
      }).catch(error => {        
          console.log('error', error);
      });
    }
  }, []);
  
  const catalog = selected >=0 ? {
      ...catalogs[selected].data,
      show_content_header: record.show_content_header,
      key: `cat${selected}`
    } : null;

  return (
    <React.Fragment>

      <div className="p-fluid p-grid">
        <div className="p-col-12">
          <h3>Catálogos de Metadados</h3>
          {selected < 0 && <Message
              className="p-mt-2 p-mb-4"
              severity="info"
              text="Escolha um dos catálogos de metadados disponíveis"
            />}
          <div className="p-inputgroup p-mt-2">
            <Dropdown value={selected} 
              placeholder="Catálogos..."
              emptyMessage="Não existem catálogos"
              options={catalogs} itemTemplate={(option)=><div>{option.label}</div>}
              onChange={(e) => setSelected(e.value)} />
            <Help
                className="p-button-rounded p-button-text p-ml-1 p-mt-1 btn-help"
                utils={utils}
                catalog={catalog}
                showButton={true}
                disabled={selected < 0}
              />
          </div>
        </div>
      </div>

      { selected >= 0 && <CatalogSNIG
        key={`cat${selected}`}
        core={core}
        config={config}
        actions={actions}
        viewer={viewer}
        mainMap={mainMap}
        catalog={catalog}
        utils={utils}
        componentId={componentId}
        extentsLayer={extentsLayer}
        blockPanel={blockPanel}
      /> }

    </React.Fragment>
  );

}

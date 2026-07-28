import React, { useEffect, useState} from 'react';
import { Alert, Group, Select } from '@mantine/core';

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

  // Mantine Select values are strings; the catalog index is kept as the value.
  const selectData = catalogs.map((cat) => ({ value: String(cat.value), label: cat.label }));

  return (
    <React.Fragment>

      <div className="grid">
        <div className="col-12">
          <h3>Catálogos de Metadados</h3>
          {selected < 0 && <Alert
              className="mt-2 mb-4"
              color="informative"
              variant="light"
            >Escolha um dos catálogos de metadados disponíveis</Alert>}
          <Group gap="xs" align="flex-end" wrap="nowrap" className="mt-2">
            <Select
              style={{ flex: 1 }}
              value={selected >= 0 ? String(selected) : null}
              placeholder="Catálogos..."
              nothingFoundMessage="Não existem catálogos"
              data={selectData}
              onChange={(value) => setSelected(value == null ? -1 : parseInt(value))} />
            <Help
                className="btn-help"
                utils={utils}
                catalog={catalog}
                showButton={true}
                disabled={selected < 0}
              />
          </Group>
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

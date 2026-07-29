import React, { useState } from 'react';

import { ActionIcon, Button, Group, Tooltip } from '@mantine/core';
import { Dialog, IconCopy } from '@scalargis/ui';
import { copyToClipboard, getViewLinks } from '../utils';


export default function ViewServicesButton({ core, utils, data, className, size }) {

  const [showForm, setShowForm] = useState(false);

  const openForm = () => {
    setShowForm(true);
  }

  const links = getViewLinks(data) || [];

  if (!links.length) return null;

  return (
    <React.Fragment>
      <Tooltip label="Ver Url de serviço de visualização (WMS, WMS-C, WMTS)">
        <ActionIcon variant="outline" color="informative" size={size} className={`${className || ''} mr-1`}
          aria-label="Serviços de visualização"
          onClick={e => openForm()}>
          <span className="pi pi-map" />
        </ActionIcon>
      </Tooltip>

      <Dialog
        title={data?.title || 'Serviços de Visualização'}
        opened={showForm}
        onClose={() => setShowForm(false)}
        footer={
          <Group justify="flex-end">
            <Button leftSection={<span className="pi pi-times" />} onClick={()=>setShowForm(false)}>Fechar</Button>
          </Group>
        }>
        { links.map((l, idx) => {
          return <div key={idx}>
            <div><strong>{l.type}:</strong></div>
            <div className="grid">
              <div className="col-12 md:col-11" style={{"wordBreak": "break-all"}}>
                {l.url}
              </div>
              <div className="col-12 md:col-1">
                <Tooltip label="Copiar Url" position="top">
                  <ActionIcon variant="outline" color="grape" radius="xl" size="sm"
                    aria-label="Copiar Url"
                    onClick={(e) => { e.preventDefault(); e.currentTarget.blur(); copyToClipboard(l.url) }}>
                    <IconCopy />
                  </ActionIcon>
                </Tooltip>
              </div>
            </div>
          </div>
        }) }
      </Dialog>

    </React.Fragment>
  )
}

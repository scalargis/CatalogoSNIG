import React, { useState } from 'react';
import { ActionIcon, Button, Group } from '@mantine/core';
import { Dialog, IconInfoCircle } from '@scalargis/ui';


export function Help(props)  {
  const { className, style, catalog } = props;

  const [showPopup, setShowPopup] = useState(false);

  const config = catalog?.help ? catalog.help : {};

  const show = props.showButton || (config?.url || config?.html || config?.description || catalog?.description);
  const disabled = props.disabled === true || !(config?.url || config?.html || config?.description || catalog?.description);

  if (config.as === 'popup' && show) {
    const title = config?.title || catalog?.title || 'Informação';
    return (
      <React.Fragment>

        <ActionIcon
          variant="subtle"
          radius="xl"
          title={title}
          className={className}
          style={style}
          disabled={disabled}
          aria-label={title}
          onClick={e => { e.preventDefault(); setShowPopup(true) }}
        >
          <IconInfoCircle />
        </ActionIcon>

        <Dialog
          title={title}
          opened={showPopup}
          onClose={() => setShowPopup(false)}
          maximizable
          height="80vh"
          footer={
            <Group justify="flex-end">
              <Button onClick={e => setShowPopup(false)}>Fechar</Button>
            </Group>
          }>

          {(() => {
            if (config.url) {
              return (
                <iframe title={config.title || 'Ajuda'} src={config.url} style={{ border: 'none', width: '100%', height: '100%' }}></iframe>
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

        </Dialog>

      </React.Fragment>
    )
  } else if (config.as === 'external' && show) {
    return (
      <ActionIcon
        variant="subtle"
        radius="xl"
        title={config?.title || catalog?.title || 'Informação'}
        className={className}
        disabled={props.disabled || !config.url}
        aria-label={config?.title || catalog?.title || 'Informação'}
        onClick={e => { e.preventDefault(); window.open(config.url)}}>
        <IconInfoCircle />
      </ActionIcon>
    )
  } else if (props.showButton) {
    return (
      <ActionIcon
        variant="subtle"
        radius="xl"
        title={config?.title || catalog?.title || 'Informação'}
        className={className}
        disabled={true}
        aria-label={config?.title || catalog?.title || 'Informação'}>
        <IconInfoCircle />
      </ActionIcon>
    )
  } else {
    return null;
  }
}

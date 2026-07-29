import React from 'react';

import { Button, Card, Group, Text, Tooltip } from '@mantine/core';

import CollapsedText from './CollapsedText';
import ViewServicesButton from './ViewServicesButton';
import DownloadServicesButton from './DownloadServicesButton';
import AddToMapButton from './AddToMapButton';
import { formatDate } from '../utils';


const getResponsibleParty = (data) => {
  var ret = {};
  if (Array.isArray(data.responsibleParty)) {
    for (let i = 0; i < data.responsibleParty.length; i++) {
      const s = data.responsibleParty[i].split('|');
      if (s[1] === 'resource') {
        ret.resource = s[2];
      } else if (s[1] === 'distribution') {
        ret.distribution = s[2];
      } else if (s[1] === 'metadata') {
        ret.metadata = s[2];
      }
    }
  }
  return ret;
}

const getReferenceDate = (data) => {
  if (data.revisionDate) {
    return { type: "revisão", value: formatDate(new Date(data.revisionDate), 'dd-mm-yyyy') };
  }

  if (!data.revisionDate && data.creationDate) {
    return { type: "criação", value: formatDate(new Date(data.creationDate), 'dd-mm-yyyy') };
  }

  if (!data.revisionDate && !data.creationDate && data.publicationDate) {
    return { type: "publicação", value: formatDate(new Date(data.publicationDate), 'dd-mm-yyyy') };
  }
}

const getTopicCat = (data) => {
  if (!Array.isArray(data.topicCatLang)) return data.topicCatLang;

  if (data.topicCatLang.length) return data.topicCatLang[0];
}


export default function MetadataRecord({ core, viewer, mainMap, utils, actions, componentConfig, data, onRecordHover, onRecordClick }) {

  let metadata_url = componentConfig.url + (componentConfig?.metadata_url || '/srv/por/catalog.search#/metadata/');
  if (metadata_url.indexOf('{uuid}') > -1) {
    metadata_url = metadata_url.replace('{uuid}', data?.["geonet:info"]?.uuid);
  } else {
    metadata_url = `${metadata_url}${data?.["geonet:info"]?.uuid}`;
  }

  const footer = (
    <Group justify="space-between" gap="xs" wrap="wrap">
      <Group gap="xs" wrap="wrap">
        <Tooltip label="Ver Ficha de Metadados">
          <Button component="a" href={metadata_url} target="_blank" rel="noopener noreferrer"
            size="sm">Metadados</Button>
        </Tooltip>
        <ViewServicesButton core={core} utils={utils} data={data} size="sm" className="" />
        <DownloadServicesButton core={core} utils={utils} data={data} size="sm" className="" />
      </Group>
      { !(componentConfig?.allow_add_map === false) &&
      <AddToMapButton core={core} utils={utils} componentConfig={componentConfig} data={data} size="sm" className="" />
      }
    </Group>
  );


  const title = (componentConfig?.show_record_extent || componentConfig?.show_record_extent == null) ?
    <a href="#"
      onMouseOver={(e) => {
        e.preventDefault();
        onRecordHover && onRecordHover(data);
      }}
      onMouseOut={(e) => {
        e.preventDefault();
        onRecordHover && onRecordHover(null);
      }}
      onClick={(e) => {
        e.preventDefault();
        onRecordClick && onRecordClick(data);
      }}
    >{data.title || data.defaultTitle}</a>
    : data.title || data.defaultTitle;

  const responsibleParty = getResponsibleParty(data);
  const referenceDate = getReferenceDate(data);
  const topicCat = getTopicCat(data);
  const subTitle = responsibleParty?.resource || responsibleParty?.distribution || '';

  return (
    <Card withBorder shadow="sm" radius="md" padding="md" className="metadata-card mb-2">
      <Text className="metadata-card-title" fw={500} size="lg">{title}</Text>
      { subTitle && <Text className="metadata-card-subtitle" c="dimmed" size="sm">{subTitle}</Text> }

      { referenceDate && <div className="mt-1">
        <span className="font-bold">Data de Referência{referenceDate ? ` (${referenceDate.type})` : ''}: </span>
        <span>{referenceDate ? referenceDate.value : ''}</span>
      </div> }
      { topicCat && <div className="mt-1">
        <span className="font-bold">Tema(s): </span>
        <span>{topicCat || ''}</span>
      </div> }
      { data?.geographicCoverageDesc && <div className="mt-1">
        <span className="font-bold">Cobertura: </span>
        {Array.isArray(data?.geographicCoverageDesc) && data.geographicCoverageDesc.length ?
          <div>
            {data.geographicCoverageDesc.map((g, idx) => <span key={idx}>{g.geographicCoverageDesc} </span>)}
          </div>
        : <span>{data?.geographicCoverageDesc}</span> }
      </div> }
      <div className="mt-2" style={{"wordBreak": "break-word"}}>
        <CollapsedText text={data?.abstract} maxLength={300} showAll={false} />
      </div>

      <Card.Section withBorder inheritPadding py="xs" mt="sm">
        {footer}
      </Card.Section>
    </Card>
  )
}

import React from 'react';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

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
    <div className="p-grid">
      <div className="p-col-8 p-text-left">
        <Button className="p-mr-1 p-button-sm" 
          tooltip="Ver Ficha de Metadados">
            <a href={metadata_url} target="_blank" rel="noopener noreferrer">Metadados</a>
        </Button>
        <ViewServicesButton core={core} utils={utils} data={data} className="p-button-sm" />
        <DownloadServicesButton core={core} utils={utils} data={data} className="p-button-sm" />
      </div>
      <div className="p-col-4 p-text-right">
        { !(componentConfig?.allow_add_map === false) &&
        <AddToMapButton core={core} utils={utils} componentConfig={componentConfig} data={data} className="p-button-sm" />
        }
      </div>
    </div>
  );


  const title = <div> 
      {
        (componentConfig?.show_record_extent || componentConfig?.show_record_extent == null) ?
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
        : data.title || data.defaultTitle
      }
    </div>
  
  const responsibleParty = getResponsibleParty(data);
  const referenceDate = getReferenceDate(data);
  const topicCat = getTopicCat(data);

  return (
    <Card title={title} subTitle={responsibleParty?.resource || responsibleParty?.distribution || ''} 
      footer={footer} header={null} className="p-mb-2">
        { referenceDate && <div className="p-mt-1">
          <span className="p-text-bold">Data de Referência{referenceDate ? ` (${referenceDate.type})` : ''}: </span>
          <span>{referenceDate ? referenceDate.value : ''}</span>
        </div> }
        { topicCat && <div className="p-mt-1">
          <span className="p-text-bold">Tema(s): </span>
          <span>{topicCat || ''}</span>
        </div> }
        { data?.geographicCoverageDesc && <div className="p-mt-1">
          <span className="p-text-bold">Cobertura: </span>
          {Array.isArray(data?.geographicCoverageDesc) && data.geographicCoverageDesc.length ? 
            <div>
              {data.geographicCoverageDesc.map((g, idx) => <span key={idx}>{g.geographicCoverageDesc} </span>)}
            </div>
          : <span>{data?.geographicCoverageDesc}</span> }
        </div> }      
        <div className="p-mt-2" style={{"wordBreak": "break-word"}}>
          <CollapsedText text={data?.abstract} maxLength={300} showAll={false} />
        </div>
    </Card>
  )
}
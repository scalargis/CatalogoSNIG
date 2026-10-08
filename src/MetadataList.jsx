import React, { useEffect, useState } from 'react';

import { ActionIcon, Button, Group, Select, Stack, Tabs, Text } from '@mantine/core';
import {
  IconAngleDoubleLeft,
  IconAngleDoubleRight,
  IconAngleLeft,
  IconAngleRight,
  TourTarget,
} from '@scalargis/ui';

import MetadataRecord from './components/MetatadataRecord';
import { addMapLinks } from './components/AddToMapButton';
import { registerShowResultsTab } from './onboardingMenuBridge';
import Summary from './components/Summary';
import Filters from './components/Filters';
import { getServiceUrl } from './utils';


const rowsPerPageOptions = [
  { label: '10 por página', value: '10' },
  { label: '20 por página', value: '20' },
  { label: '50 por página', value: '50' },
  { label: '100 por página', value: '100' }
];

// The Prime DataView paginator (First/Prev/report/rows-per-page/Next/Last) as a
// Mantine composition. In the narrow viewer panel the arrows + report stay on one
// line (report never wraps) and the rows-per-page Select drops to its own centred
// line when there is no room, so nothing gets squeezed onto three lines.
function Pager({ first, rows, total, onPageChange }) {
  const rowCount = rows || 20;
  const page = Math.floor((first < 0 ? 0 : first) / rowCount) + 1;
  const totalPages = Math.max(1, Math.ceil(total / rowCount));
  const last = Math.min(first + rowCount, total);

  const goto = (p) => onPageChange({ first: (p - 1) * rowCount, rows: rowCount });

  return (
    <Group justify="center" gap="sm" wrap="wrap" className="metadata-pager">
      <Group gap={4} wrap="nowrap">
        <ActionIcon variant="subtle" size="lg" aria-label="Primeira página"
          disabled={page <= 1} onClick={() => goto(1)}><IconAngleDoubleLeft /></ActionIcon>
        <ActionIcon variant="subtle" size="lg" aria-label="Página anterior"
          disabled={page <= 1} onClick={() => goto(page - 1)}><IconAngleLeft /></ActionIcon>
        <Text component="span" size="sm" px={4}
          style={{ whiteSpace: 'nowrap', userSelect: 'none' }}>
          {first < 0 ? 1 : first + 1} a {last}
        </Text>
        <ActionIcon variant="subtle" size="lg" aria-label="Página seguinte"
          disabled={page >= totalPages} onClick={() => goto(page + 1)}><IconAngleRight /></ActionIcon>
        <ActionIcon variant="subtle" size="lg" aria-label="Última página"
          disabled={page >= totalPages} onClick={() => goto(totalPages)}><IconAngleDoubleRight /></ActionIcon>
      </Group>
      <Select
        size="sm"
        data={rowsPerPageOptions}
        value={String(rowCount)}
        allowDeselect={false}
        w={150}
        onChange={(value) => value && onPageChange({ first: 0, rows: parseInt(value) })} />
    </Group>
  );
}


export default function MetadataList({ core, viewer, mainMap, utils, actions, componentConfig, data, setCollapsedFacets,
  onSearch, onClearSearch, onSort, onClickFacet, onClickFacetItem, filters, filtersItems, onFilterChange,
  onRecordHover, onRecordClick }) {

  const childProps = {
    core,
    viewer,
    mainMap,
    utils,
    actions,
    componentConfig,
    onRecordHover,
    onRecordClick
  }

  const url = getServiceUrl(componentConfig.url);

  const [loaded, setLoaded] = useState(false);

  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => registerShowResultsTab(() => setActiveIndex(1)), []);

  const [sortBy, setSortBy] = useState(data?.sortBy);
  const [sortOrder, setSortOrder] = useState(data?.sortOrder);

  let sortOptions = componentConfig?.sortOptions;

  useEffect(() => {
    setLoaded(true);
  }, []);


  useEffect(() => {
    if (!loaded) return;
    onSort(sortBy, sortOrder);
  }, [sortBy, sortOrder]);


  const onPageChange = (event) => {
    onSearch({from: event.first + 1, rows: event.rows});
  }

  const onSortChange = (value) => {
    setSortOrder('');
    setSortBy(value);
  }

  const metadata = Array.isArray(data?.metadata) ? data.metadata : (data?.metadata ? [data?.metadata] : []);
  const tourRecordIndex = componentConfig?.allow_add_map === false ? -1
    : metadata.findIndex((record) => addMapLinks(record, componentConfig).length > 0);
  const first = parseInt(data["@from"]-1);
  const rows = data.rows || 20;
  const total = data.summary["@count"];

  const sortSelectData = (sortOptions || []).map(o => ({ value: o.value, label: o.label }));

  return (
    <div className="mt-2">
      <Tabs value={String(activeIndex)} onChange={(v) => v != null && setActiveIndex(parseInt(v))}
        className="metadata-list">
        <Tabs.List>
          <Tabs.Tab value="0">Filtro</Tabs.Tab>
          <Tabs.Tab value="1">Resultados</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="0" keepMounted>
          <div className="grid mt-2">
          <Filters url={url} float_labels={componentConfig?.float_labels} filters={filters} filtersItems={filtersItems}
            onFilterChange={onFilterChange}
            />
          </div>
          <div className="grid pt-2">
            <div className="field col-6 text-center">
              <Button style={{minWidth: "6rem"}}
                onClick={(e) => {
                  onClearSearch();
                }}>Limpar</Button>
            </div>
            <div className="field col-6 text-center">
              <Button
                onClick={(e) => {
                  onSearch({from: 1, rows: rows, saveMapExtent: true, callback:()=> {setActiveIndex(1);}});
                }}>Pesquisar</Button>
            </div>
          </div>

          <Summary {...childProps}
            data={data}
            config={componentConfig?.summary || null}
            setCollapsedFacets={setCollapsedFacets}
            onClickFacet={onClickFacet}
            onClickFacetItem={onClickFacetItem} />
        </Tabs.Panel>

        <Tabs.Panel value="1" keepMounted>
          <TourTarget id="catalogosnig:results">
          { total > 0 ?
          <Stack gap="md" className="metadata-results mt-3">
            <Group justify="space-between" align="center" wrap="wrap" gap="xs">
              <Text component="div" fw={600}>
                {total}<Text component="span" fw={400}> resultado(s) encontrado(s)</Text>
              </Text>
              { sortOptions?.length > 0 &&
                <Select
                  data={sortSelectData}
                  value={sortBy || null}
                  placeholder="Ordenar por"
                  size="sm"
                  style={{ flex: '1 1 14rem', minWidth: '14rem' }}
                  onChange={onSortChange} /> }
            </Group>
            <Pager first={first} rows={rows} total={total} onPageChange={onPageChange} />
            <Stack gap="sm">
              {metadata.map((record, idx) => (
                <MetadataRecord key={idx} {...childProps} data={record} tourRecord={idx === tourRecordIndex} />
              ))}
            </Stack>
            <Pager first={first} rows={rows} total={total} onPageChange={onPageChange} />
          </Stack> :
          <div className="grid mt-4">
            <div className="col-12 text-center">
              <div><strong>{total}</strong><span> resultado(s) encontrado(s)</span></div>
            </div>
          </div>
          }
          </TourTarget>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

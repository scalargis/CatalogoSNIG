import React, { useEffect, useState } from 'react';

import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { TabView,TabPanel } from 'primereact/tabview';

import MetadataRecord from './components/MetatadataRecord';
import Summary from './components/Summary';
import Filters from './components/Filters';
import { getServiceUrl } from './utils';
import './style.css';


export default function MetadataList({ core, viewer, mainMap, utils, actions, componentConfig, data, setCollapsedFacets,
  onSearch, onClearSearch, onSort, onClickFacet, onClickFacetItem, filters, filtersItems, onFilterChange }) {

  const childProps = {
    core,
    viewer,
    mainMap,
    utils,
    actions,
    componentConfig
  }

  const url = getServiceUrl(componentConfig.url);

  const [loaded, setLoaded] = useState(false);

  const [activeIndex, setActiveIndex] = useState(1);

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
  
  const onSortChange = (event) => {
    setSortOrder('');
    setSortBy(event.value);
  }  

  const itemTemplate = (record, layout) => {
    return (
      <MetadataRecord        
        {...childProps}
        data={record} />
    );
  }

  const paginatorTemplate = {
    layout: 'FirstPageLink PrevPageLink CurrentPageReport RowsPerPageDropdown NextPageLink LastPageLink',
    'RowsPerPageDropdown': (options) => {
      const dropdownOptions = [
        { label: 10, value: 10 },
        { label: 20, value: 20 },
        { label: 50, value: 50 },
        { label: 100, value: 100 }
      ];
  
      return (
        <Dropdown value={options.value} 
          options={dropdownOptions} itemTemplate={(option)=><div>{option.label} registos por página</div>}
          onChange={options.onChange} 
          style={{height: "auto"}} appendTo={document.body} />
      );
    },
    'FirstPageLink': (options) => {
      return (
        <Button className="p-button-rounded p-button-text" icon="pi pi-angle-double-left"
          onClick={options.onClick} disabled={options.disabled} />
      )
    },    
    'PrevPageLink': (options) => {
      return (
        <Button className="p-button-rounded p-button-text" icon="pi pi-angle-left"
          onClick={options.onClick} disabled={options.disabled} />
      )
    },    
    'NextPageLink': (options) => {
      return (
        <Button className="p-button-rounded p-button-text" icon="pi pi-angle-right"
          onClick={options.onClick} disabled={options.disabled} />
      )
    },    
    'LastPageLink': (options) => {
      return (
        <Button className="p-button-rounded p-button-text" icon="pi pi-angle-double-right"
          onClick={options.onClick} disabled={options.disabled} />
      )
    },
    'CurrentPageReport': (options) => {
      return (
        <span style={{ color: 'var(--text-color)', userSelect: 'none', textAlign: 'center' }}>
          {options.first < 0 ? 1 : options.first} a {options.last}
        </span>
      )
    }
  };      

  const renderHeader = () => {
    return (
      <div className="p-grid p-nogutter">
        <div className="p-col-12 p-mt-2 p-mb-2" style={{textAlign: 'left'}}>
          <div>{data.summary["@count"]}<span style={{"fontWeight": "normal"}}> resultado(s) encontrado(s)</span></div>  
        </div>
        { sortOptions?.length > 0 ? <div className="p-col-12" style={{textAlign: 'right'}}>
          <Dropdown options={sortOptions} value={sortBy} optionLabel="label" placeholder="Ordenar por" 
          valueTemplate={(option)=><div>Ordenar por {option?.label}</div>}
          itemTemplate={(option)=><div>{option.label}</div>}
          onChange={onSortChange}/>
        </div> : null }
      </div>
    );
  }

  const header = renderHeader();

  const metadata = Array.isArray(data?.metadata) ? data.metadata : (data?.metadata ? [data?.metadata] : []);
  const first = parseInt(data["@from"]-1);
  const rows = data.rows || 20;

  return (
    <div className="p-mt-2">
      <TabView activeIndex={activeIndex} renderActiveOnly={false}
        onTabChange={(e) => setActiveIndex(e.index)} className="metadata-list">
        <TabPanel header="Filtro">
          <div className="p-fluid p-grid p-mt-2">
          <Filters url={url} float_labels={componentConfig?.float_labels} filters={filters} filtersItems={filtersItems}
            onFilterChange={onFilterChange}
            />
          </div>
          <div className="p-grid">
            <div className="p-field p-col-6 p-text-center">
              <Button label="Limpar" style={{minWidth: "6rem"}}
                onClick={(e) => {
                  onClearSearch();
                }}/>
            </div>
            <div className="p-field p-col-6 p-text-center">
              <Button label="Pesquisar" 
                onClick={(e) => {
                  onSearch({from: 1, rows: rows, callback:()=> {setActiveIndex(1);}});
                }}/>
            </div>
          </div>

          <Summary {...childProps} 
            data={data} 
            config={componentConfig?.summary || null}
            setCollapsedFacets={setCollapsedFacets}
            onClickFacet={onClickFacet}
            onClickFacetItem={onClickFacetItem} />
        </TabPanel>
        <TabPanel header="Resultados">
          { data.summary["@count"] > 0 ?
          <DataView value={metadata} layout="list" header={header}
            itemTemplate={itemTemplate} 
            lazy paginator alwaysShowPaginator={false} paginatorPosition={'both'} rows={rows}
            totalRecords={data.summary["@count"]} first={first} paginatorTemplate={paginatorTemplate}
            pageLinkSize={1}            
            onPage={onPageChange} /> :
          <div className="p-grid p-mt-4">
            <div className="p-col-12 p-text-center">
              <div><strong>{data.summary["@count"]}</strong><span> resultado(s) encontrado(s)</span></div>  
            </div>
          </div>
          }
        </TabPanel>
      </TabView>
    </div>
  )
}  
import { stringify } from 'query-string';

import { fetchJson } from  './fetch';
import { SNIG_URL } from '../constants';


const dataProvider = (apiUrl=SNIG_URL, catalog=null, httpClient = fetchJson) => ({
    
    getCodeList: (path) => {
        const url = `${apiUrl}${path}`;

        return httpClient(url).then(({ headers, json }) => (json));
    },

    searchAnySNIG: (filter) => {
        const query = {
            field: "anylightsnig",
            sortBy: "STARTSWITHFIRST",
            q: filter,
            filterField: "type",
            filterValue: "dataset+or+series" 
        }

        const url = `${apiUrl}/srv/por/suggestsnig?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => (json));
    },

    searchAny: (filter) => {
        const query = {
            field: filter?.field || "anylight",
            sortBy: filter?.sortBy || "STARTSWITHFIRST",
            q: filter?.query,
            filterField: filter?.filterField,
            filterValue: filter?.filterFieldValue
        }
        
        const path = filter?.path || '/srv/por/suggest';
        const url = `${apiUrl}${path}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => (json));
    },    
    
    searchRegions: ({filter, rows}) => {
        const query = {
            type:"CONTAINS",
            thesaurus: "external.place.regions",
            rows: rows || 200,
            q: filter,
            uri: "*QUERY*",
            lang: "por"
        }

        const url = `${apiUrl}/srv/api/registries/vocabularies/search?${stringify(query)}`;
        
        return httpClient(url).then(({ headers, json }) => (json));
    },
    
    searchCatalogSNIG: function(params) {
        let new_params = {};
        if (catalog.overrideDefaultFilter !== true) {
            new_params.type = "dataset+or+series"
        }
        new_params = {
            ...new_params,
            ...params
        }
        return this.searchCatalog(new_params);
    },

    searchCatalog: function (params) {
        const defaultFilters = {
            ...(catalog?.defaultFilters || null)
        }

        const query = {
            _content_type: "json",
            fast:"index",
            resultType:"details",
            ...defaultFilters,
            ...params
        }        

        const url = `${apiUrl}/srv/por/q?${stringify(query)}`;
        
        return httpClient(url).then(({ headers, json }) => (json));
    }

});

export default dataProvider;
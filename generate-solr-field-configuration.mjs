import { solrFields } from './v1-indexer-solr-fields.mjs';

Object.keys( solrFields ).sort().forEach( solrFieldName => {
    const solrField = solrFields[ solrFieldName ];
} );

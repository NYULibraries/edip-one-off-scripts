import { writeFileSync } from 'node:fs';

import { mainDocSolrFields } from './v1-indexer-solr-fields.mjs';
import { indexAsConversion } from './index-as-conversion.mjs';

const mainDocXpathToSolrFields = {};

Object.keys( mainDocSolrFields.xpath ).sort().forEach( solrFieldName => {
    const solrField = mainDocSolrFields.xpath[ solrFieldName ];
    const suffixes = [];
    const indexAsArray = solrField.indexAsArray;
    if ( indexAsArray ) {
        indexAsArray.forEach( indexAs => {
            suffixes.push( ...indexAsConversion[ indexAs ].suffixes );
        } );
    }
    const suffixedSolrFields =
        suffixes.map( suffix => `${ solrFieldName }${ suffix }` );

    if ( ! mainDocXpathToSolrFields[ solrField.xpath ] ) {
        mainDocXpathToSolrFields[ solrField.xpath ] = {};
        mainDocXpathToSolrFields[ solrField.xpath ].solrFields = [];
    }
    mainDocXpathToSolrFields[ solrField.xpath ].solrFields.push( ...suffixedSolrFields );
} );

writeFileSync(
    'main-doc-xpath-to-solr-fields.json',
    JSON.stringify( mainDocXpathToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

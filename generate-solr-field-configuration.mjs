import { writeFileSync } from 'node:fs';

import { mainDocSolrFields } from './v1-indexer-solr-fields.mjs';
import { indexAsConversion } from './index-as-conversion.mjs';

const mainDocCompositeSolrFields = {};
const mainDocDirectToSolrFields = {};
const mainDocNonXpathToSolrFields = {};
const mainDocXpathToSolrFields = {};

function addCompositeSolrizerSolrFields() {
    Object.keys( mainDocSolrFields.solrizer.composite ).sort().forEach( solrFieldName => {
        const solrField = mainDocSolrFields.solrizer.composite[ solrFieldName ];
        const suffixes = [];
        const indexAsArray = solrField.indexAsArray;
        if ( indexAsArray ) {
            indexAsArray.forEach( indexAs => {
                suffixes.push( ...indexAsConversion[ indexAs ].suffixes );
            } );
        }
        const suffixedSolrFields =
            suffixes.map( suffix => `${ solrFieldName }${ suffix }` );

        if ( ! mainDocCompositeSolrFields[ solrFieldName ] ) {
            mainDocCompositeSolrFields[ solrFieldName ] = {};
            mainDocCompositeSolrFields[ solrFieldName ].process = solrField.process;
            mainDocCompositeSolrFields[ solrFieldName ].solrFields = [];
            mainDocCompositeSolrFields[ solrFieldName ].xpathQueries = [];
        }
        mainDocCompositeSolrFields[ solrFieldName ].solrFields.push( ...suffixedSolrFields );
        mainDocCompositeSolrFields[ solrFieldName ].xpathQueries.push( ...solrField.xpathQueries );
    } );
}

function addNonSolrizerSolrFields() {
    Object.keys( mainDocSolrFields.nonSolrizer ).sort().forEach( solrFieldName => {
        const solrField = mainDocSolrFields.nonSolrizer[ solrFieldName ];
        if ( ! mainDocDirectToSolrFields[ solrField.source ] ) {
            mainDocDirectToSolrFields[ solrField.source ] = {};
            mainDocDirectToSolrFields[ solrField.source ].solrFields = [];
        }
        mainDocDirectToSolrFields[ solrField.source ].solrFields.push( solrFieldName );
    } );
}

function addNonXpathSolrFields() {
    Object.keys( mainDocSolrFields.solrizer.nonXpath ).sort().forEach( solrFieldName => {
        const solrField = mainDocSolrFields.solrizer.nonXpath[ solrFieldName ];
        const suffixes = [];
        const indexAsArray = solrField.indexAsArray;
        if ( indexAsArray ) {
            indexAsArray.forEach( indexAs => {
                suffixes.push( ...indexAsConversion[ indexAs ].suffixes );
            } );
        }
        const suffixedSolrFields =
            suffixes.map( suffix => `${ solrField.basename }${ suffix }` );

        if ( ! mainDocNonXpathToSolrFields[ solrField.source ] ) {
            mainDocNonXpathToSolrFields[ solrField.source ] = {};
            mainDocNonXpathToSolrFields[ solrField.source ].solrFields = [];
        }
        mainDocNonXpathToSolrFields[ solrField.source ].solrFields.push( ...suffixedSolrFields );
    } );
}

function addXpathSolrFields() {
    Object.keys( mainDocSolrFields.solrizer.xpath ).sort().forEach( solrFieldName => {
        const solrField = mainDocSolrFields.solrizer.xpath[ solrFieldName ];
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

        if ( solrField.process ) {
            mainDocXpathToSolrFields[ solrField.xpath ].process = solrField.process;
        }
    } );
}

addCompositeSolrizerSolrFields();
addNonSolrizerSolrFields();
addNonXpathSolrFields();
addXpathSolrFields();

writeFileSync(
    'main-doc-composite-solr-fields.json',
    JSON.stringify( mainDocCompositeSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    'main-doc-non-solrizer-solr-fields.json',
    JSON.stringify( mainDocDirectToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    'main-doc-non-xpath-to-solr-fields.json',
    JSON.stringify( mainDocNonXpathToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    'main-doc-xpath-to-solr-fields.json',
    JSON.stringify( mainDocXpathToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

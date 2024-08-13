import { writeFileSync } from 'node:fs';

import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname );

const SOLR_FIELD_CONFIGURATION_FILES =
    path.join( ROOT, 'solr-field-configuration-files' );

import { mainDocSolrFields } from './lib/v1-indexer-solr-fields.mjs';
import { indexAsConversion } from './lib/index-as-conversion.mjs';

const mainDocCompositeSolrFields = {};
const mainDocDirectToSolrFields = {};
const mainDocNonXpathToSolrFields = {};
const mainDocXpathToSolrFields = {};

function addSolrizerCompositeSolrFields() {
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

function addSolrizerNonXpathSolrFields() {
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

function addSolrizerSimpleXpathSolrFields() {
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
            suffixes.map( suffix => `${ solrField.basename || solrFieldName }${ suffix }` );

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

addSolrizerCompositeSolrFields();
addNonSolrizerSolrFields();
addSolrizerNonXpathSolrFields();
addSolrizerSimpleXpathSolrFields();

writeFileSync(
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-composite-solr-fields.json' ),
    JSON.stringify( mainDocCompositeSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-non-solrizer-solr-fields.json' ),
    JSON.stringify( mainDocDirectToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-non-xpath-to-solr-fields.json' ),
    JSON.stringify( mainDocNonXpathToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-simple-xpath-to-solr-fields.json' ),
    JSON.stringify( mainDocXpathToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname );

const SOLR_FIELD_CONFIGURATION_FILES =
    path.join( ROOT, 'solr-field-configuration-files' );

import { componentSolrFields, mainDocSolrFields } from './lib/v1-indexer-solr-fields.mjs';
import { indexAsConversion } from './lib/index-as-conversion.mjs';

const componentCompositeSolrFields = {};
const componentDirectToSolrFields = {};
const componentNonXpathToSolrFields = {};
const componentXpathToSolrFields = {};

const mainDocCompositeSolrFields = {};
const mainDocDirectToSolrFields = {};
const mainDocNonXpathToSolrFields = {};
const mainDocXpathToSolrFields = {};

function addSolrizerCompositeSolrFields( solrFieldDefinitions, compositeSolrFields ) {
    Object.keys( solrFieldDefinitions.solrizer.composite ).sort().forEach( solrFieldName => {
        const solrField = solrFieldDefinitions.solrizer.composite[ solrFieldName ];
        const suffixes = [];
        const indexAsArray = solrField.indexAsArray;
        if ( indexAsArray ) {
            indexAsArray.forEach( indexAs => {
                suffixes.push( ...indexAsConversion[ indexAs ].suffixes );
            } );
        }
        const suffixedSolrFields =
            suffixes.map( suffix => `${ solrFieldName }${ suffix }` );

        if ( ! compositeSolrFields[ solrFieldName ] ) {
            compositeSolrFields[ solrFieldName ] = {};
            compositeSolrFields[ solrFieldName ].process = solrField.process;
            compositeSolrFields[ solrFieldName ].solrFields = [];
            compositeSolrFields[ solrFieldName ].xpathQueries = [];
        }
        compositeSolrFields[ solrFieldName ].solrFields.push( ...suffixedSolrFields );
        compositeSolrFields[ solrFieldName ].xpathQueries.push( ...solrField.xpathQueries );
    } );
}

function addNonSolrizerSolrFields( solrFieldDefinitions, directToSolrFields ) {
    Object.keys( solrFieldDefinitions.nonSolrizer ).sort().forEach( solrFieldName => {
        const solrField = solrFieldDefinitions.nonSolrizer[ solrFieldName ];
        if ( ! directToSolrFields[ solrField.source ] ) {
            directToSolrFields[ solrField.source ] = {};
            directToSolrFields[ solrField.source ].solrFields = [];
        }
        directToSolrFields[ solrField.source ].solrFields.push( solrFieldName );
    } );
}

function addSolrizerNonXpathSolrFields() {
    Object.keys( mainDocSolrFields.solrizer.nonXpath ).sort().forEach( solrFieldName => {
        const solrField = mainDocSolrFields.solrizer.nonXpath[ solrFieldName ];
        const suffixes = [];
        const indexAsArray = solrField.indexAsArray;
        if ( indexAsArray ) {
            indexAsArray.forEach( indexAs => {
                const suffixesForIndexAs = indexAsConversion[ indexAs ].suffixes;
                if ( Array.isArray( suffixesForIndexAs )  ) {
                    suffixes.push( ...suffixesForIndexAs );
                } else {
                    suffixes.push( ...suffixesForIndexAs[ solrField.dataType ] );
                }
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
                const suffixesForIndexAs = indexAsConversion[ indexAs ].suffixes;
                if ( Array.isArray( suffixesForIndexAs )  ) {
                    suffixes.push( ...suffixesForIndexAs );
                } else {
                    suffixes.push( ...suffixesForIndexAs[ solrField.dataType ] );
                }
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

addSolrizerCompositeSolrFields( componentSolrFields, componentCompositeSolrFields );
addSolrizerCompositeSolrFields( mainDocSolrFields, mainDocCompositeSolrFields );

// addNonSolrizerSolrFields( componentSolrFields, componentDirectToSolrFields );
addNonSolrizerSolrFields( mainDocSolrFields, mainDocDirectToSolrFields );

// addSolrizerNonXpathSolrFields( componentSolrFields, componentNonXpathToSolrFields );
addSolrizerNonXpathSolrFields( mainDocSolrFields, mainDocNonXpathToSolrFields );

// addSolrizerSimpleXpathSolrFields( componentSolrFields, componentXpathToSolrFields );
addSolrizerSimpleXpathSolrFields( mainDocSolrFields, mainDocXpathToSolrFields );

writeFileSync(
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'component-solrizer-composite-solr-fields.json' ),
    JSON.stringify( componentCompositeSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'component-non-solrizer-solr-fields.json' ),
    JSON.stringify( componentDirectToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'component-solrizer-non-xpath-to-solr-fields.json' ),
    JSON.stringify( componentNonXpathToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

writeFileSync(
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'component-solrizer-simple-xpath-to-solr-fields.json' ),
    JSON.stringify( componentXpathToSolrFields, null, '    ' ),
    { encoding : 'utf8' },
);

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

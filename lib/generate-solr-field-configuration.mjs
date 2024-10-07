import { writeFileSync } from 'node:fs';
import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname, '..' );

const SOLR_FIELD_CONFIGURATION_FILES =
    path.join( ROOT, 'solr-field-configuration-files' );

import {
    componentSolrFields,
    collectionDocSolrFields
} from './v1-indexer-solr-fields.mjs';
import { indexAsConversion } from './index-as-conversion.mjs';

const componentCompositeSolrFields = {};
const componentDirectToSolrFields = {};
const componentNonXpathToSolrFields = {};
const componentXpathToSolrFields = {};

const collectionDocCompositeSolrFields = {};
const collectionDocDirectToSolrFields = {};
const collectionDocNonXpathToSolrFields = {};
const collectionDocXpathToSolrFields = {};

function addSolrizerCompositeSolrFields( solrFieldDefinitions, compositeSolrFields ) {
    Object.keys( solrFieldDefinitions.solrizer.composite ).sort().forEach( solrFieldName => {
        const solrField = solrFieldDefinitions.solrizer.composite[ solrFieldName ];
        const indexAsArray = solrField.indexAsArray;
        const suffixes = [];

        let solrFieldsToAdd = [];
        if ( indexAsArray ) {
            indexAsArray.forEach( indexAs => {
                const suffixesForIndexAs = indexAsConversion[ indexAs ].suffixes;
                if ( Array.isArray( suffixesForIndexAs ) ) {
                    suffixes.push( ...suffixesForIndexAs );
                } else {
                    suffixes.push( ...suffixesForIndexAs[ solrField.dataType ] );
                }
            } );

            solrFieldsToAdd.push( ...suffixes.map( suffix => `${ solrField.basename || solrFieldName }${ suffix }` ) );
        } else {
            solrFieldsToAdd.push( solrField.basename || solrFieldName );
        }

        if ( !compositeSolrFields[ solrFieldName ] ) {
            compositeSolrFields[ solrFieldName ] = {};
            compositeSolrFields[ solrFieldName ].process = solrField.process;
            compositeSolrFields[ solrFieldName ].solrFields = [];
            compositeSolrFields[ solrFieldName ].xpathQueries = [];
        }
        compositeSolrFields[ solrFieldName ].solrFields.push( ...solrFieldsToAdd );
        compositeSolrFields[ solrFieldName ].xpathQueries.push( ...solrField.xpathQueries );
    } );
}

function addNonSolrizerSolrFields( solrFieldDefinitions, directToSolrFields ) {
    // `componentSolrFields` currently doesn't have `.nonSolrizer` configuration.
    if ( ! solrFieldDefinitions.nonSolrizer ) {
        return;
    }

    Object.keys( solrFieldDefinitions.nonSolrizer ).sort().forEach( solrFieldName => {
        const solrField = solrFieldDefinitions.nonSolrizer[ solrFieldName ];
        if ( !directToSolrFields[ solrField.source ] ) {
            directToSolrFields[ solrField.source ] = {};
            directToSolrFields[ solrField.source ].solrFields = [];
        }
        directToSolrFields[ solrField.source ].solrFields.push( solrFieldName );
    } );
}

function addSolrizerNonXpathSolrFields( solrFieldDefinitions, nonXpathToSolrFields ) {
    Object.keys( solrFieldDefinitions.solrizer.nonXpath ).sort().forEach( solrFieldName => {
        const solrField = solrFieldDefinitions.solrizer.nonXpath[ solrFieldName ];
        const suffixes = [];
        const indexAsArray = solrField.indexAsArray;
        if ( indexAsArray ) {
            indexAsArray.forEach( indexAs => {
                const suffixesForIndexAs = indexAsConversion[ indexAs ].suffixes;
                if ( Array.isArray( suffixesForIndexAs ) ) {
                    suffixes.push( ...suffixesForIndexAs );
                } else {
                    suffixes.push( ...suffixesForIndexAs[ solrField.dataType ] );
                }
            } );
        }
        const suffixedSolrFields =
            suffixes.map( suffix => `${ solrField.basename }${ suffix }` );

        if ( !nonXpathToSolrFields[ solrField.source ] ) {
            nonXpathToSolrFields[ solrField.source ] = {};
            nonXpathToSolrFields[ solrField.source ].solrFields = [];
        }
        nonXpathToSolrFields[ solrField.source ].solrFields.push( ...suffixedSolrFields );
    } );
}

function addSolrizerSimpleXpathSolrFields( solrFieldDefinitions, xpathToSolrFields ) {
    Object.keys( solrFieldDefinitions.solrizer.xpath ).sort().forEach( solrFieldName => {
        const solrField = solrFieldDefinitions.solrizer.xpath[ solrFieldName ];
        const suffixes = [];
        const indexAsArray = solrField.indexAsArray;
        if ( indexAsArray ) {
            indexAsArray.forEach( indexAs => {
                const suffixesForIndexAs = indexAsConversion[ indexAs ].suffixes;
                if ( Array.isArray( suffixesForIndexAs ) ) {
                    suffixes.push( ...suffixesForIndexAs );
                } else {
                    suffixes.push( ...suffixesForIndexAs[ solrField.dataType ] );
                }
            } );
        }
        const suffixedSolrFields =
            suffixes.map( suffix => `${ solrField.basename || solrFieldName }${ suffix }` );

        if ( !xpathToSolrFields[ solrField.xpath ] ) {
            xpathToSolrFields[ solrField.xpath ] = {};
            xpathToSolrFields[ solrField.xpath ].solrFields = [];
        }
        xpathToSolrFields[ solrField.xpath ].solrFields.push( ...suffixedSolrFields );

        if ( solrField.process ) {
            xpathToSolrFields[ solrField.xpath ].process = solrField.process;
        }
    } );
}

function generateSolrFieldConfigurationFiles() {
    addSolrizerCompositeSolrFields( componentSolrFields, componentCompositeSolrFields );
    addSolrizerCompositeSolrFields( collectionDocSolrFields, collectionDocCompositeSolrFields );

    addNonSolrizerSolrFields( componentSolrFields, componentDirectToSolrFields );
    addNonSolrizerSolrFields( collectionDocSolrFields, collectionDocDirectToSolrFields );

    addSolrizerNonXpathSolrFields( componentSolrFields, componentNonXpathToSolrFields );
    addSolrizerNonXpathSolrFields( collectionDocSolrFields, collectionDocNonXpathToSolrFields );

    addSolrizerSimpleXpathSolrFields( componentSolrFields, componentXpathToSolrFields );
    addSolrizerSimpleXpathSolrFields( collectionDocSolrFields, collectionDocXpathToSolrFields );

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
        path.join( SOLR_FIELD_CONFIGURATION_FILES, 'collection-doc-solrizer-composite-solr-fields.json' ),
        JSON.stringify( collectionDocCompositeSolrFields, null, '    ' ),
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( SOLR_FIELD_CONFIGURATION_FILES, 'collection-doc-non-solrizer-solr-fields.json' ),
        JSON.stringify( collectionDocDirectToSolrFields, null, '    ' ),
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( SOLR_FIELD_CONFIGURATION_FILES, 'collection-doc-solrizer-non-xpath-to-solr-fields.json' ),
        JSON.stringify( collectionDocNonXpathToSolrFields, null, '    ' ),
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( SOLR_FIELD_CONFIGURATION_FILES, 'collection-doc-solrizer-simple-xpath-to-solr-fields.json' ),
        JSON.stringify( collectionDocXpathToSolrFields, null, '    ' ),
        { encoding : 'utf8' },
    );
}

export {
    generateSolrFieldConfigurationFiles,
};

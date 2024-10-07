// There's a lot of duplication of code in the collection doc and component processing
// because collection doc was implemented first and then component processing  was
// implemented based on collection doc.  For the time being, the same processing works
// reasonably well for both, but there's a possibility of divergence in the future,
// so for now, keep them separate and independent.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import * as url from 'url';

import Papa from 'papaparse';

import { generateSolrFieldConfigurationFiles } from './lib/generate-solr-field-configuration.mjs';

import { createRequire } from "module";

const require = createRequire( import.meta.url );

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname );

const TRANSFORMATION_MAPS_DIR = path.join( ROOT, 'transformation-maps' );
const EAD_TO_SOLR_FIELDS_DIR = path.join( TRANSFORMATION_MAPS_DIR, 'ead-to-solr-fields' );
const SOLR_FIELDS_TO_EAD_DIR = path.join( TRANSFORMATION_MAPS_DIR, 'solr-fields-to-ead' );

const SOLR_FIELD_CONFIGURATION_FILES =
    path.join( ROOT, 'solr-field-configuration-files' );

const COLLECTION_DOC_NON_SOLRIZER_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'collection-doc-non-solrizer-solr-fields.json' ) );
const COLLECTION_DOC_SOLRIZER_COMPOSITE_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'collection-doc-solrizer-composite-solr-fields.json' ) );
const COLLECTION_DOC_SOLRIZER_NON_XPATH_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'collection-doc-solrizer-non-xpath-to-solr-fields.json' ) );
const COLLECTION_DOC_SOLRIZER_SIMPLE_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'collection-doc-solrizer-simple-xpath-to-solr-fields.json' ) );

const COMPONENT_NON_SOLRIZER_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'component-non-solrizer-solr-fields.json' ) );
const COMPONENT_SOLRIZER_COMPOSITE_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'component-solrizer-composite-solr-fields.json' ) );
const COMPONENT_SOLRIZER_NON_XPATH_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'component-solrizer-non-xpath-to-solr-fields.json' ) );
const COMPONENT_SOLRIZER_SIMPLE_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'component-solrizer-simple-xpath-to-solr-fields.json' ) );

const CSV_FILE_HEADER_EAD_TO_SOLR_FIELD = [ 'SOURCE TYPE', 'SOURCE', 'PROCESSING', 'SOLR FIELDS' ];
const CSV_FILE_HEADER_TO_SOLR_FIELD_TO_EAD = [ 'SOURCE TYPE', 'SOLR_FIELD', 'PROCESSING', 'SOURCE' ];

function getCollectionDocEadToSolrFieldsCsvMapData() {
    function composite( sourceType, configFile ) {
        const data = [];

        for ( const [ source, object ] of Object.entries( configFile ) ) {
            data.push( [
                           sourceType,
                           `${ source }: ${ object.xpathQueries.join( ', ' ) }`,
                           object.process,
                           object.solrFields.join( ',' )
                       ] );
        }

        return data;
    }

    function direct( sourceType, configFile ) {
        const data = [];

        for ( const [ source, object ] of Object.entries( configFile ) ) {
            data.push( [ sourceType, source, object.process, object.solrFields.join( ',' ) ] );
        }

        return data;
    }

    const collectionDocEadToSolrFieldsCsvMapData = [];
    collectionDocEadToSolrFieldsCsvMapData.push(
        ...direct( 'Non-Solrizer', COLLECTION_DOC_NON_SOLRIZER_SOLR_FIELDS_CONFIG )
    );
    collectionDocEadToSolrFieldsCsvMapData.push(
        ...direct( 'Solrizer - non-xpath', COLLECTION_DOC_SOLRIZER_NON_XPATH_SOLR_FIELDS_CONFIG )
    );
    collectionDocEadToSolrFieldsCsvMapData.push(
        ...direct( 'Solrizer - xpath query', COLLECTION_DOC_SOLRIZER_SIMPLE_SOLR_FIELDS_CONFIG )
    );

    collectionDocEadToSolrFieldsCsvMapData.push(
        ...composite( 'Solrizer - composite', COLLECTION_DOC_SOLRIZER_COMPOSITE_SOLR_FIELDS_CONFIG )
    );

    return collectionDocEadToSolrFieldsCsvMapData;
}

function getCollectionDocSolrFieldsToEadCsvMapData() {
    function composite( sourceType, configFile ) {
        const data = [];

        for ( const [ source, object ] of Object.entries( configFile ) ) {
            object.solrFields.forEach( solrField => {
                data.push( [
                               sourceType,
                               solrField,
                               object.process,
                               `${ source }: ${ object.xpathQueries.join( ', ' ) }`,
                           ] );
            } );
        }

        return data;
    }

    function direct( sourceType, configFile ) {
        const data = [];

        for ( const [ source, object ] of Object.entries( configFile ) ) {
            object.solrFields.forEach( solrField => {
                data.push( [
                               sourceType,
                               solrField,
                               object.process,
                               source,
                           ] );
            } );
        }

        return data;
    }

    const collectionDocSolrFieldsToEadCsvMapData = [];
    collectionDocSolrFieldsToEadCsvMapData.push(
        ...direct( 'Non-Solrizer', COLLECTION_DOC_NON_SOLRIZER_SOLR_FIELDS_CONFIG )
    );
    collectionDocSolrFieldsToEadCsvMapData.push(
        ...direct( 'Solrizer - non-xpath', COLLECTION_DOC_SOLRIZER_NON_XPATH_SOLR_FIELDS_CONFIG )
    );
    collectionDocSolrFieldsToEadCsvMapData.push(
        ...direct( 'Solrizer - xpath query', COLLECTION_DOC_SOLRIZER_SIMPLE_SOLR_FIELDS_CONFIG )
    );

    collectionDocSolrFieldsToEadCsvMapData.push(
        ...composite( 'Solrizer - composite', COLLECTION_DOC_SOLRIZER_COMPOSITE_SOLR_FIELDS_CONFIG )
    );

    return collectionDocSolrFieldsToEadCsvMapData;
}

function getComponentCsvMaps() {
    const componentEadToSolrFieldsCsvMapData = getComponentEadToSolrFieldsCsvMapData();
    const componentSolrFieldsToEadCsvMapData = getComponentSolrFieldsToEadCsvMapData();

    return {
        componentEadToSolrFieldsCsvMap : {
            fields : CSV_FILE_HEADER_EAD_TO_SOLR_FIELD,
            data   : componentEadToSolrFieldsCsvMapData,
        },
        componentSolrFieldsToEadCsvMap : {
            fields : CSV_FILE_HEADER_TO_SOLR_FIELD_TO_EAD,
            data   : componentSolrFieldsToEadCsvMapData,
        }
    };
}

function getComponentEadToSolrFieldsCsvMapData() {
    function composite( sourceType, configFile ) {
        const data = [];

        for ( const [ source, object ] of Object.entries( configFile ) ) {
            data.push( [
                           sourceType,
                           `${ source }: ${ object.xpathQueries.join( ', ' ) }`,
                           object.process,
                           object.solrFields.join( ',' )
                       ] );
        }

        return data;
    }

    function direct( sourceType, configFile ) {
        const data = [];

        for ( const [ source, object ] of Object.entries( configFile ) ) {
            data.push( [ sourceType, source, object.process, object.solrFields.join( ',' ) ] );
        }

        return data;
    }

    const componentEadToSolrFieldsCsvMapData = [];
    componentEadToSolrFieldsCsvMapData.push(
        ...direct( 'Non-Solrizer', COMPONENT_NON_SOLRIZER_SOLR_FIELDS_CONFIG )
    );
    componentEadToSolrFieldsCsvMapData.push(
        ...direct( 'Solrizer - non-xpath', COMPONENT_SOLRIZER_NON_XPATH_SOLR_FIELDS_CONFIG )
    );
    componentEadToSolrFieldsCsvMapData.push(
        ...direct( 'Solrizer - xpath query', COMPONENT_SOLRIZER_SIMPLE_SOLR_FIELDS_CONFIG )
    );

    componentEadToSolrFieldsCsvMapData.push(
        ...composite( 'Solrizer - composite', COMPONENT_SOLRIZER_COMPOSITE_SOLR_FIELDS_CONFIG )
    );

    return componentEadToSolrFieldsCsvMapData;
}

function getComponentSolrFieldsToEadCsvMapData() {
    function composite( sourceType, configFile ) {
        const data = [];

        for ( const [ source, object ] of Object.entries( configFile ) ) {
            object.solrFields.forEach( solrField => {
                data.push( [
                               sourceType,
                               solrField,
                               object.process,
                               `${ source }: ${ object.xpathQueries.join( ', ' ) }`,
                           ] );
            } );
        }

        return data;
    }

    function direct( sourceType, configFile ) {
        const data = [];

        for ( const [ source, object ] of Object.entries( configFile ) ) {
            object.solrFields.forEach( solrField => {
                data.push( [
                               sourceType,
                               solrField,
                               object.process,
                               source,
                           ] );
            } );
        }

        return data;
    }

    const componentSolrFieldsToEadCsvMapData = [];
    componentSolrFieldsToEadCsvMapData.push(
        ...direct( 'Non-Solrizer', COMPONENT_NON_SOLRIZER_SOLR_FIELDS_CONFIG )
    );
    componentSolrFieldsToEadCsvMapData.push(
        ...direct( 'Solrizer - non-xpath', COMPONENT_SOLRIZER_NON_XPATH_SOLR_FIELDS_CONFIG )
    );
    componentSolrFieldsToEadCsvMapData.push(
        ...direct( 'Solrizer - xpath query', COMPONENT_SOLRIZER_SIMPLE_SOLR_FIELDS_CONFIG )
    );

    componentSolrFieldsToEadCsvMapData.push(
        ...composite( 'Solrizer - composite', COMPONENT_SOLRIZER_COMPOSITE_SOLR_FIELDS_CONFIG )
    );

    return componentSolrFieldsToEadCsvMapData;
}

function getCollectionDocCsvMaps() {
    const collectionDocEadToSolrFieldsCsvMapData = getCollectionDocEadToSolrFieldsCsvMapData();
    const collectionDocSolrFieldsToEadCsvMapData = getCollectionDocSolrFieldsToEadCsvMapData();

    return {
        collectionDocEadToSolrFieldsCsvMap : {
            fields : CSV_FILE_HEADER_EAD_TO_SOLR_FIELD,
            data   : collectionDocEadToSolrFieldsCsvMapData,
        },
        collectionDocSolrFieldsToEadCsvMap : {
            fields : CSV_FILE_HEADER_TO_SOLR_FIELD_TO_EAD,
            data   : collectionDocSolrFieldsToEadCsvMapData,
        }
    };
}

function getPapaParseConfig() {
    return {
        // Or array of booleans
        quotes     : false,
        quoteChar  : '"',
        escapeChar : '"',
        delimiter  : ',',
        header     : true,
        newline    : '\n',
        // Other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        skipEmptyLines : false,
        // Or array of strings
        columns : null,
    };
}

function writeTransformationMapFiles(
    collectionDocEadToSolrFieldsCsvMap,
    collectionDocSolrFieldsToEadCsvMap,
    componentEadToSolrFieldsCsvMap,
    componentSolrFieldsToEadCsvMap,
) {
    const papaParseConfig = getPapaParseConfig();

    writeFileSync(
        path.join( EAD_TO_SOLR_FIELDS_DIR, 'collection-doc.csv' ),
        Papa.unparse( collectionDocEadToSolrFieldsCsvMap, papaParseConfig ),
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( SOLR_FIELDS_TO_EAD_DIR, 'collection-doc.csv' ),
        Papa.unparse( collectionDocSolrFieldsToEadCsvMap, papaParseConfig ),
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( EAD_TO_SOLR_FIELDS_DIR, 'component.csv' ),
        Papa.unparse( componentEadToSolrFieldsCsvMap, papaParseConfig ),
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( SOLR_FIELDS_TO_EAD_DIR, 'component.csv' ),
        Papa.unparse( componentSolrFieldsToEadCsvMap, papaParseConfig ),
        { encoding : 'utf8' },
    );
}

function main() {
    generateSolrFieldConfigurationFiles();

    const {
        collectionDocEadToSolrFieldsCsvMap,
        collectionDocSolrFieldsToEadCsvMap,
    } = getCollectionDocCsvMaps();

    const {
        componentEadToSolrFieldsCsvMap,
        componentSolrFieldsToEadCsvMap,
    } = getComponentCsvMaps();

    writeTransformationMapFiles(
        collectionDocEadToSolrFieldsCsvMap,
        collectionDocSolrFieldsToEadCsvMap,
        componentEadToSolrFieldsCsvMap,
        componentSolrFieldsToEadCsvMap,
    );
}

main();

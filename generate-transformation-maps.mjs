import { writeFileSync } from 'node:fs';
import path from 'node:path';
import * as url from 'url';

import Papa from 'papaparse';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname );

const TRANSFORMATION_MAPS_DIR = path.join( ROOT, 'transformation-maps' );
const EAD_TO_SOLR_FIELDS_DIR = path.join( TRANSFORMATION_MAPS_DIR, 'ead-to-solr-fields' );
const SOLR_FIELDS_TO_EAD_DIR = path.join( TRANSFORMATION_MAPS_DIR, 'solr-fields-to-ead' );

const SOLR_FIELD_CONFIGURATION_FILES =
    path.join( ROOT, 'solr-field-configuration-files' );

const MAIN_DOC_NON_SOLRIZER_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-non-solrizer-solr-fields.json' ) );
const MAIN_DOC_SOLRIZER_COMPOSITE_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-composite-solr-fields.json' ) );
const MAIN_DOC_SOLRIZER_NON_XPATH_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-non-xpath-to-solr-fields.json' ) );
const MAIN_DOC_SOLRIZER_SIMPLE_SOLR_FIELDS_CONFIG =
    require( path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-simple-xpath-to-solr-fields.json' ) );

const CSV_FILE_HEADER_EAD_TO_SOLR_FIELD = [ 'SOURCE TYPE', 'SOURCE', 'PROCESSING', 'SOLR FIELD' ];
const CSV_FILE_HEADER_TO_SOLR_FIELD_TO_EAD = [ 'SOURCE TYPE', 'SOLR_FIELD', 'PROCESSING', 'SOURCE' ];

function getMainDocCsvMaps() {
    const mainDocEadToSolrFieldsCsvMapData = getMainDocEadToSolrFieldsCsvMapData();

    return {
        mainDocEadToSolrFieldsCsvMap: {
            fields: CSV_FILE_HEADER_EAD_TO_SOLR_FIELD,
            data: mainDocEadToSolrFieldsCsvMapData,
        },
        mainDocSolrFieldsToEadCsvMap: {
            fields: CSV_FILE_HEADER_TO_SOLR_FIELD_TO_EAD,
            data: [
                'id',
                'n/a',
                'First token of <eadid>',
            ],
        }
    };
}

function getMainDocEadToSolrFieldsCsvMapData() {
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

    const mainDocEadToSolrFieldsCsvMapData = [];
    mainDocEadToSolrFieldsCsvMapData.push(
        ...direct( 'Non-Solrizer', MAIN_DOC_NON_SOLRIZER_SOLR_FIELDS_CONFIG )
    );
    mainDocEadToSolrFieldsCsvMapData.push(
        ...direct( 'Solrizer - non-xpath', MAIN_DOC_SOLRIZER_NON_XPATH_SOLR_FIELDS_CONFIG )
    );
    mainDocEadToSolrFieldsCsvMapData.push(
        ...direct( 'Solrizer - xpath query', MAIN_DOC_SOLRIZER_SIMPLE_SOLR_FIELDS_CONFIG )
    );

    mainDocEadToSolrFieldsCsvMapData.push(
        ...composite( 'Solrizer - composite', MAIN_DOC_SOLRIZER_COMPOSITE_SOLR_FIELDS_CONFIG )
    );

    return mainDocEadToSolrFieldsCsvMapData;
}

function getComponentCsvMaps() {
    return {
        componentEadToSolrFieldsCsvMap: 'Component EAD to Solr fields map CSV',
        componentSolrFieldsToEadCsvMap: 'Component Solr fields to EAD map CSV',
    };
}

function getPapaParseConfig() {
    return {
        // Or array of booleans
        quotes: false,
        quoteChar: '"',
        escapeChar: '"',
        delimiter: ',',
        header: true,
        newline: '\n',
        // Other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
        skipEmptyLines: false,
        // Or array of strings
        columns: null,
    };
}

function writeTransformationMapFiles(
    mainDocEadToSolrFieldsCsvMap,
    mainDocSolrFieldsToEadCsvMap,
    componentEadToSolrFieldsCsvMap,
    componentSolrFieldsToEadCsvMap,
) {
    const papaParseConfig = getPapaParseConfig();

    writeFileSync(
        path.join( EAD_TO_SOLR_FIELDS_DIR, 'main-doc.csv' ),
        Papa.unparse( mainDocEadToSolrFieldsCsvMap, papaParseConfig ),
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( SOLR_FIELDS_TO_EAD_DIR, 'main-doc.csv' ),
        Papa.unparse( mainDocSolrFieldsToEadCsvMap, papaParseConfig ),
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
    const {
        mainDocEadToSolrFieldsCsvMap,
        mainDocSolrFieldsToEadCsvMap,
    } = getMainDocCsvMaps();

    const {
        componentEadToSolrFieldsCsvMap,
        componentSolrFieldsToEadCsvMap,
    } = getComponentCsvMaps();

    writeTransformationMapFiles(
        mainDocEadToSolrFieldsCsvMap,
        mainDocSolrFieldsToEadCsvMap,
        componentEadToSolrFieldsCsvMap,
        componentSolrFieldsToEadCsvMap,
    );
}

main();

import { writeFileSync } from 'node:fs';

import path from 'node:path';
import * as url from 'url';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname );

const TRANSFORMATION_MAPS_DIR = path.join( ROOT, 'transformation-maps' );
const EAD_TO_SOLR_FIELDS_DIR = path.join( TRANSFORMATION_MAPS_DIR, 'ead-to-solr-fields' );
const SOLR_FIELDS_TO_EAD_DIR = path.join( TRANSFORMATION_MAPS_DIR, 'solr-fields-to-ead' );

const SOLR_FIELD_CONFIGURATION_FILES =
    path.join( ROOT, 'solr-field-configuration-files' );
const MAIN_DOC_NON_SOLRIZER_SOLR_FIELDS_FILE =
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-non-solrizer-solr-fields.json' )
const MAIN_DOC_SOLRIZER_COMPOSITE_SOLR_FIELDS_FILE =
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-composite-solr-fields.json' )
const MAIN_DOC_SOLRIZER_NON_XPATH_SOLR_FIELDS_FILE =
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-non-xpath-to-solr-fields.json' )
const MAIN_DOC_SOLRIZER_SIMPLE_SOLR_FIELDS_FILE =
    path.join( SOLR_FIELD_CONFIGURATION_FILES, 'main-doc-solrizer-simple-xpath-to-solr-fields.json' )

function getMainDocCsvMaps() {
    const mainDocNonSolrizerSolrFieldsConfig =
        require( MAIN_DOC_NON_SOLRIZER_SOLR_FIELDS_FILE );
    const mainDocSolrizerCompositeSolrFieldsConfig =
        require( MAIN_DOC_SOLRIZER_COMPOSITE_SOLR_FIELDS_FILE );
    const mainDocSolrizerNonXpathSolrFieldsConfig =
        require( MAIN_DOC_SOLRIZER_NON_XPATH_SOLR_FIELDS_FILE );
    const mainDocSolrizerSimpleSolrFieldsConfig =
        require( MAIN_DOC_SOLRIZER_SIMPLE_SOLR_FIELDS_FILE );

    return {
        mainDocEadToSolrFieldsCsvMap: 'Main doc EAD to Solr fields map CSV',
        mainDocSolrFieldsToEadCsvMap: 'Main doc Solr fields to EAD map CSV',
    };
}

function getComponentCsvMaps() {
    return {
        componentEadToSolrFieldsCsvMap: 'Component EAD to Solr fields map CSV',
        componentSolrFieldsToEadCsvMap: 'Component Solr fields to EAD map CSV',
    };
}

function writeTransformationMapFiles(
    mainDocEadToSolrFieldsCsvMap,
    mainDocSolrFieldsToEadCsvMap,
    componentEadToSolrFieldsCsvMap,
    componentSolrFieldsToEadCsvMap,
) {
    writeFileSync(
        path.join( EAD_TO_SOLR_FIELDS_DIR, 'main-doc.csv' ),
        mainDocEadToSolrFieldsCsvMap,
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( SOLR_FIELDS_TO_EAD_DIR, 'main-doc.csv' ),
        mainDocSolrFieldsToEadCsvMap,
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( EAD_TO_SOLR_FIELDS_DIR, 'component.csv' ),
        componentEadToSolrFieldsCsvMap,
        { encoding : 'utf8' },
    );

    writeFileSync(
        path.join( SOLR_FIELDS_TO_EAD_DIR, 'component.csv' ),
        componentSolrFieldsToEadCsvMap,
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

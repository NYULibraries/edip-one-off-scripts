import { writeFileSync } from 'node:fs';

import path from 'node:path';
import * as url from 'url';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname );

const TRANSFORMATION_MAPS_DIR = path.join( ROOT, 'transformation-maps' );
const EAD_TO_SOLR_FIELDS_DIR = path.join( TRANSFORMATION_MAPS_DIR, 'ead-to-solr-fields' );
const SOLR_FIELDS_TO_EAD_DIR = path.join( TRANSFORMATION_MAPS_DIR, 'solr-fields-to-ead' );

function getMainDocCsvMaps() {



    return {
        mainDocEadToSolrFieldsCsvMap: 'Main doc EAD to Solr fields map CSV',
        mainDocSolrFieldsToEadCsvMap: 'Main doc Solr fields to EAD map CSV',
    };
}

function getComponentCsvMaps() {
    return {
        componentEadToSolrFieldsCsvMap: 'Component EAD to Solr fields map CSV',
        componentSolrFieldsToEadCsvMap: 'Component Solr fields to EAD map CSV',
    };}

const {
    mainDocEadToSolrFieldsCsvMap,
    mainDocSolrFieldsToEadCsvMap,
} = getMainDocCsvMaps();

const {
    componentEadToSolrFieldsCsvMap,
    componentSolrFieldsToEadCsvMap,
} = getComponentCsvMaps();

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

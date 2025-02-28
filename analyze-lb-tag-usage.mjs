import fs from 'node:fs';
import path from 'node:path';
import * as url from 'url';

import { DOMParser } from '@xmldom/xmldom';
import xpath from 'xpath';

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname );

const LB_TAG_COUNTS_CSV_FILE = path.join( ROOT, 'doc', 'lb-tag-counts.csv' );
const LB_TAG_PATHS_CSV_FILE = path.join( ROOT, 'doc', 'lb-tag-paths.csv' );

const eadFilesRepo = process.argv[ 2 ];
const eadFilesPath = path.resolve( eadFilesRepo );
const eadFiles = fs.readdirSync( eadFilesPath, { recursive: true } )
    .filter( file => file.endsWith( '.xml' ) );

const lbTagCounts = {};
const lbTagPaths = {};

eadFiles.forEach( eadFile => {
    const eadFilePath = path.resolve( eadFilesPath, eadFile );
    const ead = fs.readFileSync( eadFilePath, { encoding: 'utf-8' } );
    const eadBlankNamespace = ead.replaceAll( 'xmlns="urn:isbn:1-931666-22-9"', 'xmlns=""' )
    const eadDoc = new DOMParser().parseFromString( eadBlankNamespace, 'text/xml' );

    const lbElements = xpath.select( '//lb', eadDoc );
    if ( lbElements.length > 0 ) {
        const eadId = path.basename( eadFilePath );
        const repositoryCode = path.basename( path.dirname( eadFilePath ) );
        const eadIdentifier = `${ repositoryCode }/${ eadId }`;
        lbElements.forEach( lbElement => {
            const parentArray = getParentArrayForElement( lbElement, [] );

            // Tag counts
            parentArray.forEach( parentTag => {
                if ( ! ( parentTag in lbTagCounts ) ) {
                    lbTagCounts[ parentTag ] = 0;
                }

                lbTagCounts[ parentTag ]++;
            } );

            // Paths
            const parentString = parentArray.join( " > " );
            if ( ! (parentString in lbTagPaths ) ) {
                lbTagPaths[ parentString ] = {};
            }

            if ( ! (eadIdentifier in lbTagPaths[ parentString ] ) ) {
                lbTagPaths[ parentString ][ eadIdentifier ] = 0;
            }

            lbTagPaths[ parentString ][ eadIdentifier ]++;
        } );
    }

    writeLbTagCountsCsvFile( lbTagCounts );
    writeLbTagPathsCsvFile( lbTagPaths );
} );

function getParentArrayForElement( element, parentArray ) {
    const parent = element.parentElement;
    if ( ! parent ) {
        return parentArray;
    }

    parentArray.unshift( parent.nodeName );

    return getParentArrayForElement( parent, parentArray );
}

function writeLbTagCountsCsvFile( lbTagCounts ) {
    let csvData = '';

    Object.keys( lbTagCounts ).sort().forEach( tag => {
        const count = lbTagCounts[ tag ];
        csvData += `"${ tag }",${ count }` + "\n";
    } );

    fs.writeFileSync( LB_TAG_COUNTS_CSV_FILE, csvData, { encoding : 'utf8' } );
}

function writeLbTagPathsCsvFile( lbTagPaths ) {
    let csvData = '';

    Object.keys( lbTagPaths ).sort().forEach( path => {
        Object.keys( lbTagPaths[ path ] ).sort().forEach( eadIdentifier => {
            const count = lbTagPaths[ path ][ eadIdentifier ];
            csvData += `"${ path }","${ eadIdentifier }",${ count }` + "\n";
        } );
    } );

    fs.writeFileSync( LB_TAG_PATHS_CSV_FILE, csvData, { encoding : 'utf8' } );
}

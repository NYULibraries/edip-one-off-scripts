import fs from 'node:fs';
import path from 'node:path';

import { DOMParser } from '@xmldom/xmldom';

const goldenFilesSetA = process.argv[ 2 ];
const goldenFilesSetB = process.argv[ 3 ];

const goldenFilesPathA = path.resolve( goldenFilesSetA );
const goldenFilesPathB = path.resolve( goldenFilesSetB );

const checkFilesDirPath = path.join( '/', 'tmp', 'check-files' );
const checkFilesADirPath = path.join( checkFilesDirPath, 'a' );
const checkFilesBDirPath = path.join( checkFilesDirPath, 'b' );

const goldenFilesA = fs.readdirSync( goldenFilesPathA, { recursive : true } )
    .filter( file => file.endsWith( '.xml' ) );

goldenFilesA.forEach( goldenFile => {
    const goldenFilePathA = path.resolve( goldenFilesPathA, goldenFile );
    const goldenFilePathB = path.resolve( goldenFilesPathB, goldenFile );

    const goldenA = fs.readFileSync( goldenFilePathA, { encoding : 'utf-8' } );
    const goldenB = fs.readFileSync( goldenFilePathB, { encoding : 'utf-8' } );

    const goldenDocA = new DOMParser().parseFromString( goldenA, 'text/xml' );
    const goldenDocB = new DOMParser().parseFromString( goldenB, 'text/xml' );

    const goldenDocACheckStringA = parseCheckString( goldenDocA );
    const goldenDocACheckStringB = parseCheckString( goldenDocB );

    writeCheckFile( checkFilesADirPath, goldenFile, goldenDocACheckStringA );
    writeCheckFile( checkFilesBDirPath, goldenFile, goldenDocACheckStringB );
} );

function parseCheckString( eadDoc ) {
    const checkObject = {};

    const fieldElementNodes = eadDoc.childNodes[ 1 ].childNodes[ 0 ].childNodes;

    const numFieldElementNodes = fieldElementNodes.length;

    for ( let i = 0; i < numFieldElementNodes; i++ ) {
        const fieldElementNode = fieldElementNodes[ i ];
        const fieldName = fieldElementNode.attributes[ 0 ].nodeValue;
        const fieldValue = fieldElementNode.textContent;

        if ( fieldName in checkObject ) {
            checkObject[ fieldName ].push( fieldValue );
        } else {
            checkObject[ fieldName ] = [ fieldValue ];
        }
    }

    const checkArray = [];
    Object.keys( checkObject ).sort().forEach( fieldName => {
        const fieldValues = checkObject[ fieldName ];
        checkArray.push(
            {
                field: fieldName,
                values: fieldValues,
            }
        );
    } );

    return JSON.stringify( checkArray, null, '    ' );
}

function writeCheckFile( checkFileDirectory, goldenFile, checkString ) {
    const filePath = path.join( checkFileDirectory, goldenFile ).replace( /.xml$/, '.txt' );
    const dirPath = path.dirname( filePath );

    fs.mkdirSync( dirPath, { recursive: true } );

    fs.writeFileSync( filePath, checkString, { encoding: 'utf8' } );
}

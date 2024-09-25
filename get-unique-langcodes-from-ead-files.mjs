import fs from 'node:fs';
import path from 'node:path';

import { DOMParser } from '@xmldom/xmldom';
import xpath from 'xpath';

const eadFilesRepo = process.argv[ 2 ];
const eadFilesPath = path.resolve( eadFilesRepo );
const eadFiles = fs.readdirSync( eadFilesPath, { recursive: true } )
    .filter( file => file.endsWith( '.xml' ) );

const langcodes = {};
eadFiles.forEach( eadFile => {
    const eadFilePath = path.resolve( eadFilesPath, eadFile );
    const ead = fs.readFileSync( eadFilePath, { encoding: 'utf-8' } );
    const eadDoc = new DOMParser().parseFromString( ead, 'text/xml' );
    const elementsWithLangcodeAttribute = xpath.select( '//*/@langcode', eadDoc );

    elementsWithLangcodeAttribute.forEach( elementWithLangcodeAttribute => {
        const langcode = elementWithLangcodeAttribute.value;

        if ( ! langcodes[ langcode ] ) {
            langcodes[ langcode ] = 1;
        } else {
            langcodes[ langcode ]++;
        }
    } );
} );

Object.keys( langcodes ).sort().forEach( langcode => {
    console.log( `${ langcode }: ${ langcodes[ langcode ] }` );
} );

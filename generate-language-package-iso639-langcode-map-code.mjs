import { readFileSync } from 'node:fs';
import path from 'node:path';
import * as url from 'url';

import Papa from 'papaparse';

import { createRequire } from "module";
const require = createRequire( import.meta.url );

const __dirname = url.fileURLToPath( new URL( '.', import.meta.url ) );

const ROOT = path.join( __dirname );

const ISO_639_2_DATA_FILE_CURRENT_OFFICIAL =
    path.join( ROOT, 'data-files', 'ISO-639-2_utf-8.txt' );

const ISO_639_2_DATA_FILE_V1_INDEXER =
    path.join( ROOT, 'data-files', 'ISO-639-2_utf-8_ruby-gem.txt' );

function addToMap( codeA, codeB, codeC, language, langcodeMap ) {
    if ( codeA === '' ) {
        return;
    }

    if ( ! langcodeMap[ codeA ] ) {
        langcodeMap[ codeA ] = {
            Codes: [ codeA ],
            Name: language,
        };
    }

    if ( codeB !== '' ) {
        langcodeMap[ codeA ].Codes.push( codeB );
    }

    if ( codeC !== '' ) {
        langcodeMap[ codeA ].Codes.push( codeC );
    }
}

function makeLangcodeMap( iso639Part2Data ) {
    const langcodeMap = {};

    iso639Part2Data.data.forEach( row => {
        let [ col1, col2, col3, language ] = row;

        addToMap( col1, col2, col3, language, langcodeMap );
        addToMap( col2, col1, col3, language, langcodeMap );
        addToMap( col3, col1, col2, language, langcodeMap );
    } );

    return langcodeMap;
}

let dataFile = ISO_639_2_DATA_FILE_CURRENT_OFFICIAL;
if ( process.argv[ 2 ].toLowerCase() === 'v1-indexer' ) {
    console.error( 'Using v1 indexer ISO-639-2 data file.' )
    dataFile = ISO_639_2_DATA_FILE_V1_INDEXER;
}

const iso639Part2Data = Papa.parse(
    readFileSync( dataFile, { encoding: 'utf-8' } )
);

const langcodeMap = makeLangcodeMap( iso639Part2Data );

// Generate the Go code for this var:
//
// var ISO639_2_DB = map[string]Language{
//     "aar":     {Codes: []string{"aar", "aa"}, Name: "Afar"},
//     "aa":      {Codes: []string{"aar", "aa"}, Name: "Afar"},
//     "abk":     {Codes: []string{"abk", "ab"}, Name: "Abkhazian"},
//     ...
// }
let golangCode = 'var ISO639_2_DB = map[string]Language{\n';
Object.keys( langcodeMap ).sort().forEach( langcode => {
    const codes = langcodeMap[ langcode ].Codes.sort( );
    const languageName = langcodeMap[ langcode ].Name;

    let codesString = '';
    for ( let i = 0; i < codes.length - 1; i++ ) {
        codesString += `"${ codes[ i ] }", `;
    }
    codesString += `"${ codes[ codes.length - 1 ] }"`;

    const line = `    "${ langcode }": {Codes: []string{${ codesString }}, Name: "${ languageName }"},\n`;

    golangCode += line;
} );

golangCode += '}\n';

console.log( golangCode );

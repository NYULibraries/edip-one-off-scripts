import { DATA_TYPES } from './v1-indexer-solr-fields.mjs';

const indexAsConversion = {
    displayable : {
        suffixes : [ '_ssm' ],
    },
    facetable : {
        suffixes : [ '_sim' ],
    },
    searchable : {
        suffixes : [
            '_teim',
            // These should never get used because for v1 indexer the data type
            // should always be string, and never date or integer.
            // '_dtim',
            // '_iim',
        ]
    },
    sortable : {
        // These suffixes should never get used because for v1 indexer the data type
        // should always be string or integer, and never date or "text".
        // _dti
        // _tei
        suffixes : {
            [ DATA_TYPES.INTEGER ] : [ '_ii' ],
            [ DATA_TYPES.STRING ]  : [ '_si' ],
        },
    },
    stored_searchable : {
        // These suffixes should never get used because for v1 indexer the data type
        // should always be boolean or integer, and never date or "text".
        // _dtsim
        // _tesim
        suffixes : {
            [ DATA_TYPES.BOOLEAN ] : [ '_bsi' ],
            [ DATA_TYPES.INTEGER ]  : [ '_isim' ],
        },
    },
    stored_sortable : {
        suffixes : [
            '_ssi',
            // This should never get used because for v1 indexer the data type
            // should always be string, and never date.
            // '_dtsi',
        ],
    }
}

export {
    indexAsConversion,
};

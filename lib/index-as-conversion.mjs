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
        suffixes : [
            '_si',
            '_ii',
            // These should never get used because for v1 indexer the data type
            // should always be string or integer, and never date or "text".
            // '_tei',
            // '_dti',
        ],
    },
    stored_searchable : {
        suffixes : [
            '_bsi',
            '_isim',
            // These should never get used because for v1 indexer the data type
            // should always be boolean or integer, and never date or "text".
            // '_tesim',
            // '_dtsim',
        ],
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

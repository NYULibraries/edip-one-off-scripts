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
            '_dtim',
            '_iim',
        ]
    },
    sortable : {
        suffixes : [
            '_tei',
            '_si',
            '_dti',
            '_ii',
        ],
    },
    stored_searchable : {
        suffixes : [
            '_tesim',
            '_dtsim',
            '_isim',
        ],
    },
    stored_sortable : {
        suffixes : [
            '_ssi',
            '_dtsi',
        ],
    }
}

export {
    indexAsConversion,
};

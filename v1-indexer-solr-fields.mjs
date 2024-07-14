const mainDocSolrFields = {
    direct : {
        id : {
            source : 'First token of <eadid>',
        },
    },
    nonXpath: {
        formatArchivalCollection: {
            basename: 'format',
            source : [ 'Hardcoded "Archival Collection"' ],
            indexAsArray : [ 'facetable', 'displayable' ],
        },
        formatDummyForMainDocSort: {
            basename: 'format',
            source : [ 0 ],
            indexAsArray : [ 'sortable' ],
        },
        repository : {
            source    : [ 'Derived from name of parent directory of EAD file' ],
            indexAsArray : [ 'displayable', 'facetable', 'stored_sortable' ],
        },
    },
    xpath: {
        abstract : {
            xpath    : 'archdesc[@level=\'collection\']/did/abstract',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        acqinfo : {
            xpath    : 'archdesc[@level=\'collection\']/acqinfo/p',
            indexAsArray : [ 'searchable' ],
        },
        appraisal : {
            xpath    : 'archdesc[@level=\'collection\']/appraisal/p',
            indexAsArray : [ 'searchable' ],
        },
        author : {
            xpath    : 'filedesc/titlestmt/author',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        bioghist : {
            xpath    : 'archdesc[@level=\'collection\']/bioghist/p',
            indexAsArray : [ 'searchable' ],
        },
        chronlist : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//chronlist/chronitem//text()',
            indexAsArray : [ 'searchable' ],
        },
        collection : {
            xpath    : 'archdesc[@level=\'collection\']/did/unittitle',
            indexAsArray : [ 'facetable', 'displayable', 'searchable' ],
        },
        corpname : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//corpname',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        creator : {
            xpath    : 'archdesc[@level=\'collection\']/did/origination[@label=\'creator\']/*[#{creator_fields_to_xpath}]',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        custodhist : {
            xpath    : 'archdesc[@level=\'collection\']/custodhist/p',
            indexAsArray : [ 'searchable' ],
        },
        ead : {
            xpath : 'eadid',
            indexAsArray : [ 'stored_sortable' ],
        },
        famname : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//famname',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        function : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//function',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        genreform : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//genreform',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        geogname : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//geogname',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        langcode : {
            xpath : 'archdesc[@level=\'collection\']/did/langmaterial/language/@langcode',
            indexAsArray : [ 'stored_searchable' ],
        },
        name : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//name',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        note : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//note',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        occupation : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//occupation',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        persname : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//persname',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        phystech : {
            xpath    : 'archdesc[@level=\'collection\']/phystech/p',
            indexAsArray : [ 'searchable' ],
        },
        scopecontent : {
            xpath    : 'archdesc[@level=\'collection\']/scopecontent/p',
            indexAsArray : [ 'searchable' ],
        },
        subject : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//subject',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        title : {
            xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//title',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        unitdate : {
            xpath    : 'archdesc[@level=\'collection\']/did/unitdate[not(@type)]',
            indexAsArray : [ 'searchable' ],
        },
        unitdate_bulk : {
            xpath    : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'bulk\']',
            indexAsArray : [ 'searchable' ],
        },
        unitdate_normal : {
            xpath    : 'archdesc[@level=\'collection\']/did/unitdate/@normal',
            indexAsArray : [ 'displayable', 'searchable', 'facetable' ],
        },
        unitdate_inclusive : {
            xpath    : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'inclusive\']',
            indexAsArray : [ 'searchable' ],
        },
        unitid : {
            xpath    : 'archdesc[@level=\'collection\']/did/unitid',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
        unittitle : {
            xpath    : 'archdesc[@level=\'collection\']/did/unittitle',
            indexAsArray : [ 'searchable', 'displayable' ],
        },
    },
};

export {
    mainDocSolrFields,
};

const solrFields = {
    author : {
        xpath    : 'filedesc/titlestmt/author',
        index_as : [ 'searchable', 'displayable' ],
    },
    unittitle : {
        xpath    : 'archdesc[@level=\'collection\']/did/unittitle',
        index_as : [ 'searchable', 'displayable' ],
    },
    unitid : {
        xpath    : 'archdesc[@level=\'collection\']/did/unitid',
        index_as : [ 'searchable', 'displayable' ],
    },
    langcode : {
        xpath : 'archdesc[@level=\'collection\']/did/langmaterial/language/@langcode',
    },
    abstract : {
        xpath    : 'archdesc[@level=\'collection\']/did/abstract',
        index_as : [ 'searchable', 'displayable' ],
    },
    creator : {
        xpath    : 'archdesc[@level=\'collection\']/did/origination[@label=\'creator\']/*[#{creator_fields_to_xpath}]',
        index_as : [ 'searchable', 'displayable' ],
    },
    unitdate_normal : {
        xpath    : 'archdesc[@level=\'collection\']/did/unitdate/@normal',
        index_as : [ 'displayable', 'searchable', 'facetable' ],
    },
    unitdate : {
        xpath    : 'archdesc[@level=\'collection\']/did/unitdate[not(@type)]',
        index_as : [ 'searchable' ],
    },
    unitdate_bulk : {
        xpath    : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'bulk\']',
        index_as : [ 'searchable' ],
    },
    unitdate_inclusive : {
        xpath    : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'inclusive\']',
        index_as : [ 'searchable' ],
    },
    scopecontent : {
        xpath    : 'archdesc[@level=\'collection\']/scopecontent/p',
        index_as : [ 'searchable' ],
    },
    bioghist : {
        xpath    : 'archdesc[@level=\'collection\']/bioghist/p',
        index_as : [ 'searchable' ],
    },
    acqinfo : {
        xpath    : 'archdesc[@level=\'collection\']/acqinfo/p',
        index_as : [ 'searchable' ],
    },
    custodhist : {
        xpath    : 'archdesc[@level=\'collection\']/custodhist/p',
        index_as : [ 'searchable' ],
    },
    appraisal : {
        xpath    : 'archdesc[@level=\'collection\']/appraisal/p',
        index_as : [ 'searchable' ],
    },
    phystech : {
        xpath    : 'archdesc[@level=\'collection\']/phystech/p',
        index_as : [ 'searchable' ],
    },

    chronlist : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//chronlist/chronitem//text()',
        index_as : [ 'searchable' ],
    },
    corpname : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//corpname',
        index_as : [ 'searchable', 'displayable' ],
    },
    famname : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//famname',
        index_as : [ 'searchable', 'displayable' ],
    },

    function : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//function',
        index_as : [ 'searchable', 'displayable' ],
    },

    genreform : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//genreform',
        index_as : [ 'searchable', 'displayable' ],
    },
    geogname : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//geogname',
        index_as : [ 'searchable', 'displayable' ],
    },
    name : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//name',
        index_as : [ 'searchable', 'displayable' ],
    },
    occupation : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//occupation',
        index_as : [ 'searchable', 'displayable' ],
    },
    persname : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//persname',
        index_as : [ 'searchable', 'displayable' ],
    },
    subject : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//subject',
        index_as : [ 'searchable', 'displayable' ],
    },
    title : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//title',
        index_as : [ 'searchable', 'displayable' ],
    },
    note : {
        xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//note',
        index_as : [ 'searchable', 'displayable' ],
    },
};

export {
    solrFields,
};

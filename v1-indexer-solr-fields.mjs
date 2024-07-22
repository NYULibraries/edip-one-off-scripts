const DISPLAYABLE = 'displayable';
const FACETABLE = 'facetable';
const SEARCHABLE = 'searchable';
const STORED_STORABLE = 'stored_sortable';
const STORED_SEARCHABLE = 'stored_searchable';

const mainDocSolrFields = {
    nonSolrizer : {
        id : {
            source : 'First token of <eadid>',
        },
    },
    solrizer : {
        composite: {
            creator : {
                xpathQueries: [
                    "//origination[@label='creator']/corpname",
                    "//origination[@label='creator']/famname",
                    "//origination[@label='creator']/persname",
                ],
                process: 'Get elements for each xpath query in the order listed.' +
                         ' Flatten returned node sets into one array, remove' +
                         ' duplicates, and remove `nil` values.',
                indexAsArray : [ DISPLAYABLE, FACETABLE ],
            },
        },
        nonXpath: {
            formatArchivalCollection: {
                basename: 'format',
                source : [ 'Hardcoded "Archival Collection"' ],
                indexAsArray : [ FACETABLE, DISPLAYABLE ],
            },
            formatDummyForMainDocSort: {
                basename: 'format',
                source : [ 0 ],
                indexAsArray : [ 'sortable' ],
            },
            repository : {
                source    : [ 'Derived from name of parent directory of EAD file' ],
                indexAsArray : [ DISPLAYABLE, FACETABLE, STORED_STORABLE ],
            },
        },
        xpath: {
            abstract : {
                xpath    : 'archdesc[@level=\'collection\']/did/abstract',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            acqinfo : {
                xpath    : 'archdesc[@level=\'collection\']/acqinfo/p',
                indexAsArray : [ SEARCHABLE ],
            },
            appraisal : {
                xpath    : 'archdesc[@level=\'collection\']/appraisal/p',
                indexAsArray : [ SEARCHABLE ],
            },
            author : {
                xpath    : 'filedesc/titlestmt/author',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            bioghist : {
                xpath    : 'archdesc[@level=\'collection\']/bioghist/p',
                indexAsArray : [ SEARCHABLE ],
            },
            chronlist : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//chronlist/chronitem//text()',
                indexAsArray : [ SEARCHABLE ],
            },
            collection : {
                xpath    : 'archdesc[@level=\'collection\']/did/unittitle',
                indexAsArray : [ FACETABLE, DISPLAYABLE, SEARCHABLE ],
            },
            corpname : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//corpname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            creator : {
                xpath    : 'archdesc[@level=\'collection\']/did/origination[@label=\'creator\']/*[#{creator_fields_to_xpath}]',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            custodhist : {
                xpath    : 'archdesc[@level=\'collection\']/custodhist/p',
                indexAsArray : [ SEARCHABLE ],
            },
            ead : {
                xpath : 'eadid',
                indexAsArray : [ STORED_STORABLE ],
            },
            famname : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//famname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            function : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//function',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            genreform : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//genreform',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            geogname : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//geogname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            langcode : {
                xpath : 'archdesc[@level=\'collection\']/did/langmaterial/language/@langcode',
                indexAsArray : [ STORED_SEARCHABLE ],
            },
            name : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//name',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            note : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//note',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            occupation : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//occupation',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            persname : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//persname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            phystech : {
                xpath    : 'archdesc[@level=\'collection\']/phystech/p',
                indexAsArray : [ SEARCHABLE ],
            },
            scopecontent : {
                xpath    : 'archdesc[@level=\'collection\']/scopecontent/p',
                indexAsArray : [ SEARCHABLE ],
            },
            subject : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//subject',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            title : {
                xpath    : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//title',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            unitdate : {
                xpath    : 'archdesc[@level=\'collection\']/did/unitdate[not(@type)]',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_bulk : {
                xpath    : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'bulk\']',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_normal : {
                xpath    : 'archdesc[@level=\'collection\']/did/unitdate/@normal',
                indexAsArray : [ DISPLAYABLE, SEARCHABLE, FACETABLE ],
            },
            unitdate_inclusive : {
                xpath    : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'inclusive\']',
                indexAsArray : [ SEARCHABLE ],
            },
            unitid : {
                xpath    : 'archdesc[@level=\'collection\']/did/unitid',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            unittitle : {
                xpath    : 'archdesc[@level=\'collection\']/did/unittitle',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
        },
    },
};

export {
    mainDocSolrFields,
};

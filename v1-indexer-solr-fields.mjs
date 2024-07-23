const DISPLAYABLE = 'displayable';
const FACETABLE = 'facetable';
const SEARCHABLE = 'searchable';
const SORTABLE = 'sortable';
const STORED_SEARCHABLE = 'stored_searchable';
const STORED_STORABLE = 'stored_sortable';

const mainDocSolrFields = {
    nonSolrizer : {
        id : {
            source : 'First token of <eadid>',
        },
    },
    solrizer    : {
        composite : {
            creator : {
                xpathQueries : [
                    "//origination[@label='creator']/corpname",
                    "//origination[@label='creator']/famname",
                    "//origination[@label='creator']/persname",
                ],
                process      : 'Get elements for each xpath query in the order listed.' +
                               ' Flatten returned node sets into one array, remove' +
                               ' duplicates, and remove `nil` values.',
                indexAsArray : [ DISPLAYABLE, FACETABLE ],
            },
            name    : {
                xpathQueries : [
                    "//famname",
                    "//persname",
                    "//*[local-name()!='repository']/corpname",
                ],
                process      : 'Get elements for each xpath query in the order listed.' +
                               ' Flatten returned node sets into one array,' +
                               ' remove `nil` values, and remove duplicates, and for ' +
                               ' each element replace strings matching /\|\w{1}/' +
                               ' (MARC subfield demarcators) with "--".',
                indexAsArray : [ FACETABLE, SEARCHABLE ],
            },
            subject : {
                xpathQueries : [
                    '[archdesc[@level=\'collection\']/*[name() != \'dsc\']//subject',
                    '//*[local-name()=\'subject\' or local-name()=\'function\' or local-name() = \'occupation\']',
                ],
                process      : 'For the first xpath query, create these Solr doc fields: ' +
                               ' `subject_ssm`, `subject_teim`, `subject_dtim`, `subject_iim`.' +
                               ' For the second xpath query, create the same set of' +
                               ' Solr fields plus `subject_sim`, taking the node sets' +
                               ' and flattening them into an array, remove `nil` values' +
                               ' and duplicates.  For each element replace strings matching' +
                               ' /\|\w{1}/ (MARC subfield demarcators) with "--".',
                indexAsArray : [ FACETABLE, SEARCHABLE, DISPLAYABLE ],
            },
        },
        nonXpath  : {
            dao                       : {
                basename     : 'dao',
                source       : 'Hardcoded "Online Access" if //dao is not empty',
                indexAsArray : [ FACETABLE ],
            },
            formatArchivalCollection  : {
                basename     : 'format',
                source       : 'Hardcoded "Archival Collection"',
                indexAsArray : [ FACETABLE, DISPLAYABLE ],
            },
            formatDummyForMainDocSort : {
                basename     : 'format',
                source       : 'Hardcoded 0 (number, not string)',
                indexAsArray : [ SORTABLE ],
            },
            repository                : {
                source       : 'Derived from name of parent directory of EAD file',
                indexAsArray : [ DISPLAYABLE, FACETABLE, STORED_STORABLE ],
            },
            unitdateDisplay : {
                basename: 'unitdate',
                source : 'If \`unitdate\` is empty: "Inclusive," plus `unitdate_inclusive` if both either `unitdate_inclusive` or `unitdate_bulk` are non-empty, plus ";" and `unitdate_bulk` if non-empty.  NOTE: This is likely a bug in v1 indexer -- see https://jira.nyu.edu/browse/DLFA-211?focusedCommentId=8378822&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-8378822.',
                indexAsArray : [ DISPLAYABLE ],
            },
        },
        xpath     : {
            abstract           : {
                xpath        : 'archdesc[@level=\'collection\']/did/abstract',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            acqinfo            : {
                xpath        : 'archdesc[@level=\'collection\']/acqinfo/p',
                indexAsArray : [ SEARCHABLE ],
            },
            appraisal          : {
                xpath        : 'archdesc[@level=\'collection\']/appraisal/p',
                indexAsArray : [ SEARCHABLE ],
            },
            author             : {
                xpath        : 'filedesc/titlestmt/author',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            bioghist           : {
                xpath        : 'archdesc[@level=\'collection\']/bioghist/p',
                indexAsArray : [ SEARCHABLE ],
            },
            chronlist          : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//chronlist/chronitem//text()',
                indexAsArray : [ SEARCHABLE ],
            },
            collection         : {
                xpath        : 'archdesc[@level=\'collection\']/did/unittitle',
                indexAsArray : [ FACETABLE, DISPLAYABLE, SEARCHABLE ],
            },
            corpname           : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//corpname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            creator            : {
                xpath        : 'archdesc[@level=\'collection\']/did/origination[@label=\'creator\']/*[#{creator_fields_to_xpath}]',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            custodhist         : {
                xpath        : 'archdesc[@level=\'collection\']/custodhist/p',
                indexAsArray : [ SEARCHABLE ],
            },
            ead                : {
                xpath        : 'eadid',
                indexAsArray : [ STORED_STORABLE ],
            },
            famname            : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//famname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            function           : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//function',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            genreform          : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//genreform',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            geogname           : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//geogname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            heading            : {
                xpath        : 'archdesc[@level=\'collection\']/did/unittitle',
                indexAsArray : [ DISPLAYABLE ],
            },
            langcode           : {
                xpath        : 'archdesc[@level=\'collection\']/did/langmaterial/language/@langcode',
                indexAsArray : [ STORED_SEARCHABLE ],
            },
            material_type      : {
                xpath        : '//genreform',
                process      : 'For each element, replace strings matching /\|\w{1}/' +
                               ' (MARC subfield demarcators) with "--",' +
                               ' remove `nil` values, and remove duplicates.',
                indexAsArray : [ FACETABLE, DISPLAYABLE ],
            },
            name               : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//name',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            note               : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//note',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            occupation         : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//occupation',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            persname           : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//persname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            phystech           : {
                xpath        : 'archdesc[@level=\'collection\']/phystech/p',
                indexAsArray : [ SEARCHABLE ],
            },
            place              : {
                xpath        : '//geogname',
                process      : 'For each element, replace strings matching /\|\w{1}/' +
                               ' (MARC subfield demarcators) with "--",' +
                               ' remove `nil` values, and remove duplicates.',
                indexAsArray : [ FACETABLE ],
            },
            scopecontent       : {
                xpath        : 'archdesc[@level=\'collection\']/scopecontent/p',
                indexAsArray : [ SEARCHABLE ],
            },
            title              : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//title',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            unitdate           : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate[not(@type)]',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_bulk      : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'bulk\']',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_end       : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate[not(@type)]',
                process      : 'For each element returned, if the value matches /(\\d{4})\\/(\\d{4})/,' +
                               ' take the number on the right of the slash and add to array to be indexed.',
                indexAsArray : [ FACETABLE, DISPLAYABLE, SORTABLE ],
            },
            unitdate_normal    : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate/@normal',
                indexAsArray : [ DISPLAYABLE, SEARCHABLE, FACETABLE ],
            },
            unitdate_inclusive : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'inclusive\']',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_start     : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate[not(@type)]',
                process      : 'For each element returned, if the value matches /(\\d{4})\\/(\\d{4})/,' +
                               ' take the number on the left of the slash and add to array to be indexed.',
                indexAsArray : [ FACETABLE, DISPLAYABLE, SORTABLE ],
            },
            unitid             : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitid',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            unittitle          : {
                xpath        : 'archdesc[@level=\'collection\']/did/unittitle',
                process      : 'For `unittitle_teim`, `unittitle_dtim`, and `unittitle_iim`,' +
                               ' no special instructions.  For `unittitle_ssm`: change' +
                               ' all EAD tags in the <unittitle> text which have `render`' +
                               ' attributes to the appropriate HTML tag using this' +
                               ' table: https://github.com/awead/solr_ead/blob/v0.7.5/lib/solr_ead/formatting.rb#L5-L23' +
                               ' and remove the `render` attribute from the tag.',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
        },
    },
};

export {
    mainDocSolrFields,
};

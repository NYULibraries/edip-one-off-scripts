const DISPLAYABLE = 'displayable';
const FACETABLE = 'facetable';
const SEARCHABLE = 'searchable';
const SORTABLE = 'sortable';
const STORED_SEARCHABLE = 'stored_searchable';
const STORED_SORTABLE = 'stored_sortable';

// Needed for SORTABLE and STORED_SEARCHABLE
const DATA_TYPES = {
    BOOLEAN : 'boolean',
    INTEGER : 'integer',
    STRING  : 'string',
};

const collectionDocSolrFields = {
    nonSolrizer : {
        id : {
            source : 'First element of <eadid> xpath query results array',
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
                               ' Flatten returned node sets into one array,' +
                               ' and remove `nil` values.  Note that these xpath' +
                               ' queries are case-sensitive.  For the new indexer,' +
                               ' we will replace `@label=\'creator\'` with XPath 1.0' +
                               ' compliant `translate(@label, \'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\')=\'creator\'`' +
                               ' to enable matching for "creator" and "Creator"' +
                               ' (necessary for fixing https://jira.nyu.edu/browse/FADESIGN-843)',
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
        },
        nonXpath  : {
            dao                       : {
                basename     : 'dao',
                source       : 'Hardcoded "Online Access" if //dao is not empty',
                indexAsArray : [ FACETABLE ],
            },
            dateRange                 : {
                basename     : 'date_range',
                source       : 'For each [UNITDATE_NORMAL] date that falls within `start_date` and `end_date` ranges found in v1 indexer `DATE_RANGES` here: https://github.com/NYULibraries/ead_indexer/blob/f1bc142dfe1507dbd173bfa126168fa52bba9871/lib/ead_indexer/behaviors/dates.rb#L4-L15, add to array.  If there are no in-range values, then value is an array with a single string "undated & other".',
                indexAsArray : [ FACETABLE ],
            },
            formatArchivalCollection  : {
                basename     : 'format',
                source       : 'Hardcoded "Archival Collection"',
                indexAsArray : [ FACETABLE, DISPLAYABLE ],
            },
            formatDummyForCollectionDocSort : {
                basename     : 'format',
                source       : 'Hardcoded 0 (number, not string)',
                dataType     : DATA_TYPES.INTEGER,
                indexAsArray : [ SORTABLE ],
            },
            repository                : {
                basename     : 'repository',
                source       : 'Derived from name of parent directory of EAD file',
                indexAsArray : [ DISPLAYABLE, FACETABLE, STORED_SORTABLE ],
            },
            unitdateDisplay           : {
                basename     : 'unitdate',
                source       : 'If `unitdate` is not empty, use `unitdate` values joined in a comma-delimited list, else if \`unitdate\` is empty: "Inclusive," plus `unitdate_inclusive` if both either `unitdate_inclusive` or `unitdate_bulk` are non-empty, plus ";" and `unitdate_bulk` if non-empty.  NOTE: This is likely a bug in v1 indexer -- see https://jira.nyu.edu/browse/DLFA-211?focusedCommentId=8378822&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-8378822.',
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
                xpath        : 'archdesc[@level=\'collection\']/did/origination[@label=\'creator\']/*[name() = \'corpname\' or name() = \'famname\' or name() = \'persname\']',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
                process      : ' Note that these xpath queries are case-sensitive.' +
                               ' For the new indexer, we will replace `@label=\'creator\'` +' +
                               ' with XPath 1.0 compliant' +
                               ' `translate(@label, \'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\')=\'creator\'`' +
                               ' to enable matching for "creator" and "Creator"' +
                               ' (necessary for fixing https://jira.nyu.edu/browse/FADESIGN-843)',
            },
            custodhist         : {
                xpath        : 'archdesc[@level=\'collection\']/custodhist/p',
                indexAsArray : [ SEARCHABLE ],
            },
            ead                : {
                xpath        : 'eadid',
                indexAsArray : [ STORED_SORTABLE ],
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
            language           : {
                xpath        : 'archdesc[@level=\'collection\']/did/langmaterial/language/@langcode',
                process      : 'Get the first Node returned by the xpath query,' +
                               ' translate the langcode to a language name using' +
                               ' this table: https://github.com/xwmx/iso-639/blob/169e152b4af5ca4a7876a3c7e37fcd272c3e577f/lib/data/ISO-639-2_utf-8.txt' +
                               ' If the langcode is 3 or 7 characters and is found' +
                               ' in the first or second columns of an entry in the' +
                               ' table, use value in the fourth column' +
                               ' for that entry, else if the langcode is 2 characters' +
                               ' and is found in the third column of an entry in' +
                               ' the table, use value in the fourth column for that entry.',
                indexAsArray : [ FACETABLE, DISPLAYABLE ],
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
            subject            : {
                xpath        : 'archdesc[@level=\'collection\']/*[name() != \'dsc\']//subject',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            subject_facets     : {
                basename     : 'subject',
                xpath        : '//*[local-name()=\'subject\' or local-name()=\'function\' or local-name() = \'occupation\']',
                process      : 'Take the node sets, flatten them into an array,' +
                               ' and remove `nil` values and duplicates.  For ' +
                               ' each element replace strings matching' +
                               ' /\|\w{1}/ (MARC subfield demarcators) with "--".',
                indexAsArray : [ FACETABLE, SEARCHABLE ],
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
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate/@normal',
                process      : 'For each element returned, if the value matches /(\\d{4})\\/(\\d{4})/,' +
                               ' take the number on the right of the slash and add to array to be indexed.',
                dataType     : DATA_TYPES.STRING,
                indexAsArray : [ FACETABLE, DISPLAYABLE, SORTABLE ],
            },
            unitdate_inclusive : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'inclusive\']',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_normal    : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate/@normal',
                indexAsArray : [ DISPLAYABLE, SEARCHABLE, FACETABLE ],
            },
            unitdate_start     : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate/@normal',
                dataType     : DATA_TYPES.STRING,
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
                process      : 'For `unittitle_teim`, no special instructions. ' +
                               ' For `unittitle_ssm`: sanitize ' +
                               ' (see https://jira.nyu.edu/browse/DLFA-209)' +
                               ' and change all EAD tags in the <unittitle> text' +
                               ' which have `render` attributes to the appropriate' +
                               ' HTML tag using this table:' +
                               ' https://github.com/awead/solr_ead/blob/v0.7.5/lib/solr_ead/formatting.rb#L5-L23' +
                               ' and remove the `render` attribute from the tag.',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
        },
    },
};

const componentSolrFields = {
    solrizer : {
        composite : {
            // From `additional_component_fields()`
            id                : {
                xpathQueries : [
                    '//eadid',
                ],
                process      : 'Append the `id` attribute of the <c> to the' +
                               ' <eadid> value.  Example: "photos_223aspace_ref1"',
                indexAsArray : undefined,
            },
            creator           : {
                xpathQueries : [
                    "//origination[@label='creator']/corpname",
                    "//origination[@label='creator']/famname",
                    "//origination[@label='creator']/persname",
                ],
                process      : 'Get elements for each xpath query in the order listed.' +
                               ' Flatten returned node sets into one array,' +
                               ' and remove `nil` values.  Note that these xpath' +
                               ' queries are case-sensitive.  For the new indexer,' +
                               ' we will replace `@label=\'creator\'` with XPath 1.0' +
                               ' compliant `translate(@label, \'ABCDEFGHIJKLMNOPQRSTUVWXYZ\',\'abcdefghijklmnopqrstuvwxyz\')=\'creator\'`' +
                               ' to enable matching for "creator" and "Creator"' +
                               ' (necessary for fixing https://jira.nyu.edu/browse/FADESIGN-843)',
                indexAsArray : [ DISPLAYABLE, FACETABLE ],
            },
            location          : {
                xpathQueries : [
                    '//container/@id',
                    '//container[@id = \'#{id}\']/@type',
                    '//container[@id = \'#{id}\']',
                    '//container[@parent = \'#{id}\']',
                ],
                dataType     : DATA_TYPES.STRING,
                process      : 'For each element returned by `//container/@id`, construct' +
                               ' a string: "[CONTAINER TYPE ATTRIBUTE]: [CONTAINER ID ATTRIBUTE], [SUB-CONTAINER INFO]",' +
                               ' where [CONTAINER TYPE ATTRIBUTE] is `//container[@id = \'#{id}\']/@type`, ' +
                               ' [CONTAINER ID ATTRIBUTE] is `//container[@id = \'#{id}\']`,' +
                               ' and [SUB-CONTAINER INFO] is comma-delimited list of' +
                               ' strings based on the elements returned by' +
                               ' `//container[@parent = \'#{id}\']`, with each string' +
                               ' constructed like this: "[TYPE ATTRIBUTE OF THE (SUB-)<container>]: [TEXT OF THE (SUB-)<container>]"',
                indexAsArray : [ DISPLAYABLE, SORTABLE ],
            },
            parent_unittitles : {
                xpathQueries : [
                    '/c/did/unittitle',
                    '/c/did/unitdate',
                ],
                process      : 'For each ancestor <c>, starting from the earliest' +
                               ' ancestor to the immediate parent, if extract' +
                               ' the first <unititle> element and add to array.' +
                               ' For <unittitle> value, sanitize ' +
                               ' (see https://jira.nyu.edu/browse/DLFA-209)' +
                               ' and change all EAD tags in the <unittitle> text' +
                               ' which have `render` attributes to the appropriate' +
                               ' HTML tag using this table:' +
                               ' https://github.com/awead/solr_ead/blob/v0.7.5/lib/solr_ead/formatting.rb#L5-L23' +
                               ' and remove the `render` attribute from the tag. ' +
                               ' If there are no <unittitle> elements, collect' +
                               ' the first <unitdate> element instead, using the' +
                               ' same processing instructions.  If there are no' +
                               ' <unitdate> elements, set value to "[No title available]"',
                indexAsArray : [ DISPLAYABLE, SEARCHABLE ],
            },
            seriesForFacet    : {
                basename     : 'series',
                xpathQueries : [
                    '/c/did/unittitle',
                    '/c/did/unitdate',
                ],
                process      : 'For each ancestor <c>, starting from the earliest' +
                               ' ancestor to the immediate parent, if extract' +
                               ' the first <unititle> element and add to array.' +
                               ' For <unittitle> value, sanitize ' +
                               ' (see https://jira.nyu.edu/browse/DLFA-209)' +
                               ' and change all EAD tags in the <unittitle> text' +
                               ' which have `render` attributes to the appropriate' +
                               ' HTML tag using this table:' +
                               ' https://github.com/awead/solr_ead/blob/v0.7.5/lib/solr_ead/formatting.rb#L5-L23' +
                               ' and remove the `render` attribute from the tag. ' +
                               ' If there are no <unittitle> elements, collect' +
                               ' the first <unitdate> element instead, using the' +
                               ' same processing instructions.  If there are no' +
                               ' <unitdate> elements, set value to "[No title available]"',
                indexAsArray : [ FACETABLE ],
            },
            seriesForSort     : {
                basename     : 'series',
                xpathQueries : [
                    '/c/did/unittitle',
                    '/c/did/unitdate',
                    'did/unittitle',
                ],
                dataType     : DATA_TYPES.STRING,
                process      : 'For each ancestor <c>, starting from the earliest' +
                               ' ancestor to the immediate parent, if extract' +
                               ' the first <unititle> element and add to array.' +
                               ' For <unittitle> value, sanitize ' +
                               ' (see https://jira.nyu.edu/browse/DLFA-209)' +
                               ' and change all EAD tags in the <unittitle> text' +
                               ' which have `render` attributes to the appropriate' +
                               ' HTML tag using this table:' +
                               ' https://github.com/awead/solr_ead/blob/v0.7.5/lib/solr_ead/formatting.rb#L5-L23' +
                               ' and remove the `render` attribute from the tag. ' +
                               ' If there are no <unittitle> elements, collect' +
                               ' the first <unitdate> element instead, using the' +
                               ' same processing instructions.  If there are no' +
                               ' <unitdate> elements, set value to "[No title available]"' +
                               ' These are the "parent titles".  Add a comma and' +
                               ' a space to these parent titles, then add the' +
                               ' `did/unittitle` value -- the processing for this value:' +
                               ' sanitize (see https://jira.nyu.edu/browse/DLFA-209)' +
                               ' and change all EAD tags in the <unittitle> text' +
                               ' which have `render` attributes to the appropriate' +
                               ' HTML tag using this table:' +
                               ' https://github.com/awead/solr_ead/blob/v0.7.5/lib/solr_ead/formatting.rb#L5-L23' +
                               ' and remove the `render` attribute from the tag.' +
                               ' If there are no parent titles, just use this' +
                               ' processed `did/unittitle` value.',
                indexAsArray : [ SORTABLE ],
            },
        },
        nonXpath  : {
            componentChildren                      : {
                basename     : 'component_children',
                source       : '`true` if there are <c> child nodes, otherwise `false`',
                dataType     : DATA_TYPES.BOOLEAN,
                indexAsArray : [ STORED_SEARCHABLE ],
            },
            componentLevel                         : {
                basename     : 'component_level',
                source       : 'The number of ancestor <c> elements plus 1',
                dataType     : DATA_TYPES.INTEGER,
                indexAsArray : [ STORED_SEARCHABLE ],
            },
            dao                                    : {
                basename     : 'dao',
                source       : 'Hardcoded "Online Access" if //dao is not empty',
                indexAsArray : [ FACETABLE ],
            },
            dateRange                              : {
                basename     : 'date_range',
                source       : 'For each [UNITDATE_NORMAL] date that falls within `start_date` and `end_date` ranges found in v1 indexer `DATE_RANGES` here: https://github.com/NYULibraries/ead_indexer/blob/f1bc142dfe1507dbd173bfa126168fa52bba9871/lib/ead_indexer/behaviors/dates.rb#L4-L15, add to array.  If there are no in-range values, then value is an array with a single string "undated & other".',
                indexAsArray : [ FACETABLE ],
            },
            format                                 : {
                basename     : 'format',
                source       : 'If `level` matches /\\Aseries|subseries/)' +
                               ' then use "Archival Series", else "Archival Object"',
                indexAsArray : [ FACETABLE, DISPLAYABLE ],
            },
            parentFromIdAttributeOfImmediateParent : {
                basename     : 'parent',
                source       : 'Parent <c> `id` attribute if it is defined,' +
                               ' omit this Solr field if it is not defined.',
                indexAsArray : [ STORED_SORTABLE ],
            },
            parentsFromIdAttributesOfAllAncestors  : {
                basename     : 'parent',
                source       : '`id` attributes of all ancestor <c> elements' +
                               ' ordered from earliest ancestor to immediate' +
                               ' parent.',
                indexAsArray : [ DISPLAYABLE ],
            },
            repository                             : {
                basename     : 'repository',
                source       : 'Derived from name of parent directory of EAD file',
                indexAsArray : [ DISPLAYABLE, FACETABLE, STORED_SORTABLE ],
            },
            unitdateDisplay                        : {
                basename     : 'unitdate',
                source       : 'If `unitdate` is not empty, use `unitdate` values joined in a comma-delimited list, else if \`unitdate\` is empty: "Inclusive," plus `unitdate_inclusive` if both either `unitdate_inclusive` or `unitdate_bulk` are non-empty, plus ";" and `unitdate_bulk` if non-empty.  NOTE: This is likely a bug in v1 indexer -- see https://jira.nyu.edu/browse/DLFA-211?focusedCommentId=8378822&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-8378822.',
                indexAsArray : [ DISPLAYABLE ],
            },
        },
        xpath     : {
            address   : {
                xpath        : 'address/p',
                indexAsArray : [ SEARCHABLE ],
            },
            appraisal : {
                xpath        : 'appraisal/p',
                indexAsArray : [ SEARCHABLE ],
            },
            bioghist  : {
                xpath        : 'bioghist/p',
                indexAsArray : [ SEARCHABLE ],
            },
            chronlist : {
                xpath        : 'chronlist/chronitem//text()',
                process      : 'Remove all empty string and `nil` elements from the array',
                indexAsArray : [ SEARCHABLE ],
            },
            // This combines the `collection` from both `additional_component_fields()`
            // and `Solrizer.set_field` in `EadIndexer::Component.to_solr()`.
            // The former creates DISPLAYABLE and FACETABLE fields.
            // The latter takes the data from FACETABLE  (`collection_sim`)
            // and adds SEARCHABLE (technically it also overwrites DISPLAYABLE
            // and FACETABLE fields, but with the exact same data).
            collection : {
                xpath        : '//archdesc/did/unittitle',
                indexAsArray : [ FACETABLE, DISPLAYABLE, SEARCHABLE ],
            },
            // This combines the `collection_unitid` from both `additional_component_fields()`
            // and `Solrizer.set_field` in `EadIndexer::Component.to_solr()`.
            // The former creates DISPLAYABLE.
            // The latter takes the data from DISPLAYABLE  (`collection_ssm`)
            // and adds SEARCHABLE (technically it also overwrites DISPLAYABLE,
            // but with the exact same data).
            collection_unitid : {
                xpath        : '//archdesc/did/unitid',
                indexAsArray : [ DISPLAYABLE, SEARCHABLE ],
            },
            corpname          : {
                xpath        : 'corpname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            creator           : {
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
                xpath        : 'archdesc[@level=\'collection\']/did/origination[@label=\'creator\']/*[name() = \'corpname\' or name() = \'famname\' or name() = \'persname\']',
            },
            dao               : {
                xpath        : 'dao/daodesc/p"',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            // From `additional_component_fields()`
            ead                : {
                xpath        : '//eadid',
                indexAsArray : [ STORED_SORTABLE ],
            },
            famname            : {
                xpath        : 'famname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            function           : {
                xpath        : 'function',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            genreform          : {
                xpath        : 'genreform',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            geogname           : {
                xpath        : 'geogname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            heading            : {
                xpath        : 'archdesc[@level=\'collection\']/did/unittitle',
                indexAsArray : [ DISPLAYABLE ],
            },
            language           : {
                xpath        : 'did/langmaterial/language/@langcode',
                process      : 'Translate the first language code into a language name',
                indexAsArray : [ FACETABLE, DISPLAYABLE ],
            },
            level              : {
                xpath        : '/c/@level',
                indexAsArray : [ FACETABLE ],
            },
            material_type      : {
                xpath        : '//genreform',
                process      : 'For each element, replace strings matching /\|\w{1}/' +
                               ' (MARC subfield demarcators) with "--",' +
                               ' remove `nil` values, and remove duplicates.',
                indexAsArray : [ FACETABLE, DISPLAYABLE ],
            },
            name               : {
                xpath        : 'name',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            note               : {
                xpath        : 'note',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            occupation         : {
                xpath        : 'occupation',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            persname           : {
                xpath        : 'persname',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            phystech           : {
                xpath        : 'phystech/p',
                indexAsArray : [ SEARCHABLE ],
            },
            place              : {
                xpath        : '//geogname',
                process      : 'For each element, replace strings matching /\|\w{1}/' +
                               ' (MARC subfield demarcators) with "--",' +
                               ' remove `nil` values, and remove duplicates.',
                indexAsArray : [ DISPLAYABLE, FACETABLE ],
            },
            ref                : {
                xpath        : '/c/@id',
                process      : 'First element only, and only if it exists.  Note' +
                               ' that there is a "ref_" in Terminology but it does' +
                               ' produce a Solr field because it has no :index_as' +
                               ' and in any case would be overwritten by the' +
                               ' `Solrizer.insert_field` call in `SolrEad::Component.to_solr()`',
                indexAsArray : [ STORED_SORTABLE ],
            },
            scopecontent       : {
                xpath        : 'scopecontent/p',
                indexAsArray : [ SEARCHABLE ],
            },
            subject            : {
                xpath        : 'subject',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            subject_facets     : {
                basename     : 'subject',
                xpath        : '//*[local-name()=\'subject\' or local-name()=\'function\' or local-name() = \'occupation\']',
                process      : 'Take the node sets, flatten them into an array,' +
                               ' and remove `nil` values and duplicates.  For ' +
                               ' each element replace strings matching' +
                               ' /\|\w{1}/ (MARC subfield demarcators) with "--".',
                indexAsArray : [ FACETABLE, SEARCHABLE ],
            },
            title              : {
                xpath        : 'title',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            unitdate           : {
                xpath        : 'did/unitdate[not(@type)]',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_bulk      : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'bulk\']',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_end       : {
                xpath        : 'did/unitdate/@normal',
                process      : 'For each element returned, if the value matches /(\\d{4})\\/(\\d{4})/,' +
                               ' take the number on the right of the slash and add to array to be indexed.',
                dataType     : DATA_TYPES.STRING,
                indexAsArray : [ FACETABLE, DISPLAYABLE, SORTABLE ],
            },
            unitdate_inclusive : {
                xpath        : 'archdesc[@level=\'collection\']/did/unitdate[@type=\'inclusive\']',
                indexAsArray : [ SEARCHABLE ],
            },
            unitdate_normal    : {
                xpath        : 'did/unitdate/@normal',
                indexAsArray : [ DISPLAYABLE, SEARCHABLE, FACETABLE ],
            },
            unitdate_start     : {
                xpath        : 'did/unitdate/@normal',
                dataType     : DATA_TYPES.STRING,
                process      : 'For each element returned, if the value matches /(\\d{4})\\/(\\d{4})/,' +
                               ' take the number on the left of the slash and add to array to be indexed.',
                indexAsArray : [ FACETABLE, DISPLAYABLE, SORTABLE ],
            },
            unitid             : {
                xpath        : 'did/unitid',
                indexAsArray : [ SEARCHABLE, DISPLAYABLE ],
            },
            unittitle          : {
                xpath        : 'did/unittitle',
                process      : 'For `unittitle_teim`, no special instructions. ' +
                               ' For `unittitle_ssm`: sanitize ' +
                               ' (see https://jira.nyu.edu/browse/DLFA-209)' +
                               ' and change all EAD tags in the <unittitle> text' +
                               ' which have `render` attributes to the appropriate' +
                               ' HTML tag using this table:' +
                               ' https://github.com/awead/solr_ead/blob/v0.7.5/lib/solr_ead/formatting.rb#L5-L23' +
                               ' and remove the `render` attribute from the tag.',
                indexAsArray : [ DISPLAYABLE, SEARCHABLE ],
            },
        },
    },
};

export {
    DATA_TYPES,
    collectionDocSolrFields,
    componentSolrFields,
};

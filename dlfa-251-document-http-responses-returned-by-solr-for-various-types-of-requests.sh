#!/usr/local/bin/bash

UPDATE_URL='http://localhost:8983/solr/findingaids/update?wt=json&indent=true'

URL+=('http://localhost:8983/')
URL+=('http://localhost:8983/non-existent')
URL+=('http://localhost:8983/solr')
URL+=('http://localhost:8983/solr/')
URL+=('http://localhost:8983/solr/non-existent-core')
URL+=('http://localhost:8983/solr/non-existent-core/')
URL+=('http://localhost:8983/solr/findingaids')
URL+=('http://localhost:8983/solr/findingaids/')
URL+=('http://localhost:8983/solr/findingaids/non-existent-api-endpoint')
URL+=('http://localhost:8983/solr/findingaids/non-existent-api-endpoint/')
URL+=('http://localhost:8983/solr/findingaids/select')
URL+=('http://localhost:8983/solr/findingaids/select?')
URL+=('http://localhost:8983/solr/findingaids/select?non-existent')
URL+=('http://localhost:8983/solr/findingaids/select?q=ead_ssi:mos_2021')
URL+=('http://localhost:8983/solr/findingaids/update')
URL+=('http://localhost:8983/solr/findingaids/update?')
URL+=('http://localhost:8983/solr/findingaids/update?wt=ruby')
URL+=('http://localhost:8983/solr/findingaids/update?wt=json')

function gets() {
    for url in "${URL[@]}"; do
        cmd="curl --include --silent '$url'"
        echo -e "==============\n$cmd\n--------------"
        eval $cmd
        echo -e "==============\n"
    done
}

function postWithEmptyBodies() {
    for url in "${URL[@]}"; do
        cmd="curl --include --silent '$url' -H \"Content-Type: text/xml\" --data-binary ''"
        echo -e "==============\n$cmd\n--------------"
        eval $cmd
        echo -e "==============\n"
    done
}

function adds() {
    UPDATE_URL='http://localhost:8983/solr/findingaids/update?wt=json&indent=true'

    BODY=()
    BODY+=('Invalid XML')
    BODY+=('<xml></xml>')
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>')
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
            </add>')
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
              </doc>
            </add>')
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
                <field></field>
              </doc>
            </add>')
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
                <field name="non-existent"></field>
              </doc>
            </add>')
    # No required `id` field
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
                <field name="subject_sim">SUBJECT_SIM</field>
              </doc>
            </add>')
    # Empty `id` field
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
                <field name="id"></field>
              </doc>
            </add>')
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
                <field name="id">DELETEME</field>
              </doc>
            </add>')
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
                <field name="id">DELETEME</field>
                <field name="subject_sim">SUBJECT_SIM</field>
              </doc>
            </add>')
    for body in "${BODY[@]}"; do
        cmd="curl --include --silent '$UPDATE_URL' -H \"Content-Type: text/xml\" --data-binary '$body'"
        echo -e "==============\n$cmd\n--------------"
        eval $cmd
        echo -e "==============\n"
    done
}

function deletes() {
    BODY=()
    BODY+=('<delete>
            </delete>')
    BODY+=('<delete>
              <id>NON-EXISTENT-ID</id>
            </delete>')
    BODY+=('<delete>
               <non-existent></non-existent>
            </delete>')

    # This causes an HTTP 500 error that seems to mess up subsequent adds, so
    # so we rollback immediately afterward.  A `<commit waitSearcher="false"/>`
    # also seems to prevent errors with subsequent adds, judging from the
    # previous results, but it's unclear whether the commit itself would be
    # saving something undesirable to the index.  It seems likely that rollback
    # is the safer option.
    BODY+=('<delete>
               <query></query>
            </delete>')
    BODY+=('<rollback/>')

    BODY+=('<delete>
               <query>nonexistent:value</query>
            </delete>')

    # Add then delete
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
                <add>
                  <doc>
                    <field name="id">DELETEME</field>
                  </doc>
                </add>')
    BODY+=('<delete>
              <id>DELETEME</id>
            </delete>')

    # Add then delete
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
                <field name="id">DELETEME</field>
              </doc>
            </add>')
    BODY+=('<delete>
              <query>id:DELETEME</query>
            </delete>')

    for body in "${BODY[@]}"; do
        cmd="curl --include --silent '$UPDATE_URL' -H \"Content-Type: text/xml\" --data-binary '$body'"
        echo -e "==============\n$cmd\n--------------"
        eval $cmd
        echo -e "==============\n"
    done
}

function commits() {
    BODY=()
    BODY+=('<commit/>')
    BODY+=('<commit waitSearcher="false"/>')
    BODY+=('<commit waitSearcher="false" expungeDeletes="true"/>')
    BODY+=('<optimize waitSearcher="false"/>')

    # Add then commit
    BODY+=('<?xml version="1.0" encoding="UTF-8"?>
            <add>
              <doc>
                <field name="id">DELETEME</field>
              </doc>
            </add>')
    BODY+=('<commit/>')

    # Delete then commit
    BODY+=('<delete>
              <id>DELETEME</id>
            </delete>')
    BODY+=('<commit/>')

    for body in "${BODY[@]}"; do
        cmd="curl --include --silent '$UPDATE_URL' -H \"Content-Type: text/xml\" --data-binary '$body'"
        echo -e "==============\n$cmd\n--------------"
        eval $cmd
        echo -e "==============\n"
    done
}

gets
postWithEmptyBodies
adds
deletes
commits

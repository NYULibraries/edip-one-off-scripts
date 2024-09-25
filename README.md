# EDIP one-off scripts

## generate-transformation-maps.mjs

Creates the transformations maps for
[DLFA-198: Create EAD \-> v1 indexer HTTP request XML body transformation map](https://jira.nyu.edu/browse/DLFA-198).
Run this script with no arguments to create the files in _transformation-maps/_,
which are then copied to GitHub repo
[dlfa\-198\_v1\-indexer\-ead\-to\-http\-request\-xml\-body\-transformation\-maps](https://github.com/NYULibraries/dlfa-198_v1-indexer-ead-to-http-request-xml-body-transformation-maps).

## get-unique-langcodes-from-ead-files.mjs
Extracts the `langcode` attributes values from the EAD files in a directory and
prints a list of the unique `langcode` values and their counts.
See
[DLFA-224: go\-ead\-indexer package: \`language\`](https://jira.nyu.edu/browse/DLFA-224)
for details on the motivation for the script.

```bash
$ node get-unique-langcodes-from-ead-files.mjs ../findingaids_eads_v2_fabified/
aar: 2
ang: 1
ara: 107
arm: 5
cat: 1
chi: 59
cze: 2
dan: 2
dut: 61
elx: 1
eng: 39871
fin: 1
fre: 83
ger: 55
gle: 1
grc: 2
gre: 3
guj: 1
heb: 3
hrv: 1
hun: 1
ita: 14
jpn: 8
lad: 1
lat: 22
lit: 1
luo: 2
mac: 1
mas: 1
mul: 2
nor: 9
nym: 2
ota: 1
per: 2
pol: 6
por: 1
rum: 1
rus: 6
smi: 1
spa: 31
swa: 298
swe: 6
tur: 1
und: 14
yid: 1
zxx: 1
$
```

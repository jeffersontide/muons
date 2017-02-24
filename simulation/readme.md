# Simulation

## For new ATLAS geometries

1. Run 'go.sh', which will set up everything necessary to run the simulation

2. Enter the desired ATLAS geometry, conditions tag, and number of events.

   * Geometry: [AmdbSimrecFiles](https://twiki.cern.ch/twiki/bin/viewauth/Atlas/AmdbSimrecFiles), [Atlas DD Database](https://atlas.web.cern.ch/Atlas/GROUPS/OPERATIONS/dataBases/DDDB/tag_hierarchy_browser.php)

   * Conditions tag: [CoolProdTags](https://twiki.cern.ch/twiki/bin/viewauth/AtlasComputing/CoolProdTags)

   * The layout with BMGs is ATLAS-R2-2016-01-00-01 and the corresponding conditions tag is OFLCOND-MC16-SDR-16 (from Jochen Meyer)

3. In the folder "geometries", the program will spit out an n-tuple '((ATLAS VERSION))/((ATLAS VERSION))-ntuple.root'. If a file by that name already exists, it will overwrite it.

4. Time for processing!
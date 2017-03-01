# Simulation

## List of stations

* All stations, as far as I know, are contained in the XML file `stations/IdDictMuonSpectrometer_R.03.xml`. Sara wrote a python script (`parseXML.py`) to parse this XML file and output a list of stations, with columns identifying 

   1) their detector type (MDT, CSC, etc.)
   2) their chamber name (BIL, BMG, etc.)
   3) their eta coordinate (+/- integer)
   4) their phi coordinate (+ integer)

   This is stored in the text file `stations/stations.txt`, which is accessed by `coordinates.cpp` later. The script is also set to remove any duplicate rows.


## Generate eta-phi coordinates for new ATLAS geometries

### Set up & run the particle gun

1. Run `go.sh`, which will set up and run the simulation

2. When prompted, enter the desired ATLAS geometry, conditions tag, and number of events.

   * Geometry: [AmdbSimrecFiles](https://twiki.cern.ch/twiki/bin/viewauth/Atlas/AmdbSimrecFiles), [Atlas DD Database](https://atlas.web.cern.ch/Atlas/GROUPS/OPERATIONS/dataBases/DDDB/tag_hierarchy_browser.php)

   * Conditions tag: [CoolProdTags](https://twiki.cern.ch/twiki/bin/viewauth/AtlasComputing/CoolProdTags)

   * 2017-02-23: The layout with BMGs is ATLAS-R2-2016-01-00-01 and the corresponding conditions tag is OFLCOND-MC16-SDR-16 (from Jochen Meyer)

3. In the folder "geometries", the program will spit out an n-tuple '((ATLAS_GEOMETRY))/((ATLAS_GEOMETRY))-ntuple.root'. If a file by that name already exists, it will overwrite it.

### Read out hits from the n-tuple into a geometry file

1. The script `go.sh` runs `coordinates.cpp` as a root 6 macro, with the ATLAS geometry string (e.g., "ATLAS-R2-2015-03-01-00") as its only argument.

2. `coordinates.cpp` reads through the n-tuple in `geometries/((ATLAS_GEOMETRY))` and dumps out four text files in that folder:

   1) csccoords.txt
   2) mdtcoords.txt
   3) rpccoords.txt
   4) tgccoords.txt

   Each text file has lines like:
   
   > CSCCSL1A08 2.09283 -0.826093 2.09293 -0.826090

   These represent the bounding box of the `CSCCSL1A08` station; the numbers are the minimum eta value, minimum phi value, maximum eta value, and maximum phi value respectively.

   These are the text files directly accessed by the website when a geometry is selected.

























# set up the atlas environment, if necessary
if [ -z "$AtlasVersion" ]; then
    asetup 20.7.6.4,here
else
    echo
    echo "Using AtlasVersion=${AtlasVersion}"
    echo
fi

# get the package, if necessary
if [ ! -d "MuonSpectrometer" ]; then
    # pkgco.py MuonSpectrometer/MuonValidation/MuonPRDTest-01-01-04
    scp -r ${USER}@lxplus.cern.ch:/afs/cern.ch/user/j/jomeyer/workarea/public/forDQcrew/MuonSpectrometer/ ./MuonSpectrometer/

    setupWorkArea.py

    cd WorkArea/cmt
    cmt bro cmt config
    cmt bro cmt make
    cd $TestArea
else
    echo 
    echo "Already checked out MuonPRDTest. Wont re-compile."
    echo 
fi

# get the file, if necessary

if [ ! -f "jobOptions.py" ]; then
    scp -r ${USER}@lxplus.cern.ch:/afs/cern.ch/user/j/jomeyer/workarea/public/forDQcrew/sim.n.dump.jobOptions.py ./jobOptions.py
fi

# set geometry options
echo
read -p "Geometry (default 'ATLAS-R2-2016-01-00-01'): " geometry
geometry=${geometry:-"ATLAS-R2-2016-01-00-01"}
echo "${geometry}"
echo
read -p "Conditions tag (default 'OFLCOND-MC16-SDR-16'): " tag
tag=${tag:-"OFLCOND-MC16-SDR-16"}
echo "${tag}"
echo

# set geometry in jobOptions.py, which is a terrible way to do this
sed "s|detectorGeometry[[:space:]]=.*|detectorGeometry = \"${geometry}\"|g" jobOptions.py > jobOptions2.py
sed "s|detectorConditions[[:space:]]=.*|detectorConditions = \"${tag}\"|g" jobOptions.py > jobOptions2.py

# set up directory for files with this geometry
mkdir -p geometries/${geometry}

# get/set number of events/particles
read -p "Number of events (default 1000): " numEvents
numEvents=${numEvents:-1000}
echo

sed "s|athenaCommonFlags\.EvtMax.*|athenaCommonFlags.EvtMax = ${numEvents}|g" jobOptions.py > jobOptions2.py & mv jobOptions2.py jobOptions.py

# run the code
now=$(date +%Y-%m-%d-%Hh%Mm%Ss)
athena.py sim.n.dump.jobOptions.py 2>&1 | tee log_${now}.txt

# fuck athena
rm -f AtDSFMTGenSvc.out PoolFileCatalog.xml PoolFileCatalog.xml.BAK SimParams.db eventLoopHeartBeat.txt hits.pool.root

# process ntuple into coord text files
root "coordinates.cpp(\"${geometry}\")"
rm -f coordinates_*
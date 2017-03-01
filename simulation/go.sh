# rm previous logs
rm -f log_*

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

#if [ ! -f "jobOptions.py" ]; then
#    scp -r ${USER}@lxplus.cern.ch:/afs/cern.ch/user/j/jomeyer/workarea/public/forDQcrew/sim.n.dump.jobOptions.py jobOptions.py
#fi

#scp -r ${USER}@lxplus.cern.ch:/afs/cern.ch/user/l/laniu/public/jobOptions.py jobOptions.py

# get options
#geometry="ATLAS-R2-2015-03-01-00"
#tag="OFLCOND-RUN12-SDR-22"
#numEvents=1000

echo
read -p "Geometry (default 'ATLAS-R2-2015-03-01-00'): " geometry
geometry=${geometry:-"ATLAS-R2-2015-03-01-00"}
echo "${geometry}"
echo
read -p "Conditions tag (default 'OFLCOND-RUN12-SDR-22'): " tag
tag=${tag:-"OFLCOND-RUN12-SDR-22"}
echo "${tag}"
echo
read -p "Number of events (default 1000): " numEvents
numEvents=${numEvents:-1000}
echo "${numEvents}"
echo

# set options in jobOptions.py
sed "s/^detectorGeometry.*/detectorGeometry = \"${geometry}\"/g" jobOptions.py > jobOptions2.py
mv jobOptions2.py jobOptions.py

sed "s/^detectorTag.*/detectorTag = \"${tag}\"/g" jobOptions.py > jobOptions2.py
mv jobOptions2.py jobOptions.py

sed "s/^numEvents.*/numEvents = ${numEvents}/g" jobOptions.py > jobOptions2.py
mv jobOptions2.py jobOptions.py

# set up directory for files with this geometry
mkdir -p geometries/${geometry}

# run the code
now=$(date +%Y-%m-%d-%Hh%Mm%Ss)
athena.py jobOptions.py 2>&1 | tee log_${now}.txt

# fuck athena
rm -f AtDSFMTGenSvc.out PoolFileCatalog.xml PoolFileCatalog.xml.BAK SimParams.db eventLoopHeartBeat.txt hits.pool.root

# process ntuple into coord text files
# root "coordinates.cpp(\"${geometry}\")"
# .q
# rm -f coordinates_*
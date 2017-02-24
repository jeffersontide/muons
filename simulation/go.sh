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

# set options
echo
read -p "Geometry (default 'ATLAS-R2-2016-01-00-01'): " geometry
geometry=${geometry:-"ATLAS-R2-2016-01-00-01"}
echo

read -p "Tag (default 'OFLCOND-MC16-SDR-16'): " tag
tag=${tag:-"OFLCOND-MC16-SDR-16"}
echo

read -p "Number of events (default 1000): " numEvents
numEvents=${numEvents:-1000}
echo

# set geometry in jobOptions.py
sed -i "" "s|jobproperties\.Global\.DetDescrVersion.*|jobproperties.Global.DetDescrVersion = \"${geometry}\"|g" jobOptions.py
sed -i "" "s|SimFlags\.SimLayout[^.].*|SimFlags.SimLayout = \"${geometry}_VALIDATION\"|g" jobOptions.py
sed -i "" "s|jobproperties\.Global\.ConditionsTag.*|jobproperties.Global.ConditionsTag = \"${tag}\"|g" jobOptions.py

## set number of events in jobOptions.py
sed -i "" "s|athenaCommonFlags\.EvtMax.*|athenaCommonFlags.EvtMax = ${numEvents}|g" jobOptions.py

# run the code
now=$(date +%Y-%m-%d-%Hh%Mm%Ss)
athena.py sim.n.dump.jobOptions.py 2>&1 | tee log_${now}.txt

# fuck athena
rm -f AtDSFMTGenSvc.out PoolFileCatalog.xml PoolFileCatalog.xml.BAK SimParams.db eventLoopHeartBeat.txt hits.pool.root






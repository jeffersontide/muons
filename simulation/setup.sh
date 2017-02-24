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
# make sure everything is set up
if [ -z "$AtlasVersion" ] \
   || [ ! -d "MuonSpectrometer" ] \
   || [ ! -f "sim.n.dump.jobOptions.py" ];
then
   echo
   echo "run setup.sh first"
   echo

   exit 1
fi

# run the code
now=$(date +%Y-%m-%d-%Hh%Mm%Ss)
athena.py sim.n.dump.jobOptions.py 2>&1 | tee log_${now}.txt

# fuck athena
rm -f AtDSFMTGenSvc.out PoolFileCatalog.xml PoolFileCatalog.xml.BAK SimParams.db eventLoopHeartBeat.txt hits.pool.root

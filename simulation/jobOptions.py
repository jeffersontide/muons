detectorGeometry = "ATLAS-R2-2015-03-01-00"
detectorTag = "OFLCOND-RUN12-SDR-22"

#--- Algorithm sequence ---------------------------------------
from AthenaCommon.AlgSequence import AlgSequence
topSeq = AlgSequence()

#--- Detector flags -------------------------------------------
from AthenaCommon.DetFlags import DetFlags
# - Select detectors 
DetFlags.ID_setOff()
DetFlags.Calo_setOff()
DetFlags.Muon_setOn()
DetFlags.Truth_setOn()

#--- AthenaCommon flags ---------------------------------------
from AthenaCommon.AthenaCommonFlags import athenaCommonFlags
athenaCommonFlags.PoolEvgenInput.set_Off()
athenaCommonFlags.PoolHitsOutput='hits.pool.root'
athenaCommonFlags.EvtMax=200
athenaCommonFlags.SkipEvents=0

from AthenaCommon.JobProperties import jobproperties
jobproperties.Global.ConditionsTag = detectorTag
jobproperties.Global.DetDescrVersion = detectorGeometry

#--- Simulation flags -----------------------------------------
from G4AtlasApps.SimFlags import SimFlags
SimFlags.load_atlas_flags()
SimFlags.SimLayout.set_On()
SimFlags.RandomSvc = 'AtDSFMTGenSvc'
#--- default(?) run2 layout
SimFlags.SimLayout=detectorGeometry + "_VALIDATION"
#'ATLAS-R2-2015-03-01-00_VALIDATION' # specific value
SimFlags.RunNumber=222500
SimFlags.ReleaseGeoModel=False

#--- ParticleGun ----------------------------------------------
import ParticleGun as PG
pg = PG.ParticleGun(randomSvcName=SimFlags.RandomSvc.get_Value(), randomStream="SINGLE")

# phi=[-PG.PI, PG.PI])
# pg.samplers[0].pid = (-13, 13)
pg.samplers[0].pid = 999
pg.samplers[0].mom = PG.PtEtaMPhiSampler(pt=75000, eta=[-3.,3.], phi=[-PG.PI, PG.PI])

topSeq += pg

#---  Output printout level ----------------------------------- 
#output threshold (2=DEBUG, 3=INFO, 4=WARNING, 5=ERROR, 6=FATAL)
MessageSvc = Service( "MessageSvc" )
MessageSvc.OutputLevel = 3

#==============================================================
# Job configuration
# ***>> Do not add flags or simulation options below this line
#==============================================================
from G4AtlasApps import SimKernel

#-----------------------------------------------------------------------------
# Algorithms
#-----------------------------------------------------------------------------
from MuonPRDTest.MuonPRDTestConf import *

topSeq+=NSWPRDValAlg('NSWPRDValAlg', OutputLevel = WARNING)
NSWPRDValAlg.OutputLevel = INFO
NSWPRDValAlg.doMDTHit = True
NSWPRDValAlg.doRPCHit = True
NSWPRDValAlg.doTGCHit = True
NSWPRDValAlg.doCSCHit = True


#-----------------------------------------------------------------------------
# save ROOT histograms and Tuple
#-----------------------------------------------------------------------------
from GaudiSvc.GaudiSvcConf import THistSvc
ServiceMgr += THistSvc()
ServiceMgr.THistSvc.Output = [ "NSWPRDValAlg DATAFILE='myNtuple.root' OPT='RECREATE'" ]


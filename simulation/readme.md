# Simulation

## For new ATLAS geometries

1. Run 'go.sh', which will set up everything necessary to run the simulation

2. In the file 'sim.n.dump.jobOptions.py', there is a line that looks like:
   
   > athenaCommonFlags.EvtMax=1000000

   This specifies the number of particles to fire in the simulation. Something between 10^5 and 10^6 should be fine.
   
   The line
   
   > jobproperties.Global.DetDescrVersion = "ATLAS-R2-2015-03-01-00"
   
   specifies the geometry to use in the simulation. You must trek up a mountain to ask the ATLAS wizards to figure out which one to use.

3. Run 'run.sh', which will run the simulation and dump out an n-tuple called '((ATLAS VERSION))-ntuple.root'.

4. Time for processing!
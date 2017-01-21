0) Welcome to the rough draft of the MS display webpage (muons.web.cern.ch)! In this directory you will find the source code which details how I put together the rough draft, from start to finish. In each directory 

1.parsing_ms_xml
2.Ntuple_to_hist
3.hist_to_coords

there is a README file which explains the purpose of each of the blocks of code. Below I explain an overall summary of what I did, and the website's current functionality.

The feedback.txt file is a file of ideas collected by Alex Tuna when he showed the site to people at CERN, on how to improve the webpage. At the bottom of the file, I wrote a few comments on this feedback.

1) Ran Jochen Meyer's DQ ParticleGun code with ATLAS 20.7.6.4 on lxplus. Fired 120,000 Geantinos (virtual particles for simulation which do not interact with materials and undertake transportation processes only) straight through the 3/2015 simulated ATLAS detector, generated a .root ntuple with the hit positions (local/global), identifiers (sim/offline) and more.

(show example histogram vs. approximated detector element screenshot)
2)For each simulation stationname, generated an eta-phi plot of all corresponding ntuple hits. This is a fairly good approximation of the location of each detector element in the muon spectrometer (over 10,000 in total). Approximated  the contents of each plot as a rectangle (was conservative in this approximation) and converted eta phi coordinates to pixels.

3)read in all the elements and their stationnames with Javascript/jQuery, color coded them by/within their chambers, and animated them with jQuery eventhandlers so the user can choose which chamber(s) (s)he'd like to see and and mouse over those detector elements. User can also choose to view MDT offline and online stationname conventions. Users can also superimpose their own plots onto the canvas to review areas where they suspect a malfunctioning detector element and search for individual detector elements to view on the grid.




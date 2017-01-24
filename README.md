# Muon Spectrometer Detector Elements website

## Notes

1. launch server: python3 -m http.server

2. OSX 10.10.5 / Chrome Version 55.0.2883.95 (64-bit)

3. personal repo: https://github.com/jeffersontide/muons

4. @cern: cern.ch/laniu --> https://laniu.web.cern.ch/laniu/

5. naming conventions:
> [TGC](http://atlas-proj-tgc.web.cern.ch/atlas-proj-tgc/doc/numbering.pdf)
> RPC
> CSC
> [MDT](https://twiki.cern.ch/twiki/bin/viewauth/Atlas/DifferencesInMDTOnlineAndOffline)


## Log

### M 2017-01-23

#### TODO
3. Figure out MDT translation
4. Implement CSC translation
7. friendly helpful instructions
9. persint

#### Done
1. Fixed PDF/image upload nonsense, added canvas layering
2. Fixed jump when scaling axes
3. Online/offline toggle, but doesn't do anything yet
4. "load all"
5. Search by wildcard (incl. exact results) or regexp
6. put on cern @ cern.ch/laniu

#### Uploading to cern.ch
laniu.web.cern.ch/laniu
laniu@lxplus.cern.ch ~/www


### U 2017-01-22

#### oh no
1. Some weird pixel jump going on that messes up the tick mark spacing when the ticks are scrunched together

#### Done
1. Plot hover --> crosshair
2. Set point fixed
3. Scale axes fixed
4. Plot manipulation buttons highlighted when active
5. Fixed selection problems, more or less
6. Making canvas resizeable is a pain, esp for Chrome so leave that aside for now

#### TODO
1. "load all" button
2. Error message if locate element fails
3. Locate element with regexp
4. friendly helpful instructions
5. Page w/ naming convention explanation & search suggestions
6. label 'eta' & 'phi'


### F 2017-01-20

#### Added
1. identify box w/ border when hovering over it in list
2. double-click on held station ID to remove from list
3. plot manipulation
4. image auto-resize to fit canvas
5. added pdf stuff, which is not understood whatsoever
6. pdf.js, thank you whoever wrote it

#### TODO
1. deselect thing in the hold text list
2. disable selection when manipulating plot
3. set origin for plot so axes will be out of the way
4. any loaded pdf's might remain sitting around taking up space, check this
5. click is sticking when manipulating plot while hovering over boxes


### W 2017-01-18

#### TODO
1. plot margins etc.
2. image click-drag / rescale
3. pdf reader

#### check
1. may need to flip y axis during coordinate-pixel transformation
2. how to align background images


### T 2017-01-17

#### TODO

> * Could clicking on the plot freeze the highlighted detector elements, until the next click (or off-plot click)? Like, ideally, the user could do:
>     * Hover over a given eta,phi location to see the relevant detector elements
>     * Click to freeze
>     * Copy the list of relevant detector elements with the cursor for using elsewhere
> * Could there be an additional user text box for querying a specific eta,phi, instead of using the cursor? Like if the user is told there is a problem at eta=X.XXX and phi=Y.YYY, they could enter this directly instead of getting this approximately correct with the cursor.

#### Done
1. Moved all CSS/javascript to separate files, got rid of jquery
2. Need relative pixel translation of eta-phi


### Previously

#### Sara's notes

(original repo @ https://github.com/sarafs1926/muons)

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
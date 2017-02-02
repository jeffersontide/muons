# Muon Spectrometer Detector Elements website

## Notes

1. launch server: python3 -m http.server

2. OSX 10.10.5 / Chrome Version 55.0.2883.95 (64-bit)

3. personal repo: https://github.com/jeffersontide/muons

4. @cern: cern.ch/laniu --> https://laniu.web.cern.ch/laniu/

## Acknowledgments
. PDF.js
. Persint people
. AT & SS

---

## Log

### W 2017-02-01

#### done
. rpc lives again
. less stupid layout
. include eta/phi coords when holding
. better instructions + contact info

#### TODO
. online search
. csv to copy names
. capitalize detector names
. drop down geometry menu


### T 2017-01-31
- no more major features, but eventually:
   . resizeable canvas
   . manipulable image

#### oh no
. some boxes are sticky (in the plot and hold list) when confused by mouse events
. ??? csc names are already in online convention
. some of the mdt boxes as given (online at least) have zero-area boxes
. cannot "locate element by ID" with online convention names
. fuck, rpc is still broken and i forgot

#### TODO
. something css to indicate how plot settings work
. what are the boxes actually called -- can i call them stations
. label your axes, etc.
. remove all your swearing at console.log

#### done
. fixed coordinate problem for axes not set at (0, 0)
. offline --> online translation should work now, except for the caveats above


### M 2017-01-23

#### TODO
1. color map
2. Figure out MDT translation
3. Implement CSC translation
4. friendly helpful instructions
5. persint

#### Done
1. Fixed PDF/image upload nonsense, added canvas layering
2. Fixed jump when scaling axes
3. Online/offline toggle, but doesn't do anything yet
4. "load all"
5. Search by wildcard (incl. exact results) or regexp
6. put on cern @ cern.ch/laniu
7. Removed hold list duplicates

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

---

## Previously

### Feedback

#### Cosmetic feedback

* The TGC button is bigger than the others? Can they all be the same size?

* Suggest an ordering of MDT, CSC, RPC, TGC

* Could the element names be more human-oriented (e.g. CSC CSS1A06) instead of computer-oriented (cscCSS1A06)?

* Could the detector buttons indicate explicitly if they are clicked/unclicked? Like with a check box, [ ] vs [x]? (I sent the site to a few people without instructions, and nobody knew where to start.)

* Could a "Loading..." text box appear during computationally-expensive steps, when the user waits for 2-3 seconds for the page to load?

* In case the user enters an element name which Locate Element cant locate, could an error message appear, that says something like "Detector element not found!"

* When hovering over the plot, could a text box appear off-plot which shows the eta,phi of the cursor location?

* When hovering over the plot, could the cursor be replaced with crosshairs? 

* The yellow of MDToffl is tough to read.


#### Functional feedback

* The locate element feature is difficult to use, since it requires knowing exactly the name of the detector element, and there are thousands of detector elements to remember. There were two suggestions on how to make this more user friendly -- we could do either, or BOTH!

1. Allow for case-insensitive pattern matching with wildcards. For example, instead of typing cscCSS1A06, the user could write *CSC*A06*, in case they dont remember if the chamber is S or L.
2. Have drop-down menus, so that the user doesnt need to type anything. For example:

[ MDT ]
CSC
RPC
TGC

... user chooses CSC, for example ...

[ cscCSL1A01 ]
cscCSL1A03
cscCSL1A05
cscCSL1A07
etc

* Could the Locate Element feature allow for multiple locates simultaneously, using wildcards? Like, if the user entered *CSL*, all the CSL chambers would be highlighted?

* Could clicking on the plot freeze the highlighted detector elements, until the next click (or off-plot click)? Like, ideally, the user could do:
* Hover over a given eta,phi location to see the relevant detector elements 
* Click to freeze
* Copy the list of relevant detector elements with the cursor for using elsewhere

* Could there be an additional user text box for querying a specific eta,phi, instead of using the cursor? Like if the user is told there is a problem at eta=X.XXX and phi=Y.YYY, they could enter this directly instead of getting this approximately correct with the cursor.

* (This is probably a longer term goal) Every beta tester was a big fan of inserting a user image and overlaying the detector elements on top of this. But only the DQ experts (Alex, Karri) thought it was reasonable to assume fixed dimensions mimicking the typical DQ plots we look at. It would be extremely nice if the user could insert any 2D plot of eta,phi, have something resized (either their plot, or the backend detector elements), and then go from there. But okay, this doesnt sound trivial.

* Instead of having two separate buttons for MDT offline and MDT online, could the output column just have both? Maybe something like:
mdtBOL2A03 (offline: mdtBOL2A02)
mdtBML2A03 (offline: mdtBML2A02)
mdtBIL2A03 (offline: mdtBIL2A02)

* How to specify online vs. offline convention in Locate Element? Maybe there could be a [ online | offline ] drop down menu?

* It would be really useful to include a link to the algorithm(s) we have for converting the offline names to online names. Jochen had lots of questions about how we do stuff (e.g. the BME chambers), for example, and if we could just point him to the conversion decision tree (e.g., if MDT EIL, mulitply phi sector by 2 and subtract 1 to get online phi sector), we could save a lot of discussion time.

#### Content suggestions

* The TGC people basically only use the online naming convention, unfortunately. There is some description of the offline numbering here (http://atlas-proj-tgc.web.cern.ch/atlas-proj-tgc/doc/numbering.pdf), but I think we might need to sit down with a TGC person and figure out exactly how to translate from online to offline.

* One of the TGC experts had doubts about some of the boundaries. I guess we could cross-check these just by going to the ROOT file of histograms produced after the particle gun.

* It looks like MDTonl and MDToffl are identical! A bug?

#### Sara's comments:

Here are what seem to me like the nontrivial fixes:

Functional:
* Resizing dimensions of the grid upon loading a new plot (I mentioned this was one of my priorities to you earlier in the summer, would be much more elegant. But didn't get to do it yet. I know how I would solve this, though.)

*Smarter 'locate element' feature. I basically implemented this feature quickly without giving it flexibility, just the bare bones.

My other comments:
MDTonl and MDToffl did end up being identical except for maybe one or two elements. Simply because the particle gun did not register hits from most of the 'translatable' elements, for whatever reason.    

---

## Sara's notes

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
































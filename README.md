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
> MDT


## Log

### M 2017-01-23

#### TODO
2. host @ cern
3. Figure out MDT translation
4. Implement CSC translation
5. Online/offline toggle
6. regex searching
7. friendly helpful instructions
8. "load all"
9. persint

#### Done
1. Fixed PDF/image upload nonsense, added canvas layering
2. Fixed jump when scaling axes

#### Uploading to cern.ch
laniu.web.cern.ch/laniu
ssh laniu@lxplus.cern.ch ~/www



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
6. implement:
> Have drop-down menus, so that the user doesnt need to type anything. For example:
> 
> [ MDT ]
> CSC
> RPC
> TGC
> 
> ... user chooses CSC, for example ...
> 
> [ cscCSL1A01 ]
> cscCSL1A03
> cscCSL1A05
> cscCSL1A07
> etc
7. Implement:
> Could the Locate Element feature allow for multiple locates simultaneously, using wildcards? Like, if the user entered *CSL*, all the CSL chambers would be highlighted?
8. label 'eta' & 'phi'


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
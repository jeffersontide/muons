launch server:
python3 -m http.server

T 2017-01-17
============

*  Cloned Sara's repository to local

* Work on features:

> * Could clicking on the plot freeze the highlighted detector elements, until the next click (or off-plot click)? Like, ideally, the user could do:
>     * Hover over a given eta,phi location to see the relevant detector elements
>     * Click to freeze
>     * Copy the list of relevant detector elements with the cursor for using elsewhere
> * Could there be an additional user text box for querying a specific eta,phi, instead of using the cursor? Like if the user is told there is a problem at eta=X.XXX and phi=Y.YYY, they could enter this directly instead of getting this approximately correct with the cursor.

* Moved all CSS/javascript to separate files, got rid of jquery
* Need relative pixel translation of eta-phi

W 2017-01-18
==============

TODO
----
6. plot margins etc.
8. image click-drag / rescale
9. pdf reader

check
-----
1. may need to flip y axis during coordinate-pixel transformation
2. how to align background images


F 2017-01-20
============

Added:
- identify box w/ border when hovering over it in list
- double-click on held station ID to remove from list

Todo:
- crappy deselect thing in the hold text list
- enable the plot manipulation to stay on until clicking outside the map
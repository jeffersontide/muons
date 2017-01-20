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

W 2017-01-2017
==============

TODO
----
4. re-implement color scheme
5. display info for selected (held) stations, or hovered-over in hold list (http://stackoverflow.com/questions/13262653/hovering-over-an-option-in-a-select-list)
6. plot margins etc.
7. use less dumb naming
8. image click-drag / rescale
9. pdf reader

check
-----
1. may need to flip y axis during coordinate-pixel transformation
2. how to align background images
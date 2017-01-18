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

TODO
----
1. eventually deal with cursor misalignment
2. clicking on map should also leave a dot/label where the clicked point is
3. same should happen (as in 2) when a specific eta-phi coordinate is given
4. make real plots...including vertical/horizontal guide bars
5. "show all locations of xx detector type"
6. ??? how to superimpose plot images, e.g. select matching corners
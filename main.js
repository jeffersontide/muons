// main.js

// Any functions to run right after the page loads
function init() {
   // Set form callbacks
   document.getElementById("clr").onclick = clearDetectors;
   document.getElementById("locate").onclick = locateElement;
   document.getElementById("clearPlotImage").onclick = clearPlotImage;
   document.getElementById("imgInput").onchange = loadPlotImage;
   document.getElementById("clearHold").onclick = unholdStations;
   document.getElementById("locateCoord").onclick = locateElementsByCoord;

   document.getElementById("holdStations").onkeydown = copyWatch;
   document.getElementById("selectAll").onclick = selectAll;
   document.getElementById("selectNone").onclick = selectNone;
   document.getElementById("selectRemove").onclick = selectRemove;

   // Detector structure, adds detector buttons by default
   window.detectors = new Detectors();

   // Mouse tracking in the plot window
   window.mouse = {
      'track' : false,
      'pixelx' : 0,
      'pixely' : 0,
      'x' : 0,
      'y' : 0,
      'parent' : document.getElementById("map")
   };

   window.mouse.parent.onmousemove = mousemoveCallback;
   window.mouse.parent.onclick = clickCallback;
   window.mouse.parent.onmouseout = mouseoutCallback;

   // Set up canvas plot
   window.etaAxis = new Axis('eta', -2.6, 2.6, 0.5, 'abs', '#000000', 'linear');
   window.phiAxis = new Axis('phi', -3.2, 3.2, 0.5, 'abs', '#000000', 'linear');
   window.plot = new Plot("plotCanvas", "coordCanvas",
                          [window.etaAxis, window.phiAxis], "", true);

   // Held stations, terrible
   window.holdList = [];
}

// Set a background image for the plot
function loadPlotImage() {
   // If no image was uploaded (the dialog was cancelled), don't do anything
   if (!this.value) { return; }

   // Create a filereader object
   var reader = new FileReader();

   // Set the filereader to update the background image in the plot (image)
   // element as a dataURL
   reader.onload = function(e) {
      document.getElementById("foo").style.background = "url("
         + e.target.result + ")";
   }

   reader.readAsDataURL(this.files[0]);
}

// Clear background image for the plot
function clearPlotImage() {
   document.getElementById("foo").style.background = "";

   // Reset file prompt dialog
   document.getElementById("imgInput").value = "";
}

// Toggle a detector button
function toggleDetector() {
   // Get detector handle ('this' refers to the button DOM object)
   var detector = this.detector;

   // Toggle detector selection
   detector.selected = detector.selected ? false : true;

   // Toggle border width
   this.style.borderWidth = detector.selected ? "4px" : "1px";
   this.style.margin = detector.selected ? "2px" : "5px";

   // Load data if necessary
   if (detector.selected && !detector.loaded) {
      loadDetectorData(this.id);
   }

   // Disable holds on hold list
   // ...

   updateDetectors();
}

// Deselect all detector types
function clearDetectors() {
   // Deselects all detectors
   var buttons = document.getElementsByClassName("detectorButton");

   for (var i = 0; i < buttons.length; i++) {
      var button = buttons.item(i);

      if (button.detector.selected) {
         button.click();
      }
   }
}

// Locate stations
function locateElement() {
   var elementID = document.getElementById("detectorID").value;

   // If the box is empty, return
   if (!elementID) {
      return;
   }

   // Loop through all selected detectors
   var detectorList = Object.keys(window.detectors);
   for (var i = 0; i < detectorList.length; i++) {
      var detector = window.detectors[detectorList[i]];

      if (!detector.selected) { continue; }

      // ugh
      if (detector.stations[elementID]) {
         detector.stations[elementID].hold = true;
         window.holdList.push(detector.stations[elementID]);
      }
   }

   // Print an error message if none found
   // ...

   updateDetectors();
}

function locateElementsByCoord() {
   x = parseFloat(document.getElementById("etaCoord").value);
   y = parseFloat(document.getElementById("phiCoord").value);

   holdStations(x, y);

   updateDetectors();
}

// Some of these shouldn't be global
function loadDetectorData(detectorID) {
   var xhr = new XMLHttpRequest();

   var detector = window.detectors[detectorID];

   xhr.open("GET", detector.path, true);

   xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         // Split the text file into strings, one for each station
         var coords = this.responseText.split("\n");
         coords = coords.filter(Boolean);

         // Iterate through each station string
         coords.forEach(
            function(coord) {
               var coordArray = coord.split(" ").filter(Boolean);

               // Dump the station information into the data structure
               detector.addStation(
                  coordArray[0],                   // station ID
                  [                                // eta-phi coordinates
                     parseFloat(coordArray[1]),
                     parseFloat(coordArray[2]),
                     parseFloat(coordArray[3]),
                     parseFloat(coordArray[4])
                  ]
               );
            }
         );
      }
   }

   xhr.send();

   detector.loaded = true;
}

function updateDetectors() {
   // Clear plot
   var plotCanvas = document.getElementById("plotCanvas");
   var plotContext = plotCanvas.getContext('2d');
   plotContext.clearRect(0, 0, plotCanvas.width, plotCanvas.height);

   // Deal with hover stations
   var hoverStationList = [];
   var hoverElement = document.getElementById("hoverStations");

   // Clear list
   while (hoverElement.firstChild) {
      hoverElement.removeChild(hoverElement.firstChild);
   }

   // Get stations from current mouse position
   if (window.mouse.track) {
      hoverStationList = findStations(window.mouse.x, window.mouse.y, 'hover');
   }

   for (var i = 0; i < hoverStationList.length; i++) {
      // Plot hover stations
      hoverStationList[i].draw(window.plot);

      // Display hover stations in list
      var element = document.createElement('option');
      element.text = hoverStationList[i].id;
      hoverElement.appendChild(element);
   }

   // Deal with hold stations
   var holdStationList = findStations(0, 0, 'hold');
   var holdElement = document.getElementById("holdStations");

   // Clear list
   while (holdElement.firstChild) {
      holdElement.removeChild(holdElement.firstChild);
   }

   for (var i = 0; i < holdStationList.length; i++) {
      // Plot hold stations
      holdStationList[i].draw(window.plot);

      // Display hold stations
      var element = document.createElement('option');
      element.text = holdStationList[i].id;
      element.onmouseover = identifyStation;
      holdElement.appendChild(element);
   }
}

function findStations(x, y, options) {
   var hover = true;
   var hold = true;

   switch (options) {
      case 'hover':
         hold = false;
         break;
      case 'hold':
         hover = false;
         break;
   }

   var stationList = [];

   // Iterate through all detectors & stations. Return station rectangles if
   // they are held OR the coordinates work out
   var detector_types = Object.keys(window.detectors);
   for (var i = 0; i < detector_types.length; i++) {
      var detector = window.detectors[detector_types[i]];

      if (detector.selected) {
         var station_list = Object.keys(detector.stations);
         for (var j = 0; j < station_list.length; j++) {
            var station = detector.stations[station_list[j]];

            var hoverBool = (
                x >= station.coords[0] &&
                y <= station.coords[1] &&
                x <= station.coords[2] &&
                y >= station.coords[3]
            );

            if ((hold && station.hold) || (hover && hoverBool)) {
               // push the station onto the list
               stationList.push(station);
            }
         }
      }
   }

   return stationList;
}

// Put a big box around the station if hovered over in the hold list
function identifyStation() {
   // Find the id in window.holdList; the corresponding object should represent
   // the whole station

   for (var i = 0; i < window.holdList.length; i++) {
      if (window.holdList[i].id == this.text) {
         var station = window.holdList[i];
         station.identify(window.plot);
         return;
      }
   }

   // If you're still here then crap
   console.log('well crap')
}

function holdStations(x, y) {
   var stations = findStations(x, y, 'hover');

   for (var i = 0; i < stations.length; i++) {
      stations[i].hold = true;
      window.holdList.push(stations[i]);
   }
}

function unholdStations() {
   for (var i = 0; i < window.holdList.length; i++) {
      window.holdList[i].hold = false;
   }

   window.holdList = [];

   updateDetectors();
}

// ==============
// Select stations
// ==============

function selectAll() {
   var elem = document.getElementById("holdStations");

   // Iterate through all the options, selecting them
   for (var i = 0; i < elem.children.length; i++) {
      elem.children[i].selected = true;
   }

   elem.focus();
}

function selectNone() {
   var elem = document.getElementById("holdStations");

   // Iterate through all the options, selecting them
   for (var i = 0; i < elem.children.length; i++) {
      elem.children[i].selected = false;
   }
}

function selectRemove() {
   // Get the station ID's selected
   // ...

   // Find each station object
   // ...

   // set station.hold = false
   // ...

   // Remove station from window.holdList
   // ...

   updateDetectors();
}

// stolen from http://stackoverflow.com/questions/17394908/copy-selected-items-text-from-select-control-html
//to be run on keydown, which occurs before clipboard copy
function copyWatch(e) {
   e = e || event; // internet explorer

   // For anything to happen, ctrl-c must be sent and something must be
   // selected from the list. Otherwise, return.
   // if ((!(e.ctrlKey && e.keyCode == '67')) || (this.selectedIndex < 0)) {
   // if (!(e.ctrlKey) || this.selectedIndex < 0) {
   //    console.log('goodbye');
   //    return;
   // }

   // Create selectable text
   var copyEl = document.createElement('textarea');

   var selected = [];
   var selectedText = '';

   for (var i = 0; i < this.options.length; i++) {
      if (this.options[i].selected) {
         selected.push(i);
         selectedText += this.options[i].text + " ";
      }
   }

   // No items are selected
   if (selected.length == 0) {
      return;
   }

   copyEl.innerHTML = selectedText;

   //hide it, but in a way the browser thinks is clickable
   //(no visibility:hidden, display:none)
   copyEl.style.position = 'absolute';
   copyEl.style.left = '-9999px';

   var that = this;

   //add a call back for after the ctrl+c is completed
   copyEl.onkeyup = function() {
      //remove the extraneous element
      copyEl.parentNode.removeChild(copyEl);

      //return focus to the select
      that.focus();
   };

   //add the textbox to the document, and highlight all the text in the
   // textarea, ready for the ctrl+c copy event to fire
   document.body.appendChild(copyEl).select();

//    this.onkeydown = copyWatch;
}

// ========================================================================== //
//    Mouse callbacks
// ========================================================================== //

function mousemoveCallback(e) {
   window.mouse.track = true;

   // Get mouse pixel coords
   var parentRect = window.mouse.parent.getBoundingClientRect();
   window.mouse.pixelx = e.clientX - parentRect.left;
   window.mouse.pixely = e.clientY - parentRect.top;

   // Get mouse eta-phi coords
   window.mouse.x = (window.mouse.pixelx - window.plot.centerPixel[0]) /
      window.plot.pixelsPerUnit[0];
   window.mouse.y = (window.mouse.pixely - window.plot.centerPixel[1]) /
      window.plot.pixelsPerUnit[1];

   // display relative mouse coords
   var mouseStr = " mouse: " + window.mouse.pixelx.toString() + "  " +
      window.mouse.pixely.toString() + "<br/>";
   var coordStr = " coords: " + window.mouse.x.toString() + "  " +
      window.mouse.y.toString();
   document.getElementById("mousePos").innerHTML = mouseStr + coordStr;

   updateDetectors();
}

function clickCallback(e) {
   holdStations(window.mouse.x, window.mouse.y);

   updateDetectors();
}

function mouseoutCallback(e) {
   window.mouse.track = false;

   updateDetectors();
}























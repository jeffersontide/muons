// main.js

// ===== //
// Setup //
// ===== //
function init() {
   // Set form callbacks
   document.getElementById("clr").onclick = clearDetectors;
   document.getElementById("locate").onclick = locateElement;
   document.getElementById("clearPlotImage").onclick = clearPlotImage;
   document.getElementById("imgInput").onchange = loadPlotImage;
   document.getElementById("clearHold").onclick = unholdStations;
   document.getElementById("locateCoord").onclick = locateElementsByCoord;

   // Set up canvas plot
   window.etaAxis = new Axis('eta', -2.6, 2.6, 0.5, 'abs', '#000000', 'linear');
   window.phiAxis = new Axis('phi', -3.2, 3.2, 0.5, 'abs', '#000000', 'linear');
   window.plot = new Plot("plotCanvas", "coordCanvas",
                          [window.etaAxis, window.phiAxis], "", true);

   // Set up plot manipulation
   document.getElementById("setOrigin").onclick = setOriginCallback;
   document.getElementById("scaleX").onclick = scaleXCallback;
   document.getElementById("scaleY").onclick = scaleYCallback;

   // Mouse tracking in the plot window
   window.mouse = {
      'mode' : '', // 'none', 'origin', 'x', 'y'
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

   // Detector structure to hold data, adds detector buttons by default
   window.detectors = new Detectors();

   // Held stations, terrible
   window.holdList = [];
}


// ================= //
// Plot manipulation //
// ================= //

function stopClickEvent(e) {
   e.stopPropagation();
   window.removeEventListener('click', stopClickEvent, true);
}

// Start setOrigin process
function setOriginCallback() {
   // Make some warning text
   console.log("setting origin...");

   // Set a listener for the next mousedown within the window
   window.addEventListener('mousedown', setOrigin_mousedown, true);

   // Catch the next click and prevent it from registering (this will be reset
   // immediately after the click)
   window.addEventListener('click', stopClickEvent, true);
}

function setOrigin_mousedown(e) {
   // Make sure that the click lands inside the map
   var map = document.getElementById("map");
   var mapRect = map.getBoundingClientRect();
   var insideMap = mapRect.left < e.clientX &&
                   e.clientX < mapRect.right &&
                   mapRect.top < e.clientY &&
                   e.clientY < mapRect.bottom;

   if (insideMap) {
      // get the pixel coordinates of the click (relative to the NW corner of
      // the canvas) and report this to window.plot
      console.log('hit');

      var x = e.clientX - mapRect.left;
      var y = e.clientY - mapRect.top;

      // x_coord, y_coord coordinate desired
      // x, y respective pixel position of the coordinate
      var x_coord = parseFloat(document.getElementById("originX").value);
      var y_coord = parseFloat(document.getElementById("originY").value);

      window.plot.setOrigin(x_coord, y_coord, x, y);

      updateDetectors();
   } else {
      console.log('miss');
   }

   window.removeEventListener('mousedown', setOrigin_mousedown, true);

   // Prevent the mousedown event from propagating forward
   e.stopPropagation();

   console.log("done setting origin.");
}

// Start scaleX process
function scaleXCallback() {
   // Make some warning text
   console.log("scaling x...");

   // Set a listener for the next mousedown within the window
   window.addEventListener('mousedown', scaleX_mousedown, true);

   // Catch the next click and prevent it from registering (this will be reset
   // immediately after the click)
   window.addEventListener('click', stopClickEvent, true);
}

function scaleX_mousedown(e) {
   // Make sure the click lands inside the map
   var map = document.getElementById("map");
   var mapRect = map.getBoundingClientRect();
   var insideMap = mapRect.left < e.clientX &&
   e.clientX < mapRect.right &&
   mapRect.top < e.clientY &&
   e.clientY < mapRect.bottom;

   if (insideMap) {
      // get the pixel coordinates of the click (relative to the NW corner of
      // the canvas) and report this to window.plot
      console.log('hit');
      var x0 = e.clientX - mapRect.left;
      window.plot.setScaleX(x0);

      // Now set up event listeners for mousemove & mouseup (on the window).
      // They will clean up after themselves.
      window.addEventListener('mousemove', scaleX_mousemove, true);
      window.addEventListener('mouseup', scaleX_mouseup, true);
   } else {
      console.log('miss');
   }

   window.removeEventListener('mousedown', scaleX_mousedown, true);

   // Prevent the mousedown event from propagating forward
   e.stopPropagation();
}

function scaleX_mousemove(e) {
   // Find the x coordinate of the mouse wrt. the NW corner of the canvas
   var map = document.getElementById("map");
   var mapRect = map.getBoundingClientRect();
   var x = e.clientX - mapRect.left;

   // Send this to the plot
   window.plot.scaleX(x);

   // Update all the boxes
   updateDetectors();

   // Prevent event propagation
   e.stopPropagation();
}

function scaleX_mouseup(e) {
   // Clean up
   window.removeEventListener('mousedown', scaleX_mousedown, true);
   window.removeEventListener('mousemove', scaleX_mousemove, true);
   window.removeEventListener('mouseup', scaleX_mouseup, true);

   // Prevent forward propagation
   e.stopPropagation();

   console.log("done scaling x.");
}

// Start scaleY process
function scaleYCallback() {
   // Make some warning text
   console.log("scaling y...");

   // Set a listener for the next mousedown within the window
   window.addEventListener('mousedown', scaleY_mousedown, true);

   // Catch the next click and prevent it from registering (this will be reset
   // immediately after the click)
   window.addEventListener('click', stopClickEvent, true);
}

function scaleY_mousedown(e) {
   // Make sure the click lands inside the map
   var map = document.getElementById("map");
   var mapRect = map.getBoundingClientRect();
   var insideMap = mapRect.left < e.clientX &&
   e.clientX < mapRect.right &&
   mapRect.top < e.clientY &&
   e.clientY < mapRect.bottom;

   if (insideMap) {
      // get the pixel coordinates of the click (relative to the NW corner of
      // the canvas) and report this to window.plot
      console.log('hit');
      var y0 = e.clientY - mapRect.top;
      window.plot.setScaleY(y0);

      // Now set up event listeners for mousemove & mouseup (on the window).
      // They will clean up after themselves.
      window.addEventListener('mousemove', scaleY_mousemove, true);
      window.addEventListener('mouseup', scaleY_mouseup, true);
   } else {
      console.log('miss');
   }

   window.removeEventListener('mousedown', scaleY_mousedown, true);

   // Prevent the mousedown event from propagating forward
   e.stopPropagation();
}

function scaleY_mousemove(e) {
   // Find the x coordinate of the mouse wrt. the NW corner of the canvas
   var map = document.getElementById("map");
   var mapRect = map.getBoundingClientRect();
   var y = e.clientY - mapRect.left;

   // Send this to the plot
   window.plot.scaleY(y);

   // Update all the boxes
   updateDetectors();

   // Prevent event propagation
   e.stopPropagation();
}

function scaleY_mouseup(e) {
   // Clean up
   window.removeEventListener('mousedown', scaleY_mousedown, true);
   window.removeEventListener('mousemove', scaleY_mousemove, true);
   window.removeEventListener('mouseup', scaleY_mouseup, true);

   // Prevent forward propagation
   e.stopPropagation();

   console.log("done scaling y.");
}


// ================ //
// Background image //
// ================ //

// Set a background image for the plot
function loadPlotImage() {
   // If no image was uploaded (the dialog was cancelled), don't do anything
   if (!this.value) { return; }

   // Create a filereader object
   var reader = new FileReader();

   // Set the filereader to update the background image in the plot (image)
   // element as a dataURL
   reader.onload = function(e) {

      document.getElementById("foo").src = e.target.result;
      //document.getElementById("foo").style.background = "url("
        // + e.target.result + ")";
   }

   reader.readAsDataURL(this.files[0]);
}

// Clear background image for the plot
function clearPlotImage() {
   document.getElementById("foo").style.background = "";

   // Reset file prompt dialog
   document.getElementById("imgInput").value = "";
}


// =================== //
// Selecting detectors //
// =================== //

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
   for (var i = window.holdList.length - 1; i >= 0; i--) {
      if (window.holdList[i].detectorType.id == this.id && window.holdList[i].hold) {
         window.holdList[i].hold = false;
         window.holdList.splice(i, 1);
      }
   }

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


// ================= //
// Locating stations //
// ================= //

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


// ================== //
// Selecting stations //
// ================== //

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
      var element = document.createElement('span');
      element.style.borderColor = hoverStationList[i].detectorType.color;
      element.innerHTML = hoverStationList[i].id;
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
      var element = document.createElement('span');
      element.style.borderColor = holdStationList[i].detectorType.color;
      element.id = holdStationList[i].id;
      element.innerHTML = element.id;
      element.onmouseover = identifyStation;
      element.onmouseout = updateDetectors;
      element.ondblclick = unholdStation;
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
   this.parentElement.focus();

   // Find the id in window.holdList; the corresponding object should represent
   // the whole station
   for (var i = 0; i < window.holdList.length; i++) {
      if (window.holdList[i].id == this.id) {
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

function unholdStation() {
   // 'this' refers to the text element in the list
   var stationID = this.id;

   // Find the station in the hold list, then remove it
   for (var i = 0; i < window.holdList.length; i++) {
      if (window.holdList[i].id == stationID) {
         // Unhold the station and remove it from the global list
         window.holdList[i].hold = false;
         window.holdList.splice(i, 1);
         break;
      }
   }

   // Delete the text element from the list
   this.remove();

   updateDetectors();
}


// =============== //
// Mouse callbacks //
// =============== //

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























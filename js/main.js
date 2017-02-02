// main.js

// ===== //
// Setup //
// ===== //
function init() {
   window.update = true;

   // Set form callbacks
   var conventions = document.getElementsByName("convention");
   for (var i = 0; i < conventions.length; i++) {
      // Set callback
      conventions[i].onclick = conventionCallback;

      // Set initial variable
      if (conventions[i].checked) {
         window.convention = conventions[i].id;
      }
   }

   document.getElementById("selectAll").onclick = selectAll;
   document.getElementById("clr").onclick = clearDetectors;

   document.getElementById("clearPlotImage").onclick = clearPlotImage;
   document.getElementById("imgInput").onchange = loadPlotImage;
   document.getElementById("clearPlotPDF").onclick = clearPlotPDF;
   document.getElementById("pdfInput").onchange = loadPlotPDF;

   document.getElementById("copyStations").onclick = copyStations;
   document.getElementById("clearHold").onclick = unholdStations;

   document.getElementById("locate").onclick = locateElement;
   document.getElementById("locateCoord").onclick = locateElementsByCoord;

   // Set up plot
   window.etaAxis = new Axis('eta', -3.6, 3.6, 0.5, 'abs', '#000000', 'linear');
   window.phiAxis = new Axis('phi', -3.6, 3.6, 0.5, 'abs', '#000000', 'linear');
   window.plot = new Plot("plotCanvas", "coordCanvas",
                          [window.etaAxis, window.phiAxis], "eta-phi", false,
                          [-3,-3]);

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

   // Set up canvases
   resizeCanvas(600, 400);
   document.getElementById("map").style.cursor = 'crosshair';
}


function testTranslation() {
   selectAll();

   setTimeout( function() {
      var detectorList = Object.keys(window.detectors); // 'mdt', etc.
      for (var i = 0; i < detectorList.length; i++) {
         var detector = window.detectors[detectorList[i]];
         var stationList = Object.keys(detector.stations);
         for (var j = 0; j < stationList.length; j++) {
            var station = detector.stations[stationList[j]];
            console.log(station.id, station.onlineID());
         }
      }
      clearDetectors();

              console.log('done.');
   }, 1000);
}


// ================= //
// Plot manipulation //
// ================= //

function resizeCanvas(width, height) {
   var width = width.toString();
   var height = height.toString();

   // Resize canvas
   var canvases = document.getElementsByTagName("canvas");
   for (var i = 0; i < canvases.length; i++) {
      canvases[i].width = width;
      canvases[i].height = height;
   }

   // Resize map
   var map = document.getElementById("map");
   map.style.width = width + "px";
   map.style.height = height + "px";

   window.plot.update();
   updateDetectors();
}

function stopClickEvent(e) {
   e.stopPropagation();
   window.removeEventListener('click', stopClickEvent, true);
}

// Start setOrigin process
function setOriginCallback() {
   // Set a listener for the next mousedown within the window
   window.addEventListener('mousedown', setOrigin_mousedown, true);

   // Catch the next click and prevent it from registering (this will be reset
   // immediately after the click)
   window.addEventListener('click', stopClickEvent, true);

   document.getElementById("map").style.cursor = 'crosshair';

   document.getElementById("setOrigin").style.margin = "2px";
   document.getElementById("setOrigin").style.borderWidth = "4px";
   document.body.className = "unselectable";
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
      // Draw grid
      window.plot.grid = true;

      // Fire off the first movement
      var x = e.clientX - mapRect.left;
      var y = e.clientY - mapRect.top;

      // x_coord, y_coord coordinate desired
      // x, y respective pixel position of the coordinate
      var x_coord = parseFloat(document.getElementById("originX").value);
      var y_coord = parseFloat(document.getElementById("originY").value);

      window.plot.setOrigin(x_coord, y_coord, x, y);
      
      updateDetectors();

      // Set up event listeners for mousemove & mouseup, which will clean up
      // after themselves.
      window.addEventListener('mousemove', setOrigin_mousemove, true);
      window.addEventListener('mouseup', setOrigin_mouseup, true);
   } else {
      document.getElementById("setOrigin").style.margin = "5px";
      document.getElementById("setOrigin").style.borderWidth = "1px";
      window.removeEventListener('mousedown', setOrigin_mousedown, true);
      map.style.cursor = 'crosshair';
      document.body.className = "selectable";
   }

   // Prevent the mousedown event from propagating forward
   e.stopPropagation();
}

function setOrigin_mousemove(e) {
   var map = document.getElementById("map");
   var mapRect = map.getBoundingClientRect();

   var x = e.clientX - mapRect.left;
   var y = e.clientY - mapRect.top;

   // x_coord, y_coord coordinate desired
   // x, y respective pixel position of the coordinate
   var x_coord = parseFloat(document.getElementById("originX").value);
   var y_coord = parseFloat(document.getElementById("originY").value);

   window.plot.setOrigin(x_coord, y_coord, x, y);

   updateDetectors();

   e.stopPropagation();
}

function setOrigin_mouseup(e) {
   // Clean up
   // window.removeEventListener('mousedown', setOrigin_mousedown, true);
   window.removeEventListener('mousemove', setOrigin_mousemove, true);
   window.removeEventListener('mouseup', setOrigin_mouseup, true);

   window.plot.grid = false;
   window.plot.update();

   e.stopPropagation();
}

// Start scaleX process
function scaleXCallback() {
   // Set a listener for the next mousedown within the window
   window.addEventListener('mousedown', scaleX_mousedown, true);

   // Catch the next click and prevent it from registering (this will be reset
   // immediately after the click)
   window.addEventListener('click', stopClickEvent, true);

   document.getElementById("map").style.cursor = 'col-resize';

   document.getElementById("scaleX").style.margin = "2px";
   document.getElementById("scaleX").style.borderWidth = "4px";

   document.body.className = "unselectable";
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
      window.plot.grid = true;

      // get the pixel coordinates of the click (relative to the NW corner of
      // the canvas) and report this to window.plot
      var x0 = e.clientX - mapRect.left;
      window.plot.setScaleX(x0);

      // Now set up event listeners for mousemove & mouseup (on the window).
      // They will clean up after themselves.
      window.addEventListener('mousemove', scaleX_mousemove, true);
      window.addEventListener('mouseup', scaleX_mouseup, true);
   } else {
      window.removeEventListener('mousedown', scaleX_mousedown, true);
      map.style.cursor = 'crosshair';

      document.getElementById("scaleX").style.margin = "5px";
      document.getElementById("scaleX").style.borderWidth = "1px";

      document.body.className = "selectable";
   }

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
   // window.removeEventListener('mousedown', scaleX_mousedown, true);
   window.removeEventListener('mousemove', scaleX_mousemove, true);
   window.removeEventListener('mouseup', scaleX_mouseup, true);

   window.plot.grid = false;
   window.plot.update();

   // Prevent forward propagation
   e.stopPropagation();
}

// Start scaleY process
function scaleYCallback() {
   // Set a listener for the next mousedown within the window
   window.addEventListener('mousedown', scaleY_mousedown, true);

   // Catch the next click and prevent it from registering (this will be reset
   // immediately after the click)
   window.addEventListener('click', stopClickEvent, true);

   document.getElementById("map").style.cursor = 'row-resize';

   document.getElementById("scaleY").style.margin = "2px";
   document.getElementById("scaleY").style.borderWidth = "4px";

   document.body.className = "unselectable";
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
      window.plot.grid = true;

      // get the pixel coordinates of the click (relative to the NW corner of
      // the canvas) and report this to window.plot
      var y0 = e.clientY - mapRect.top;
      window.plot.setScaleY(y0);

      // Now set up event listeners for mousemove & mouseup (on the window).
      // They will clean up after themselves.
      window.addEventListener('mousemove', scaleY_mousemove, true);
      window.addEventListener('mouseup', scaleY_mouseup, true);
   } else {
      window.removeEventListener('mousedown', scaleY_mousedown, true);
      map.style.cursor = 'crosshair';

      document.getElementById("scaleY").style.margin = "5px";
      document.getElementById("scaleY").style.borderWidth = "1px";
      document.body.className = "selectable";
   }

   // Prevent the mousedown event from propagating forward
   e.stopPropagation();
}

function scaleY_mousemove(e) {
   // Find the x coordinate of the mouse wrt. the NW corner of the canvas
   var map = document.getElementById("map");
   var mapRect = map.getBoundingClientRect();
   var y = e.clientY - mapRect.top;

   // Send this to the plot
   window.plot.scaleY(y);

   // Update all the boxes
   updateDetectors();

   // Prevent event propagation
   e.stopPropagation();
}

function scaleY_mouseup(e) {
   // Clean up
   // window.removeEventListener('mousedown', scaleY_mousedown, true);
   window.removeEventListener('mousemove', scaleY_mousemove, true);
   window.removeEventListener('mouseup', scaleY_mouseup, true);

   window.plot.grid = false;
   window.plot.update();

   // Prevent forward propagation
   e.stopPropagation();
}


// ================ //
// Background image //
// ================ //

// Set a background image for the plot
function loadPlotImage() {
   // If no image was uploaded (the dialog was cancelled), don't do anything
   if (!this.value) { return; }

   // Clear the background PDF
   clearPlotPDF();

   // Create a filereader object
   var reader = new FileReader();

   // Set the filereader to update the background image in the plot (image)
   // element as a dataURL. This should drop any reference to the previous
   // image.
   reader.onloadend = function(e) {
      document.getElementById("foo").src = reader.result;
   }

   reader.readAsDataURL(this.files[0]);
}

// Clear background image for the plot
function clearPlotImage() {
   document.getElementById("foo").src = "";

   // Reset file prompt dialog
   document.getElementById("imgInput").value = "";
}

// ============== //
// Background PDF //
// ============== //

function loadPlotPDF() {
   // If no file was uploaded (the dialog was cancelled), don't do anything
   if (!this.value) { return; }

   // Clear the background image/PDF
   clearPlotImage();

   var reader = new FileReader();

   reader.onload = function(e) {
      try {
         // PDF.js to the rescue
         PDFJS.disableWorker = true;

         PDFJS.getDocument(reader.result).then(function getPDF(pdf) {
               // Get page number
               var numPages = pdf.numPages;
               var pageNumber = document.getElementById("pageNumber").value;
               if (!pageNumber) { pageNumber = '1'; }
               pageNumber = parseInt(pageNumber);
               if (pageNumber <= 0 || pageNumber > pdf.numPages) {
                  console.log('error: page # not within acceptable range');
                  return;
               }

               pdf.getPage(pageNumber).then(function getPage(page) {
                  var scale = 1;
                  var viewport = page.getViewport(scale);

                  // Prepare canvas using PDF page dimensions
                  var canvas = document.getElementById('imageCanvas');
                  var context = canvas.getContext('2d');
                
                  // Render PDF page into canvas context
                  var task = page.render({canvasContext: context, viewport:
                                         viewport});
               });
            }
         );
      }
      catch (err) {
         console.log('error:', err);
      }
   }

   reader.readAsArrayBuffer(this.files[0]);
}

function clearPlotPDF() {
   // This might leave the PDF image somewhere in memory -- check this
   var canvas = document.getElementById("imageCanvas");
   var context = canvas.getContext('2d');
   context.clearRect(0, 0, canvas.width, canvas.height);

   document.getElementById("pdfInput").value = "";
}


// ========== //
// Render PDF //
// ========== //

function PDFToImage() {
   var url = 'ep3.pdf';

   PDFJS.disableWorker = true;

   // Asynchronous download PDF as an ArrayBuffer
   PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
      // Fetch the first page
      pdf.getPage(1).then(function getPageHelloWorld(page) {
         var scale = 1;
         var viewport = page.getViewport(scale);

         // Prepare canvas using PDF page dimensions
         var canvas = document.getElementById('imageCanvas');
         var context = canvas.getContext('2d');

         // Render PDF page into canvas context
         page.render({canvasContext: context, viewport: viewport});
      });
   });
}


// =================== //
// Selecting detectors //
// =================== //

// Set naming convention
function conventionCallback() {
   if (this.checked) {
      window.convention = this.id;
   }

   updateDetectors();
}

// Select all detectors
function selectAll() {
   // too paranoid to use for..in, sorry
   var detectorList = Object.keys(window.detectors);
   for (var i = 0; i < detectorList.length; i++) {
      var detector = window.detectors[detectorList[i]];
      if (!detector.selected) {
         detector.button.click();
      }
   }
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
   var str = document.getElementById("detectorID").value;

   // If the box is empty, return
   if (!str) {
      return;
   }

   var re;

   if (document.getElementById("regexpOption").checked) {
      re = new RegExp(str, 'i');
   } else {
      re = new RegExp(wildcardToRegexStr(str), 'i');
   }

   // Loop through all selected detectors
   var detectorList = Object.keys(window.detectors);
   for (var i = 0; i < detectorList.length; i++) {
      var detector = window.detectors[detectorList[i]];

      // If the detector type isn't selected, then move on
      if (!detector.selected) { continue; }

      var stationList = Object.keys(detector.stations);
      var match = false;

      for (var j = 0; j < stationList.length; j++) {
         var stationID = stationList[j];
         match = re.test(stationID);
         if (match) {
            // Hold the station
            detector.stations[stationID].hold = true;
            window.holdList.push(detector.stations[stationID]);
         }
      }
   }

   updateDetectors();
}

function wildcardToRegexStr(wildStr) {
   var wild = wildStr.split("*");
   var reStr = "";

   // Asterisk at the beginning
   if (wild[0] == "") {
      reStr += ".*";
      wild.splice(0, 1);
   } else {
      reStr += "^";
   }

   for (var i = 0; i < wild.length; i++) {
      reStr += wild[i];
      reStr += ".*";
   }

   // Doesn't end with an asterisk
   if (wild.length > 0 && wild[wild.length - 1] != "") {
      // Delete the last wildcard
      reStr = reStr.slice(0, -2);
      // Add an end marker
      reStr += "$";
   }

   return reStr;
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
   if (!window.update) {
      return;
   }

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
      hoverStationList = findStations(window.mouse.x, window.mouse.y);
   }

   for (var i = 0; i < hoverStationList.length; i++) {
      // Plot hover stations
      hoverStationList[i].draw(window.plot);

      // Display hover stations in list
      var element = document.createElement('span');
      element.style.borderColor = hoverStationList[i].detectorType.color;
      element.innerHTML = (window.convention == "offlineConvention") ? hoverStationList[i].id : hoverStationList[i].onlineID();
      hoverElement.appendChild(element);
   }

   // Deal with hold stations -- first, remove duplicates
   var holdStationList = window.holdList.reduce(
      function(a, b) {
         if (a.indexOf(b) < 0) { a.push(b) };
         return a;
      },
      []
   );
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
      element.innerHTML = (window.convention == "offlineConvention") ? holdStationList[i].id : holdStationList[i].onlineID();
      element.onmousedown = function() { window.update = false; };
      element.onmouseup = function() { window.update = true; };
      element.onmouseover = identifyStation;
      element.onmouseout = updateDetectors;
      element.ondblclick = unholdStation;
      holdElement.appendChild(element);
   }
}

function findStations(x, y) {
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

            if (hoverBool) {
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
   var stations = findStations(x, y);

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

function copyStations() {
   // cough cough terrible ugh bad
   stationElements = document.getElementsByTagName("span");

   if (stationElements.length == 0) { return; }

   var stationList = "";

   for (var i = 0; i < stationElements.length; i++) {
      stationList += stationElements[i].innerHTML;
      if (i < stationElements.length - 1) {
         stationList += "\n";
      }
   }

   window.prompt('Press Ctrl-c to copy element list', stationList);
}


// =============== //
// Mouse callbacks //
// =============== //

function mousemoveCallback(e) {
   window.mouse.track = true;

   // Get mouse pixel coords
   var parentRect = window.mouse.parent.getBoundingClientRect();
   window.mouse.pixelx = e.clientX - parentRect.left;
   window.mouse.pixely = parentRect.height - (e.clientY - parentRect.top);

   // Get mouse eta-phi coords
   window.mouse.x = (window.mouse.pixelx - window.plot.originPixel[0]) /
      window.plot.pixelsPerUnit[0];
   window.mouse.y = (window.mouse.pixely - window.plot.originPixel[1]) /
      window.plot.pixelsPerUnit[1];

   // display relative mouse coords
   /*
   var mouseStr = " mouse: " + window.mouse.pixelx.toString() + "  " +
      window.mouse.pixely.toString() + "<br/>";
   */ var mouseStr = "";

   var coordStr = "&nbsp;coords: " + window.mouse.x.toFixed(3).toString() + "  " +
      window.mouse.y.toFixed(3).toString();
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























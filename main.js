// main.js

// Any functions to run right after the page loads
function init() {
   // Configure buttons
   var buttons = document.getElementsByTagName("button");

   // augh
   for (var i = 0; i < buttons.length; i++) {
      var button = buttons.item(i);

      // Set detector button options
      if (button.className == "detectorButton") {
         button.style.borderColor = rectangleColor(button.id);
         button.selected = false;
         button.loaded = false;
         button.onclick = toggleDetector;
      }

      // Set clear button options
      else if (button.id == "clr") {
         button.onclick = clearDetectors;
      }

      // Set locate button options
      else if (button.id == "locate") {
         button.onclick = locateElement;
      }

      // Set clear plot image button
      else if (button.id == "clearPlotImage") {
         button.onclick = clearPlotImage;
      }
   }

   // Configure image upload form
   document.getElementById("imgInput").onchange = loadPlotImage;

   // ugh datastructures
   function Dataset(path) {
      this.path = path;
      this.data = {};
         // detectorElementID : rect (rect.coords to find coordinates)
      this.button = null; /***/
   }

   // Plotting the mouse
   document.getElementById("map").onmousemove = updateMouse;
   window.mouseX = 0; // relative to the NW corner of image
   window.mouseY = 0;

   // Handles for currently visible rectangles
   window.visible = [];

   // Set aside some tables
   window.detectorData = {
      'tgc' : new Dataset("ms_single/tgccoords.txt"),
      // /***/ rpc has three different files
      'rpc' : new Dataset("ms_single/rpccoords_lowpt.txt"),
      'csc' : new Dataset("ms_single/csccoords.txt"),
      'mdton' : new Dataset("ms_single/mdtoncoords.txt"),
      'mdtoff' : new Dataset("ms_single/mdtoffcoords.txt")
   };

   console.log('initialized');
}

// Set a background image for the plot
function loadPlotImage() {
   // If no image was uploaded (the dialog was cancelled), don't do anything
   if (!this.value) {
      return;
   }

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
   // Toggle state
   this.selected = this.selected ? false : true;

   // Toggle border width
   this.style.borderWidth = this.selected ? "4px" : "1px";
   this.style.margin = this.selected ? "2px" : "5px";

   // Load data if necessary
   if (this.selected && !this.loaded) {
      var loaded = loadDetectorData(this.id);
      this.loaded = loaded;
   }
}

// Deselect all detector types
function clearDetectors() {
   // Deselects all detectors
   var buttons = document.getElementsByClassName("detectorButton");

   for (var i = 0; i < buttons.length; i++) {
      var button = buttons.item(i);

      if (button.selected) {
         button.click();
      }
   }
}

// Locate element position by ID
function locateElement() {
   var elementID = document.getElementById("detectorID").value;

   // If the box is empty, return
   if (!elementID) {
      return;
   }

   /***/ // real code
}

// Load detector data
function loadDetectorData(detectorType) {
   var xhr = new XMLHttpRequest();

   var set = window.detectorData[detectorType];

   xhr.open("GET", set['path'], true);

   xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
         var coords = this.responseText.split("\n");

         coords = coords.filter(Boolean);

         var docfrag = document.createDocumentFragment();

         coords.forEach( function(coord) {
            var coordArray = coord.split(" ").filter(Boolean);

            // create a rectangle for the detector element
            var rect = document.createElement("div");
            rect.array = [ // x1, y1, x2, y2
               parseInt(coordArray[1]),
               parseInt(coordArray[2]),
               parseInt(coordArray[3]),
               parseInt(coordArray[4]),
            ];

            rect.className = "c4-cloak";
            rect.id = coordArray[0];
            rect.style.borderColor = rectangleColor(detectorType);
            rect.style.left = coordArray[1] + "px";
            var top = parseInt(coordArray[2]) - 100;
            rect.style.top = top.toString() + "px";
            var width = parseInt(coordArray[3]) - parseInt(coordArray[1]);
            rect.style.width = width.toString() + "px";
            var height = parseInt(coordArray[4]) - parseInt(coordArray[2]);
            rect.style.height = height.toString() + "px";

            // push rectangle to data structure
            set.data[coordArray[0]] = rect;

            docfrag.appendChild(rect);
         });

         //append rect and overlay to map
         document.getElementById("map").appendChild(docfrag);
      }
   }

   xhr.send();

   return true;
}

// fix later /***/
function rectangleColor(detectorType) {
   switch (detectorType) {
      case "tgc":
         return "#ff9966";
      case "rpc":
         return "#cc00cc";
      case "csc":
         return "#00ff00";
      case "mdton":
         return "#00ccff";
      case "mdtoff":
         return "#ffff4d";
      default:
         return;
   }
}

function updateMouse(e) {
   var parentRect = document.getElementById("map").getBoundingClientRect();
   window.mouseX = e.clientX - parentRect.left;
   window.mouseY = e.clientY - parentRect.top;

   // display relative mouse coords
   var str = " mouse: " + window.mouseX.toString() + "  " + window.mouseY.toString() + "<br/>";
   document.getElementById("mousePos").innerHTML = str;

   // iterate through all currently visible rectangles and hide them
   for (var i = window.visible.length - 1; i >= 0; i--) {
      window.visible[i].className = "c4-cloak";
   }

   window.visible = [];

   // update matching detectors (csc)
   detectorTypes = ["tgc", "rpc", "csc", "mdton", "mdtoff"];
   hoverDetectors = [];

   for (var j = 0; j < detectorTypes.length; j++) {
      if (document.getElementById(detectorTypes[j]).selected) {
         var data = window.detectorData[detectorTypes[j]]['data'];
         var docfrag = document.createDocumentFragment();

         // iterate through detector elements
         var detectorElements = Object.keys(data);

         for (var i = 0; i < detectorElements.length; i++) {
            coordArray = data[detectorElements[i]].array;

            if (window.mouseX > coordArray[0]
                && window.mouseX < coordArray[2]
                && window.mouseY + 100 > coordArray[1]
                && window.mouseY + 100 < coordArray[3]) {

               // add to list to be displayed
               hoverDetectors.push(detectorElements[i]);

               // show the rectangle
               window.visible.push(data[detectorElements[i]]);
               data[detectorElements[i]].className = "c4-uncloak";
            }
         }
      }

      document.getElementById("hoverDetectors").innerHTML = hoverDetectors.toString();
   }
}












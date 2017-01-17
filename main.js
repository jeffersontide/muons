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
         // Set colors
         switch (button.id) {
            case "tgc":
               button.style.borderColor = "#ff9966";
               break;
            case "rpc":
               button.style.borderColor = "#cc00cc";
               break;
            case "csc":
               button.style.borderColor = "#00ff00";
               break;
            case "mdton":
               button.style.borderColor = "#00ccff";
               break;
            case "mdtoff":
               button.style.borderColor = "#ffff4d";
               break;
         }

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
      this.data = [];
      this.rect = "";
   }

   // Plotting the mouse
   document.getElementById("foo").onmousemove = updateMouse;
   window.mouseX = 0; // relative to the NW corner of image
   window.mouseY = 0;

   // Set aside some tables
   window.detectorData = {
      'tgc' : new Dataset("ms_single/tgccoords.txt"),
      // /***/ rpc has three different files
      'rpc' : new Dataset("ms_single/rpccoords_lowpt.txt"),
      'csc' : new Dataset("ms_single/csccoords.txt"),
      'mdton' : new Dataset("ms_single/mdtoncoords.txt"),
      'mdtoff' : new Dataset("ms_single/mdtoffcoords.txt")
   };

   // And some display info
   window.mouse = [5, 5];

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

   console.log('located detector element ' + elementID);
}

// Load detector data
function loadDetectorData(detectorType) {
   var xhr = new XMLHttpRequest();

   var set = window.detectorData[detectorType];

   xhr.open("GET", set['path'], true);

   xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {

         // get text contents
         j = 1000000000000000000;

         var coords = this.responseText.split("\n");

         coords = coords.filter(Boolean);

         coords.forEach( function(coord) {
            // dump into data structure
            var coordArray = coord.split(" ").filter(Boolean);
            set.data.push({
               id : coordArray[0],
               x : coordArray[1],
               y : coordArray[2],
               width : coordArray[3],
               height : coordArray[4]
            });

            // and then the rest
            var area = document.createElement("area");
            area.id = detectorType + j.toString();
            area.shape = "rect";
            area.href = "#";

            var att = document.createAttribute("att");
            att.value = rectangleColor(detectorType, coord);
            area.setAttributeNode(att);

            //overlay text is the first term in coords string
            var div = document.createElement("div");

            //increase j
            j++;

            //append rect and overlay to map
            document.getElementById("map").appendChild(area);

            if (document.getElementById("map").length > 0) {
               var offset = area.coords;
               var coordarray = offset.split(",");
               var l = coordarray[0];
               var t = coordarray[1];
               var r = coordarray[2];
               var b = coordarray[3];
               var ident = area.id;
               var w = r - l;
               var h = b - t;
               var bc = att.value;

               //convert area element to a div
               var elementDiv = document.createElement("div");
               elementDiv.style.position = 'absolute';
               elementDiv.style.left = l + 'px';
               elementDiv.style.top = t + 'px';
               elementDiv.style.border = 'solid';
               elementDiv.style.borderColor = bc;
               elementDiv.style.id = ident;
               elementDiv.style.display = 'none';
               elementDiv.style.width = w + 'px';
               elementDiv.style.height = h + 'px';

               document.body.append(elementDiv);

               if (targetEl == div.innerHTML) {
                  console.log("match=" + div.innerHTML);
                  elementDiv.style.display = "block";
                  console.log(bc);
               }
            };
         });

         console.log(this.responseText);

      }
   }

   xhr.send();

   return true;
}

// fix later /***/
function rectangleColor(i, coord) {
   var color;

   if (i == 'tgc') {
      i = 0;
   } else if (i == 'rpc') {
      i = 1;
   } else if (i == 'csc') {
      i = 2;
   } else if (i == 'mdton') {
      i = 3;
   } else if (i == 'mdtoff') {
      i = 4;
   }

   if (i == 0 && coord.substring(4,5) == '1') {
      color = '#ff9966';
   }

   if (i == 0 && coord.substring(4,5) == '2') {
      color = '#ff6600';
   }
   if (i == 0 && coord.substring(4,5) == '3') {
      color = '#ff0000';
   }
   if (i == 0 && coord.substring(4,5) == '4') {
      color = '#800000';
   }

   if (i == 1) {
      color = '#ff00ff';
   }

   if (i == 2) {
      color = '#cc00cc';
   }

   if (i == 3) {
      color = '#660066';
   }

   if (i == 4 && coord.substring(5,6) == 'S') {
      color = '#00ff00';
   }
   if (i == 4 && coord.substring(5,6) == 'L') {
      color = '#006600';
   }

   if (i == 5 && coord.substring(4,5) == 'E') {
      color = '#00ffff';
   }
   if (i == 5 && coord.substring(4,5) == 'I') {
      color = '#00ccff';
   }
   if (i == 5 && coord.substring(4,5) == 'M') {
      color = '#0066cc';
   }
   if (i == 5 && coord.substring(4,5) == 'O') {
      color = '#003399';
   }

   if (i == 6 && coord.substring(4,5) == 'E') {
      color = '#ffff4d';
   }
   if (i == 6 && coord.substring(4,5) == 'I') {
      color = '#ffff00';
   }
   if (i == 6 && coord.substring(4,5) == 'M') {
      color = '#cdcd00';
   }
   if (i == 6 && coord.substring(4,5) == 'O') {
      color = '#8b8b00';
   }
}

function updateMouse(e) {
   window.mouseX = e.offsetX;
   window.mouseY = e.offsetY;
}












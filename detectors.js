// detectors.js

function Detectors() {
   // Add default detectors
   this.addDetector('tgc', 'TGC', '#ff9966', 'ms_single/tgccoords.txt');
   this.addDetector('rpc', 'RPC', '#cc00cc', 'ms_single/rpccoords_lowpt.txt');
   this.addDetector('csc', 'CSC', '#00ff00', 'ms_single/csccoords.txt');
   this.addDetector('mdton', 'MDT Online', '#00ccff', 'ms_single/mdtoncoords.txt');
   this.addDetector('mdtoff', 'MDT Offline', '#ffff4d', 'ms_single/mdtoffcoords.txt');
}

Detectors.prototype.addDetector = function(id, name, color, path) {
   // Create button & add to document
   var button = document.createElement("button");
   button.id = id;               // document element ID
   button.innerText = name;      // display text
   button.style.borderColor = color;
   button.onclick = toggleDetector; // from main.js
   button.className = "detectorButton"
   document.getElementById("detectorButtons").appendChild(button);

   this[id] = {
      'button' : button,   // DOM element
      'path' : path,
      'color' : color,
      'loaded' : false,
      'selected' : false,
      'stations' : {},      // will contain station coordinates, etc. later

      // station coords expressed in (eta1, phi1, eta2, phi2)
      'addStation' : function(id, coords) {
         // wraparound stuff in phi. deal with this later in the c code /***/

         if (Math.abs(coords[3] - coords[1]) > Math.PI) {
            if (coords[1] < 0) {
               coords[1] += 2 * Math.PI;
            } else if (coords[3] < 0) {
               coords[3] += 2 * Math.PI;
            }
         }

         this.stations[id] = {
            'id' : id,
            'coords' : coords,
            'draw' : function(plot) {
               plot.drawRect(coords, color, 2);
            },
            'hold' : false    // true: "hold" the station on the plot
         };
      }
   };

   // Link the button DOM object and the detector object
   button.detector = this[id];   // handle to detector object

   // ...
}
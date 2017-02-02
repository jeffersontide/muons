// detectors.js
// an abomination I will eventually fix

function Detectors() {
   // Add default detectors
   this.addDetector('tgc', 'TGC', '#ff9966', 'ms_single/tgccoords.txt');
   this.addDetector('rpc', 'RPC', '#cc00cc', 'ms_single/rpccoords.txt');
   this.addDetector('csc', 'CSC', '#00ff00', 'ms_single/csccoords.txt');
   this.addDetector('mdt', 'MDT', '#ffff4d', 'ms_single/mdtoffcoords.txt');
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

   // Define the detector object
   this[id] = {
      'id' : id,
      'button' : button,   // DOM element
      'path' : path,
      'color' : color,
      'loaded' : false,
      'selected' : false,
      'stations' : {},

      // coords = [eta1, phi1, eta2, phi2]
      'addStation' : function(stationID, coords) {
         // Prevent boxes from wrapping around -pi to pi
         if (Math.abs(coords[3] - coords[1]) > Math.PI) {
            if (coords[1] < 0) {
               coords[1] += 2 * Math.PI;
            } else if (coords[3] < 0) {
               coords[3] += 2 * Math.PI;
            }
         }

         // Define individual stations: move to another function
         this.stations[stationID] = {
            // this = detectors object (e.g., window.detectors)
            'id' : stationID,
            'detectorType' : this,
            'coords' : coords,
            'draw' : function(plot) {
               plot.drawRect(coords, color, 2);
            },
            'identify' : function(plot) {
               plot.identifyRect(coords, "#000000", 2);
            },
            'hold' : false,
            'onlineID_' : "",
            'onlineID' : generateOnlineID
         };
      }
   };

   // Link the DOM button and the detector object
   button.detector = this[id];
}


// a terrible tragedy for all
function generateOnlineID() {
   // this = station object

   // maybe the online ID has already been generated; return that instead
   if (this.onlineID_ != "") {
      return this.onlineID_;
   }

   // CSC
   if (this.detectorType.id == "csc") {
      // ?????
      this.onlineID_ = this.id;
      return this.onlineID_;
   }

   // MDT & RPC
   if (this.detectorType.id == "mdt" || this.detectorType.id == "rpc") {
      var subtype = this.id.slice(3, 6);           // subtype (e.g., BMF)
      var etaAbs = parseInt(this.id.slice(6,7));
      var Z = this.id[7];                          // A, B, or C
      var phi = parseInt(this.id.slice(8,10));     // phi, usually (1..8)

      // for these subtypes, phi is encoded as an odd number
      switch (subtype) {
         case "BML": // includes rpc
         case "BOL": // includes rpc
         case "BIL":
         case "BIM":
         case "BIR":
         case "EIL":
         case "EEL":
         case "EML":
         case "EOL":
            phi = 2 * phi - 1;
            break;

         default:
            phi = 2 * phi;
      }

      // any other exceptions
      if (subtype == "BOF") {         // includes rpc
         etaAbs = 2 * etaAbs - 1;
      }
      if (subtype == "BOG") {         // includes rpc
         etaAbs = 2 * etaAbs;
      }

      // bounds checking
      if (etaAbs < 0 || 8 < etaAbs) {
         console.log('error parsing etaAbs for', this.id);
         return "#ERROR";
      }
      if (phi < 0 || 16 < phi) {
         console.log('error parsing phi for', this.id);
         return "#ERROR";
      }

      // convert etaAbs & phi to strings
      etaAbs = etaAbs.toString();
      phi = (phi >= 10) ? phi.toString() : "0" + phi.toString();

      // clean up
      this.onlineID_ = this.detectorType.id + subtype + etaAbs + Z + phi;
      return this.onlineID_;

   }

   // TGC
   if (this.detectorType.id == "tgc") {
      this.onlineID_ = this.id;

      // Pull out parameters
      var subtype       = this.id.slice(3, 5);           // T1, T2, T3, T4
      var position      = this.id[5];                    // E or F
      var eta           = parseInt(this.id[6]);          // Abs value
      var Z             = this.id[7];                    // A, B, or C
      var phi           = parseInt(this.id.slice(8,10)); // single-index
      var phiSector     = -1;                            // TBD
      var phiSubsector  = -1;                            // TBD

      // Big wheel
      if (subtype == "T1" || subtype == "T2" || subtype == "T3") {
         subtype = "M" + subtype[1];

         if (position == "E") {
            // 12 sectors of 4 (0..3)
            phiSector = Math.ceil(phi / 4);
            phiSubsector = phi - 4 * (phiSector - 1) - 1;

            // Eta is flipped in the online convention
            if (subtype == "M1") {
               eta = 5 - eta;
            }
            if (subtype == "M2" || subtype == "M3") {
               eta = 6 - eta;
            }
         }

         if (position == "F") {
            // 12 sectors of 2 ({0, 2})
            phiSector = Math.ceil(phi / 2);
            phiSubsector = (phi / 2 == Math.ceil(phi / 2)) ? 2 : 0;
         }
      }

      // Small wheel
      if (subtype == "T4") {
         subtype = "I4";

         if (position == "E") {
            // re-index from (1..21) to (1..24) \ {10, 18, 22}
            if (phi > 9) { phi++; }
            if (phi > 17) { phi++; }
            if (phi > 21) { phi++; }

            // 8 sectors of 3 (0..2)
            phiSector = Math.ceil(phi / 3);
            phiSubsector = phi - 3 * (phiSector - 1) - 1;
            phiSector = phiSector * 2 - 1;
         }

         if (position == "F") {
            // Single-index; no subsectors
            phiSector = phi;
         }
      }

      // Stringify what you need to
      phiSector = (phiSector > 9) ? phiSector.toString() : "0" + phiSector.toString();
      eta = eta.toString()

      // Put it all together
      this.onlineID_ = "tgc" + subtype + position + eta + Z + phiSector;

      // Add phiSubsector if necessary
      if (phiSubsector >= 0) {
         this.onlineID_ += " (" + phiSubsector.toString() + ")";
      }

      return this.onlineID_;
   }

   // if you are still here, then something is wrong
   console.log('fuck');
}


































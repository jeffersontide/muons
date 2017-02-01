// detectors.js

function Detectors() {
   // Add default detectors
   this.addDetector('tgc', 'TGC', '#ff9966', 'ms_single/tgccoords.txt');
   this.addDetector('rpc', 'RPC', '#cc00cc', 'ms_single/rpccoords_lowpt.txt');
   this.addDetector('csc', 'CSC', '#00ff00', 'ms_single/csccoords.txt');
   // this.addDetector('mdton', 'MDT Online', '#00ccff', 'ms_single/mdtoncoords.txt');
   this.addDetector('mdtoff', 'MDT', '#ffff4d', 'ms_single/mdtoffcoords.txt');
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
      'id' : id,
      'button' : button,   // DOM element
      'path' : path,
      'color' : color,
      'loaded' : false,
      'selected' : false,
      'stations' : {},      // will contain station coordinates, etc. later

      // station coords expressed in (eta1, phi1, eta2, phi2)
      'addStation' : function(stationID, coords) {
         // wraparound stuff in phi. deal with this later in the c code /***/

         if (Math.abs(coords[3] - coords[1]) > Math.PI) {
            if (coords[1] < 0) {
               coords[1] += 2 * Math.PI;
            } else if (coords[3] < 0) {
               coords[3] += 2 * Math.PI;
            }
         }

         this.stations[stationID] = {
            'id' : stationID,
            'detectorType' : this,     // refers to detector object, I promise
            'coords' : coords,
            'draw' : function(plot) {
               plot.drawRect(coords, color, 2);
            },
            'identify' : function(plot) {
               // Plot a bordering rectangle to identify the station on the plot
               plot.identifyRect(coords, "#000000", 2);
            },
            'hold' : false,    // true: "hold" the station on the plot
            'onlineID' : "",

            // possibly the worst crime i have ever committed
            'generateOnlineID' : function() {
               // 'this' refers to the station object

               // Online ID has already been generated; use it
               if (this.onlineID != "") {
                  return this.onlineID;
               }

               // Generate online ID from offline ID
               if (this.detectorType.id == "csc") {
                  this.onlineID = this.id;
                  return this.onlineID;
               } else if (this.detectorType.id == "mdt"
                          || this.detectorType.id == "mdton"
                          || this.detectorType.id == "mdtoff"
                          || this.detectorType.id == "rpc") {
                  var subtype = this.id.slice(3, 6);           // subtype (e.g., BMF)
                  var etaAbs = parseInt(this.id.slice(6,7));   // precedes A/B/C
                  var phi = parseInt(this.id.slice(8,10));       // phi, usually (1..8)

                  // for these subtypes, phi is encoded as an odd number
                  switch (subtype) {
                     case "BIL":
                     case "BML": // includes rpc
                     case "BOL": // includes rpc
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
                  if (subtype == "BOF") {                // includes rpc
                     etaAbs = 2 * etaAbs - 1;
                  } else if (subtype == "BOG") {         // includes rpc
                     etaAbs = 2 * etaAbs;
                  }

                  // bounds checking
                  if (0 > etaAbs || etaAbs > 8) {
                     console.log('error parsing etaAbs for', this.id);
                     return "#ERROR";
                  }
                  if (0 > phi || phi > 16) {
                     console.log('error parsing phi for', this.id);
                     return "#ERROR";
                  }

                  // convert etaAbs & phi to strings
                  etaAbs = etaAbs.toString();
                  phi = (phi >= 10) ? phi.toString() : "0" + phi.toString();

                  // clean up
                  this.onlineID = this.id.slice(0,6) + etaAbs + this.id[7] + phi;
                  // this.onlineID = this.id.splice(6, 1, etaAbs).splice(8, 2, phi);
                  return this.onlineID;

               } else if (this.detectorType.id == "tgc") {
                  var onlineID = this.id;

                  var subtype = onlineID.slice(3, 5);  // T1, T2, T3, T4
                  var position = onlineID[5];          // E or F

                  var phi = parseInt(onlineID.slice(8,10));
                  var phiSector = -1;
                  var phiSubsector = -1;

                  // big wheel stations
                  if (subtype == "T1" || subtype == "T2" || subtype == "T3") {
                     onlineID = onlineID.slice(0,3) + "M" + onlineID.slice(4);

                     if (position == "E") {
                        phiSector = Math.ceil(phi / 4); // 48 total
                        phiSubsector = phi - 4 * (phiSector - 1) - 1; // 0-indexed

                        // flip eta
                        var eta = parseInt(onlineID[6]);
                        if (subtype == "T1") {
                           eta = 5 - eta;
                        } else if (subtype == "T2" || subtype == "T3") {
                           eta = 6 - eta;
                        }

                        onlineID = onlineID.slice(0,6) + eta.toString() + onlineID.slice(7);

                     } else if (position == "F") {
                        phiSector = Math.ceil(phi / 2); // 24 total
                        phiSubsector = (phi / 2 == Math.ceil(phi / 2)) ? 2 : 0;
                     } else {
                        console.log('fuck');
                     }
                  } else if (subtype == "T4") {
                     onlineID = onlineID.slice(0,3) + "I" + onlineID.slice(4);

                     if (position == "E") {
                        // phi runs from 1 through 21, so actually:
                        if (phi > 19) { phi++; }
                        if (phi > 16) { phi++; }
                        if (phi > 9)  { phi++; }

                        phiSector = Math.ceil(phi / 3);
                        phiSubsector = phi - 3 * (phiSector - 1) - 1; // 0-indexed
                        phiSector = phiSector * 2 - 1;
                     } else if (position == "F") {
                        phiSector = phi;
                     } else {
                        console.log('fuck');
                     }
                  } else {
                     console.log('fuck');
                  }

                  // Update phiSector
                  phiSector = (phiSector > 9) ? phiSector.toString() : "0" + phiSector.toString();
                  onlineID = onlineID.slice(0, -2) + phiSector;

                  // Update phi subsector if necessary
                  if (phiSubsector >= 0) {
                     onlineID += "/" + phiSubsector.toString();
                  }

                  this.onlineID = onlineID;
                  return onlineID;
               }

               // if you are still here, then something is wrong
               console.log('fuck');
            }
         };
      }
   };

   // Link the button DOM object and the detector object
   button.detector = this[id];   // handle to detector object
}





































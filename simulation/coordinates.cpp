#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <map>
#include <string>
#include <math.h>

#include <TROOT.h>
#include <TFile.h>
#include <TTree.h>
#include "TTreeReader.h"
#include "TTreeReaderValue.h"

struct Chamber
{
   double eta_min = 10.0;
   double eta_max = -10.0;
   double phi_min = 10.0;
   double phi_max = -10.0;

   // Check if valid
   bool valid(void) {
      return (eta_min <= eta_max && phi_min <= phi_max);
   }

   // Add a hit
   void hit(double eta, double phi) {
      if (eta < eta_min) { eta_min = eta; }
      if (eta_max < eta) { eta_max = eta; }
      if (phi < phi_min) { phi_min = phi; }
      if (phi_max < phi) { phi_max = phi; }
   }

   // Print
   void print(void) {
      if (eta_min > eta_max || phi_min > phi_max) {
         std::cout << "coordinates not set";
      } else {
         std::cout << "eta: (" << eta_min << ", " << eta_max << ")" << std::endl;
         std::cout << "phi: (" << phi_min << ", " << phi_max << ")" << std::endl;
      }

      return;
   }
};

// parseStationID
//    all aboard the jankmobile
// args:
//    std::string type     "CSC" / "MDT" / "RPC" / "TGC"
//    std::string group    "BIL", "BMG", etc.
//    int eta              +/- integer representing eta sector for chamber group
//    int phi              + integer representing phi sector for chamber group
// return:
//    std::string          e.g., "MDTBIL1A01"
std::string parseStationID(std::string type, std::string group, int eta, int phi) {
   std::stringstream stream;
   std::string side;
   std::string padding;

   // Determine A/B/C and send eta --> abs(eta)
   if (eta < 0) {
      side = "C";
      eta = -eta;
   } else if (eta == 0) {
      side = "B";
   } else if (eta > 0) {
      side = "A";
   } else {
      throw;
   }

   // Push string characters
   stream << type << group;

   // Push eta characters
   stream << eta << side;

   // Push phi characters
   if (phi >= 10) {
      padding = "";
   } else if (0 <= phi && phi < 10) {
      padding = "0";
   }

   stream << padding << phi;

   return stream.str();
}


// processBranch
//    iterators ho
void processBranch(std::map<std::string, Chamber>& stations,
                   std::string detType,
                   TTreeReaderValue< std::vector<std::string> >& NAME_,
                   TTreeReaderValue< std::vector<int> >& ETA_,
                   TTreeReaderValue< std::vector<int> >& PHI_,
                   TTreeReaderValue< std::vector<double> >&X_,
                   TTreeReaderValue< std::vector<double> >& Y_,
                   TTreeReaderValue< std::vector<double> >& Z_)
{
   // std::cout << detType << "-------" << std::endl;

   auto NAME = NAME_->begin();
   auto ETA = ETA_->begin();
   auto PHI = PHI_->begin();
   auto X = X_->begin();
   auto Y = Y_->begin();
   auto Z = Z_->begin();

   while (NAME != NAME_->end()) {
      // Get station ID
      std::string ID = parseStationID(detType, *NAME, *ETA, *PHI);

      // Check that the station ID exists ***
      if (0 == 1) { throw; }

      // Display xyz coordinates of hit
      // std::cout << ID << "\t" << *X << "\t" << *Y << "\t" << *Z << std::endl;

      // Calculate eta-phi coordinates of hit
      double r_temp = sqrt((*X) * (*X) + (*Y) * (*Y));
      double eta_temp = -log(tan(atan2(r_temp, *Z)/2.0));
      double phi_temp = atan2(*Y, *X);

      // Write to list of chambers
      stations[ID].hit(eta_temp, phi_temp);

      // Increment all iterators
      ++NAME;
      ++ETA;
      ++PHI;
      ++X;
      ++Y;
      ++Z;
   }
}


// coordinates
//    meat, potatoes, etc.
int coordinates(std::string ATLAS_VERSION)
{
   // ----------------------------------------------------------------------- //
   //    Setup
   // ----------------------------------------------------------------------- //

   // A map/dictionary of chambers, indexed by their ID (a 10-character string)
   std::map<std::string, Chamber> stations;

   // Generate stations from stations.txt (parsed from the XML file)
   // *** Not sure if this should be done beforehand, or whether we can infer
   //     these stations from the hits
   int linecount = 0;
   std::string stationID;
   std::ifstream stationFile("stations/stations.txt");

   while (stationFile >> stationID) {
      // Create a station with the ID given in the line
      stations[stationID] = Chamber();
   }

   // ----------------------------------------------------------------------- //
   //    Record hits from particle gun simulation
   // ----------------------------------------------------------------------- //

   // Loop over myNtuple.root (particle gun output) and collect hits
   // belonging to each detector element.

   // Read in the TTree from myNtuple.root
   TFile* f = TFile::Open("myNtuple.root");
   TTreeReader reader("NSWHitsTree", f);

   // Everything needed from the TTree
   TTreeReaderValue< std::vector<std::string> > CSC_NAME_(reader, "Hits_CSC_sim_stationName");
   TTreeReaderValue< std::vector<int> > CSC_ETA_(reader, "Hits_CSC_sim_stationEta");
   TTreeReaderValue< std::vector<int> > CSC_PHI_(reader, "Hits_CSC_sim_stationPhi");
   TTreeReaderValue< std::vector<double> > CSC_X_(reader, "Hits_CSC_hitGlobalPositionX");
   TTreeReaderValue< std::vector<double> > CSC_Y_(reader, "Hits_CSC_hitGlobalPositionY");
   TTreeReaderValue< std::vector<double> > CSC_Z_(reader, "Hits_CSC_hitGlobalPositionZ");

   TTreeReaderValue< std::vector<std::string> > MDT_NAME_(reader, "Hits_MDT_sim_stationName");
   TTreeReaderValue< std::vector<int> > MDT_ETA_(reader, "Hits_MDT_sim_stationEta");
   TTreeReaderValue< std::vector<int> > MDT_PHI_(reader, "Hits_MDT_sim_stationPhi");
   TTreeReaderValue< std::vector<double> > MDT_X_(reader, "Hits_MDT_hitGlobalPositionX");
   TTreeReaderValue< std::vector<double> > MDT_Y_(reader, "Hits_MDT_hitGlobalPositionY");
   TTreeReaderValue< std::vector<double> > MDT_Z_(reader, "Hits_MDT_hitGlobalPositionZ");

   TTreeReaderValue< std::vector<std::string> > RPC_NAME_(reader, "Hits_RPC_sim_stationName");
   TTreeReaderValue< std::vector<int> > RPC_ETA_(reader, "Hits_RPC_sim_stationEta");
   TTreeReaderValue< std::vector<int> > RPC_PHI_(reader, "Hits_RPC_sim_stationPhi");
   TTreeReaderValue< std::vector<double> > RPC_X_(reader, "Hits_RPC_hitGlobalPositionX");
   TTreeReaderValue< std::vector<double> > RPC_Y_(reader, "Hits_RPC_hitGlobalPositionY");
   TTreeReaderValue< std::vector<double> > RPC_Z_(reader, "Hits_RPC_hitGlobalPositionZ");

   TTreeReaderValue< std::vector<std::string> > TGC_NAME_(reader, "Hits_TGC_sim_stationName");
   TTreeReaderValue< std::vector<int> > TGC_ETA_(reader, "Hits_TGC_sim_stationEta");
   TTreeReaderValue< std::vector<int> > TGC_PHI_(reader, "Hits_TGC_sim_stationPhi");
   TTreeReaderValue< std::vector<double> > TGC_X_(reader, "Hits_TGC_hitGlobalPositionX");
   TTreeReaderValue< std::vector<double> > TGC_Y_(reader, "Hits_TGC_hitGlobalPositionY");
   TTreeReaderValue< std::vector<double> > TGC_Z_(reader, "Hits_TGC_hitGlobalPositionZ");

   // Iterate through all entries/particles, putting information from each hit
   // into the Chamber vector.
   int nEntries = 0;
   while (reader.Next()) {
      // std::cout << "Entry " << nEntries << ":" << std::endl;

      processBranch(stations, "CSC", CSC_NAME_, CSC_ETA_, CSC_PHI_, CSC_X_, CSC_Y_, CSC_Z_);
      processBranch(stations, "MDT", MDT_NAME_, MDT_ETA_, MDT_PHI_, MDT_X_, MDT_Y_, MDT_Z_);
      processBranch(stations, "RPC", RPC_NAME_, RPC_ETA_, RPC_PHI_, RPC_X_, RPC_Y_, RPC_Z_);
      processBranch(stations, "TGC", TGC_NAME_, TGC_ETA_, TGC_PHI_, TGC_X_, TGC_Y_, TGC_Z_);

      // Just do a few entries for now...
      if (nEntries++ >= 10) {
         break;
      }
   }

   // Random check
   stations["RPCBML4C06"].print();

   std::cout << "Number of entries: " << nEntries << std::endl;

   // Close "myNtuple.root"
   f->Close();

   // ----------------------------------------------------------------------- //
   //    Export eta/phi bounds
   // ----------------------------------------------------------------------- //

   // Generate a .txt file containing eta-phi coordinates for each chamber.
   std::fstream cscFile;
   std::fstream mdtFile;
   std::fstream rpcFile;
   std::fstream tgcFile;

   cscFile.open("geometries/" + ATLAS_VERSION + "/csccoords.txt", std::fstream::out);
   mdtFile.open("geometries/" + ATLAS_VERSION + "/mdtcoords.txt", std::fstream::out);
   rpcFile.open("geometries/" + ATLAS_VERSION + "/rpccoords.txt", std::fstream::out);
   tgcFile.open("geometries/" + ATLAS_VERSION + "/tgccoords.txt", std::fstream::out);

   // `it->first`    "key" for the Chamber element, equivalent to station ID
   // `it->second`   "value" for the Chamber element
   for (std::map<std::string, Chamber>::iterator it = stations.begin();
        it != stations.end();
        ++it) {
      // Check whether the chamber has received any hits.
      if (it->second.valid()) {
         // Generate string to add to the appropriate text file.
         std::stringstream stream;
         stream
         << it->first << " "
         << it->second.eta_min << " "
         << it->second.phi_min << " "
         << it->second.eta_max << " "
         << it->second.phi_max
         << "\n";

         // Add the string to the appropriate text file.
         std::string detType = it->first.substr(0, 3);

         if (detType == "CSC") {
            cscFile << stream.str();
         } else if (detType == "MDT") {
            mdtFile << stream.str();
         } else if (detType == "RPC") {
            rpcFile << stream.str();
         } else if (detType == "TGC") {
            tgcFile << stream.str();
         } else {
            throw;
         }
      }
   }

   cscFile.close();
   mdtFile.close();
   rpcFile.close();
   tgcFile.close();

   // ----------------------------------------------------------------------- //
   //    Clean up
   // ----------------------------------------------------------------------- //

   return 0;
}















#define gun_cxx	
#include <fstream>	
#include <iostream>
#include <string>
#include "gun.h"
#include <string>
#include <sstream>

//NOTE:
//Generates a root file with the ONLINE mdt station naming convention
//See https://twiki.cern.ch/twiki/bin/viewauth/Atlas/DifferencesInMDTOnlineAndOffline for the online/offline naming conventions.

namespace patch
{
    template < typename T > std::string to_string( const T& n )
    {
        std::ostringstream stm ;
        stm << n ;
        return stm.str() ;
    }
}

using namespace std;


void
gun::Loop () { 

int linecount = 0 ;
std::string line ;
std::ifstream infile("mdtstations.txt") ;
if ( infile ) {
	while ( getline( infile , line ) ) {
		string s1;
		string s2;
		string s3;
		string s4;
		string s3o;
		string s4o;
		string s4original;
		int s3i;
		int s4i;
		int s4originali;
		s1 = line.substr(0,3);
		std::cout << "s1 = " << s1 << '\n' ;
		s2 = line.substr(4,3);
		std::cout << "s2 = " << s2 << '\n' ;
		if (line.substr(8,1) == '-') {
			s3 = line.substr(8,2);
			s4 = line.substr(11,2);
			s4original = s4; // will use this value in the loop over hits
			s4i = atoi(s4.c_str());
			if (line.substr(6,1) == 'S') { //translation b/w offline and online phi sectors
				s4i = 2*s4i;
			}
			else if (line.substr(6,1) == 'L') {
				s4i = 2*s4i - 1;
			}
			s4 = patch::to_string(s4i);
			std::cout << "s3 = " << s3 << '\n' ; 
			std::cout << "s4 = " << s4 << '\n';
			s3o = line.substr(9,1) + "C"; //eta sector naming
			if (s4.length() == 1) {
				s4o = "0" + s4;
			}
			else {
			s4o = s4; //phi sector naming
			}
		}	
		else {
			s3 = line.substr(8,1);
			s4 = line.substr(10,2);
			s4original = s4; // will use this value in the loop over hits
			s4i = atoi(s4.c_str());
			if (line.substr(6,1) == 'S') { //translation b/w offline and online phi sectors
				s4i = 2*s4i;
			}
			else if (line.substr(6,1) == 'L') {
				s4i = 2*s4i - 1;
			}
			s4 = patch::to_string(s4i);
			std::cout << "s3 = " << s3 << '\n' ; 
			std::cout << "s4 = " << s4 << '\n';	
			s3o = s3 + "A"; //eta sector naming
			if (s4.length() == 1) {
				s4o = "0" + s4; //phi sector naming
			}
			else {
			s4o = s4;
			}
		}
		s3i = atoi(s3.c_str());
		s4originali = atoi(s4original.c_str());
		cout << "s3i = " << s3i << endl;
		cout << "s4i = " << s4i << endl;
		cout << "s4originali = " << s4originali << endl;

		//translations from offline to online stationname
		if ((s2 == "BML") && (s3o == "4A") && (s4o == "13")) { //1. BML(4A/C)13 offline = BML(5A/C)13 online
			s3o = "5A";
		}
		else if ((s2 == "BML") && (s3o == "4C") && (s4o == "13")) { //1. contd.
			s3o = "5C";
		}
		else if ((s2 == "BME") && (s3o == "1C") && (s4o == "13")) { //2. BME1C13 offline = BME4C13 online 
			s3o = "4C";
		}
		else if ((s2 == "BOE") && (s3o == "7A") && (s4o == "13")) { //3. BOE(7A/C)13 offline = BOL(3A/C)13 online 
			s2 = "BOL";
			s3o = "3A";
		}	
		else if ((s2 == "BOE") && (s3o == "7C") && (s4o == "13")) { //3. contd.
			s2 = "BOL";
			s3o = "3C";
		}	
		else if ((s2 == "EEL") && (s3o == "1A") && (s4o == "05")) { //4. EEL(1A/C)05 offline = EEL(2A/C)05 online
			s3o = "2A";
		}
		else if ((s2 == "EEL") && (s3o == "1C") && (s4o == "05")) { //4. contd.
			s3o = "2C";
		}
		else if ((s2 == "EIL") && (s3o == "4A") && (s4o == "01" || s4o == "09")) { //5. EIL(4A/C)(1/9) offline = EIL(5A/C)(1/9) online
			s3o = "5A";
		}
		else if ((s2 == "EIL") && (s3o == "4C") && (s4o == "01" || s4o == "09")) { //5. contd.
			s3o = "5C";
		}
		else if ((s2 == "EIL") && (s3o == "5A") && (s4o == "01" || s4o == "09")) { //6. EIL(5A/C)(1/9) offline = EIL(4A/C)(1/9) online
			s3o = "4A";
		}
		else if ((s2 == "EIL") && (s3o == "5C") && (s4o == "01" || s4o == "09")) { //6. contd.
			s3o = "4C";
		}
		else if ((s2 == "BOG") && (s3o == "1A") && (s4o == "12" || s4o == "14")) { //7. BOG(1-4 A/C)(12/14) offline = BOG(2,4,6,8 A/C)(12/14) online
			s3o = "2A";
		}
		else if ((s2 == "BOG") && (s3o == "1C") && (s4o == "12" || s4o == "14")) { //7. contd.
			s3o = "2C";
		}
		else if ((s2 == "BOG") && (s3o == "2A") && (s4o == "12" || s4o == "14")) { //7. contd.
			s3o = "4A";
		}
		else if ((s2 == "BOG") && (s3o == "2C") && (s4o == "12" || s4o == "14")) { //7. contd.
			s3o = "4C";
		}
		else if ((s2 == "BOG") && (s3o == "3A") && (s4o == "12" || s4o == "14")) { //7. contd.
			s3o = "6A";
		}
		else if ((s2 == "BOG") && (s3o == "3C") && (s4o == "12" || s4o == "14")) { //7. contd.
			s3o = "6C";
		}
		else if ((s2 == "BOG") && (s3o == "4A") && (s4o == "12" || s4o == "14")) { //7. contd.
			s3o = "8A";
		}
		else if ((s2 == "BOG") && (s3o == "4C") && (s4o == "12" || s4o == "14")) { //7. contd.
			s3o = "8C";
		}
		else if ((s2 == "BOF") && (s3o == "2A") && (s4o == "12" || s4o == "14")) { //8. BOF(1-4 A/C)(12/14) offline = BOF(1,3,5,7 A/C)(12/14) online
			s3o = "3A";
		}
		else if ((s2 == "BOF") && (s3o == "2C") && (s4o == "12" || s4o == "14")) { //8. contd.
			s3o = "3C";
		}
		else if ((s2 == "BOF") && (s3o == "3A") && (s4o == "12" || s4o == "14")) { //8. contd.
			s3o = "5A";
		}
		else if ((s2 == "BOF") && (s3o == "3C") && (s4o == "12" || s4o == "14")) { //8. contd.
			s3o = "5C";
		}
		else if ((s2 == "BOF") && (s3o == "4A") && (s4o == "12" || s4o == "14")) { //8. contd.
			s3o = "7A";
		}
		else if ((s2 == "BOF") && (s3o == "4C") && (s4o == "12" || s4o == "14")) { //8. contd.
			s3o = "7C";
		}
		std::string histname = s1 + s2 + s3o + s4o; 
		cout << "histname = " << histname << '\n';
		const char * name = histname.c_str();

		TH2D *hist=new TH2D(name, name , 128, -3, 3, 127, -3, 3);
		hist->SetXTitle("#eta");
		hist->SetYTitle("#phi");

		Long64_t nentries = fChain->GetEntriesFast ();
		cout << "Starting loop over " << nentries << " entries" << endl;
		for (Long64_t jentry=0; jentry < nentries; jentry++){ //nentries
        		Long64_t ientry = LoadTree (jentry); 
			int nb = fChain->GetEntry(jentry);

			for (Long64_t kentry =0; kentry < hits_mdt_hitglobposx->size(); kentry++) { 

				//cout << "xpos =" << hits_mdt_hitglobposx->at (kentry) << endl;
				//cout << "ypos =" << hits_mdt_hitglobposy->at(kentry) << endl;
				//cout << "zpos =" << hits_mdt_hitglobposz->at(kentry) << endl;
				//cout << "letters =" << hits_mdt_sim_stationname->at(kentry) << endl;
				//cout << "eta =" << hits_mdt_sim_stationeta->at(kentry) << endl;
				//cout << "phi =" << hits_mdt_sim_stationphi->at(kentry) << endl;
				if (s1 == "mdt") {		
					if ( (hits_mdt_sim_stationname->at(kentry) == s2)  && (hits_mdt_sim_stationeta->at(kentry) == s3i) && (hits_mdt_sim_stationphi->at(kentry) == s4originali) ) { 
						double x = hits_mdt_hitglobposx->at(kentry);
						//cout << "x= " << x << endl;
				   	 	double y = hits_mdt_hitglobposy->at(kentry);
						//cout << "y= " << y << endl;
						double z = hits_mdt_hitglobposz->at(kentry);
						//cout << "z= " << z << endl;
						double r     = sqrt(x*x + y*y);
						//cout << "r= " << r << endl;
						double phi   = atan2(y,x);
						//cout << "phi= " << phi << endl;
						double theta = atan2(r,z);
						//cout << "theta= " << theta << endl;
						double eta = -log(tan(theta/2.0));
						//cout << "eta= " << eta << endl;
						hist->Fill(eta, phi);
					}
				}
			}
		}
	//write hist to root file
	TFile *f = TFile::Open("mdthist.root","UPDATE"); 
	f->cd();
	if (entries != 0) {
		hist->Write("hist");
	}
	f->ls();
	f->Close(); 
	}
infile.close( ) ;
}
}

int 
main (const int argc, const char *const *const argv) 
{
TTree *t = 0;
	if (argc <= 1) {
     		return 0;
	}
	else if (argc > 1) {
		TFile *f = TFile::Open (argv[1]);
		t = (TTree *) gDirectory->Get ("NSWHitsTree");
	}
	gun gun(t);	
	gun.Loop ();
}

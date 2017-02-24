#define gun_cxx	
#include <fstream>	
#include <iostream>
#include <string>
#include "gun.h"
#include <string>
#include <sstream>

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

//loop function
void
gun::Loop () { 

int linecount = 0 ;
std::string line ;
//read in cscstations.txt
std::ifstream infile("cscstations.txt") ;
if ( infile ) {
	//parse cscstations.txt line by line from txt file as separate strings; each station receives a stationname i.e. "cscCSS1C08"
	while ( getline( infile , line ) ) {0
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
			s4original = s4;
			s4i = atoi(s4.c_str());
			if (line.substr(6,1) == 'S') {
				s4i = 2*s4i;
			}
			else if (line.substr(6,1) == 'L') {
				s4i = 2*s4i - 1;
			}
			s4 = patch::to_string(s4i);
			std::cout << "s3 = " << s3 << '\n' ; 
			std::cout << "s4 = " << s4 << '\n'; 
			s3o = line.substr(9,1) + "C";	
			if (s4.length() == 1) {
				s4o = "0" + s4;
			}
			else {
			s4o = s4;
			}
		}	
		else {
			s3 = line.substr(8,1);
			s4 = line.substr(10,2);
			s4original = s4;
			s4i = atoi(s4.c_str());
			if (line.substr(6,1) == 'S') {
				s4i = 2*s4i;
			}
			else if (line.substr(6,1) == 'L') {
				s4i = 2*s4i - 1;
			}
			s4 = patch::to_string(s4i);
			std::cout << "s3 = " << s3 << '\n' ; 
			std::cout << "s4 = " << s4 << '\n';	
			s3o = s3 + "A";
			if (s4.length() == 1) {
				s4o = "0" + s4;
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
		std::string histname = s1 + s2 + s3o + s4o;
		cout << "histname = " << histname << '\n';
		const char * name = histname.c_str();
		//define an eta phi histogram
		TH2D *hist=new TH2D(name, name , 128, -3, 3, 127, -3, 3);
		hist->SetXTitle("#eta");
		hist->SetYTitle("#phi");

		Long64_t nentries = fChain->GetEntriesFast ();
		//loop over myNtuple1.root (particle gun output) hits to collect those belonging to that detector element
		cout << "Starting loop over " << nentries << " entries" << endl;
		for (Long64_t jentry=0; jentry < nentries; jentry++){ 
        		Long64_t ientry = LoadTree (jentry); 
			int nb = fChain->GetEntry(jentry);
			for (Long64_t kentry =0; kentry < hits_csc_hitglobposx->size(); kentry++) { 
				//cout << "xpos =" << hits_mdt_hitglobposx->at (kentry) << endl;
				//cout << "ypos =" << hits_mdt_hitglobposy->at(kentry) << endl;
				//cout << "zpos =" << hits_mdt_hitglobposz->at(kentry) << endl;
				//cout << "letters =" << hits_mdt_sim_stationname->at(kentry) << endl;
				//cout << "eta =" << hits_mdt_sim_stationeta->at(kentry) << endl;
				//cout << "phi =" << hits_mdt_sim_stationphi->at(kentry) << endl;
				if (s1 == "csc") {		
					if ( (hits_csc_sim_stationname->at(kentry) == s2)  && (hits_csc_sim_stationeta->at(kentry) == s3i) && (hits_csc_sim_stationphi->at(kentry) == s4originali) ) { //then we fill the hist with that hit's eta, phi value.
						double x = hits_csc_hitglobposx->at(kentry);
						//cout << "x= " << x << endl;
				   	 	double y = hits_csc_hitglobposy->at(kentry);
						//cout << "y= " << y << endl;
						double z = hits_csc_hitglobposz->at(kentry);
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
	TFile *f = TFile::Open("cschist0.root","UPDATE"); 
	f->cd();
	int entries = hist->GetEntries();
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

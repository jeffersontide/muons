#include <iostream>
#include <TH2.h>
#include "TFile.h"
#include <TKey.h>
#include <TClass.h>
#include <TROOT.h>
#include <string>
#include "TApplication.h"
#include <TBox.h>
#include <math.h>

//generates a .txt file with stationname and HTML rect coords for each histogram in the input .root file.

using namespace std;

void displaycoord() {

   TFile *f1 = TFile::Open("offlinemdt.root");
   TIter next(f1->GetListOfKeys());
   TKey *key;
   std::vector<double> xmin;
   std::vector<double> ymin;
   std::vector<double> xmax;
   std::vector<double> ymax;
   std::vector<string> name;
   while ((key = (TKey*)next())) {
      string hname;
      TClass *cl = gROOT->GetClass(key->GetClassName());
      if (!cl->InheritsFrom("TH2")) continue;
      TH2 *h = (TH2*)key->ReadObj();
      hname = h->GetName();
      cout << "hist = " << hname << endl;
      double llx, ulx;
      llx = h->GetXaxis()->GetBinCenter(h->FindFirstBinAbove(0,1));
      ulx = h->GetXaxis()->GetBinCenter(h->FindLastBinAbove(0,1));
      double lly, uly;
      lly = h->GetYaxis()->GetBinCenter(h->FindFirstBinAbove(0,2));
      uly = h->GetYaxis()->GetBinCenter(h->FindLastBinAbove(0,2));
      //cout << "lower limit x= " << llx << endl;
      //cout << "lower limit y= " << lly << endl;
      //cout << "upper limit x= " << ulx << endl; 
      //cout << "upper limit y= " << uly << endl; 
      xmin.push_back(llx);
      ymin.push_back(lly);
      xmax.push_back(ulx);
      ymax.push_back(uly); 
      name.push_back(hname);
   }
   int n;
   //hard-coded to fit the ATLAS webdisplay single eta-phi plot.
   double ipx0 = 74; 
   double ipy0 = 153; 
   double xnpx = 400; //without shifting for origin, number of pixels in the grid in x.
   double xnpy = 336; //npixels in grid in y

   string sname;
   double xpxmin;
   double xpxmax;
   double xpymin;
   double xpymax;
   int ipxmin;
   int ipxmax;
   int ipymin;
   int ipymax;
   double b;
   n = xmin.size();
   b = 3.0;
   FILE *fp;
   fp = fopen("mdtoffcoords.txt", "w");
   for (int i = 0; i < n; i++ ) { 
	sname = name[i];
 	xpxmin = ipx0 + (xnpx/6.0)*(xmin[i] + b);
 	xpxmax = ipx0 + (xnpx/6.0)*(xmax[i] + b);
 	xpymin = ipy0 + (xnpy/6.0)*(-ymin[i] + b);
 	xpymax = ipy0 + (xnpy/6.0)*(-ymax[i] + b);
 	ipxmin = floor(xpxmin);
 	ipxmax = ceil(xpxmax);
 	ipymin = floor(xpymin);
 	ipymax = ceil(xpymax);
	fprintf(fp, "%s %3d %3d %3d %3d \n", sname.c_str(), ipxmin, ipymax, ipxmax, ipymin); 
   } 
}


int
main() 
{
TApplication *a = new TApplication("a", 0, 0);
displaycoord();
return 0;
}


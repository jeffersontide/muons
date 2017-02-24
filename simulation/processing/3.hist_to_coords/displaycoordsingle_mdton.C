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

void displaycoord_mdton() {

   TFile *f1 = TFile::Open("mdthist.root");
   TIter next(f1->GetListOfKeys());
   TKey *key;
   std::vector<double> xmin;
   std::vector<double> ymin;
   std::vector<double> xmax;
   std::vector<double> ymax;
   std::vector<string> name;

   double xmin_limit = 0;
   double xmax_limit = 0;
   double ymin_limit = 0;
   double ymax_limit = 0;

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

      cout << "lower limit x= " << llx << endl;
      cout << "lower limit y= " << lly << endl;
      cout << "upper limit x= " << ulx << endl;
      cout << "upper limit y= " << uly << endl;

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
   double ipxmin;
   double ipxmax;
   double ipymin;
   double ipymax;
   double b;
   n = xmin.size();
   b = 3.0;
   FILE *fp;
   fp = fopen("mdtoncoords.txt", "w");
   for (int i = 0; i < n; i++ ) { 
      sname = name[i];
      xpxmin = xmin[i]; // ipx0 + (xnpx/6.0)*(xmin[i] + b);
      xpxmax = xmax[i]; // ipx0 + (xnpx/6.0)*(xmax[i] + b);
      xpymin = ymin[i]; // ipy0 + (xnpy/6.0)*(-ymin[i] + b);
      xpymax = ymax[i]; // ipy0 + (xnpy/6.0)*(-ymax[i] + b);
      ipxmin = xpxmin; // floor(xpxmin);
      ipxmax = xpxmax; // ceil(xpxmax);
      ipymin = xpymin; // floor(xpymin);
      ipymax = xpymax; // ceil(xpymax);

      /***/

      // keep running track of bounding box
      if (xmin[i] < xmin_limit) {
         xmin_limit = xmin[i];
      }

      if (xmax[i] > xmax_limit) {
         xmax_limit = xmax[i];
      }

      if (xmax[i] < xmin_limit) {
         xmin_limit = xmax[i];
      }

      if (xmin[i] > xmax_limit) {
         xmax_limit = xmin[i];
      }

      if (ymin[i] < ymin_limit) {
         ymin_limit = ymin[i];
      }

      if (ymax[i] > ymax_limit) {
         ymax_limit = ymax[i];
      }

      if (ymax[i] < ymin_limit) {
         ymin_limit = ymax[i];
      }

      if (ymin[i] > ymax_limit) {
         ymax_limit = ymin[i];
      }


      fprintf(fp, "%s %4f %4f %4f %4f \n", sname.c_str(), ipxmin, ipymax, ipxmax, ipymin);
   }

   // print bounding box
   cout << "bounding box (x1, y1, x2, y2): "
            << xmin_limit << ", "
            << ymin_limit << ", "
            << xmax_limit << ", "
            << ymax_limit
            << endl;
}


int
displaycoordsingle_mdton()
{
TApplication *a = new TApplication("a", 0, 0);
displaycoord_mdton();
return 0;
}


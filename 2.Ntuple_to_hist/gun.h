#ifndef gun_h
#define gun_h

#include <vector>
#include <TROOT.h>
#include <TChain.h>
#include <TFile.h>

#include <cstring>
#include <string>
#include <TDirectory.h>
#include <TTree.h>
#include <TH1F.h>
#include <TH2F.h>

using namespace std;

class gun
{
  public:TTree * fChain;	//pointer to the analyzed TTree or TChain
  Int_t fCurrent;		//current Tree number in a TChain

  // Declaration of leaf types
  UInt_t runnumber;
  vector<double>*hits_mdt_hitglobposx;
  vector<double>*hits_mdt_hitglobposy;
  vector<double>*hits_mdt_hitglobposz;
  vector<string>*hits_mdt_sim_stationname;
  vector<int>*hits_mdt_sim_stationeta;
  vector<int>*hits_mdt_sim_stationphi;


  vector<double>*hits_csc_hitglobposx;
  vector<double>*hits_csc_hitglobposy;
  vector<double>*hits_csc_hitglobposz;
  vector<string>*hits_csc_sim_stationname;
  vector<int>*hits_csc_sim_stationeta;
  vector<int>*hits_csc_sim_stationphi;

  vector<double>*hits_rpc_hitglobposx;
  vector<double>*hits_rpc_hitglobposy;
  vector<double>*hits_rpc_hitglobposz;
  vector<string>*hits_rpc_sim_stationname;
  vector<int>*hits_rpc_sim_stationeta;
  vector<int>*hits_rpc_sim_stationphi;
  vector<int>*hits_rpc_sim_doubletr;
  vector<int>*hits_rpc_off_doubletr;

  vector<double>*hits_tgc_hitglobposx;
  vector<double>*hits_tgc_hitglobposy;
  vector<double>*hits_tgc_hitglobposz;
  vector<string>*hits_tgc_sim_stationname;
  vector<int>*hits_tgc_sim_stationeta;
  vector<int>*hits_tgc_sim_stationphi;

    
  // Declaration of branches
  TBranch *b_eventnumber;		
  TBranch *b_hits_mdt_hitglobposx;		
  TBranch *b_hits_mdt_hitglobposy;		
  TBranch *b_hits_mdt_hitglobposz;		
  TBranch *b_hits_mdt_sim_stationname;		
  TBranch *b_hits_mdt_sim_stationeta;		
  TBranch *b_hits_mdt_sim_stationphi;		

  TBranch *b_hits_csc_hitglobposx;		
  TBranch *b_hits_csc_hitglobposy;		
  TBranch *b_hits_csc_hitglobposz;		
  TBranch *b_hits_csc_sim_stationname;		
  TBranch *b_hits_csc_sim_stationeta;		
  TBranch *b_hits_csc_sim_stationphi;		

  TBranch *b_hits_rpc_hitglobposx;		
  TBranch *b_hits_rpc_hitglobposy;		
  TBranch *b_hits_rpc_hitglobposz;		
  TBranch *b_hits_rpc_sim_stationname;		
  TBranch *b_hits_rpc_sim_stationeta;		
  TBranch *b_hits_rpc_sim_stationphi;		
  TBranch *b_hits_rpc_sim_doubletr;
  TBranch *b_hits_rpc_off_doubletr;

  TBranch *b_hits_tgc_hitglobposx;		
  TBranch *b_hits_tgc_hitglobposy;	
  TBranch *b_hits_tgc_hitglobposz;		
  TBranch *b_hits_tgc_sim_stationname;		
  TBranch *b_hits_tgc_sim_stationeta;
  TBranch *b_hits_tgc_sim_stationphi;		

  gun (TTree * tree = 0);
  virtual ~ gun ();
  virtual double GetEntry (Long64_t entry);
  virtual Long64_t LoadTree (Long64_t entry);
  virtual void Init (TTree * tree);
  virtual Bool_t Notify ();
  virtual void Loop ();
};

#endif

#ifdef gun_cxx
gun::gun (TTree * tree)
{
  Init (tree);
}

gun::~gun () {
  if (!fChain)
    return;
  delete fChain->GetCurrentFile ();
}

double
gun::GetEntry (Long64_t entry) {
// Read contents of entry.
  if (!fChain)
    return 0;
  return fChain->GetEntry (entry);
}

Long64_t
gun::LoadTree (Long64_t entry) {
// Set the environment to read one entry
  if (!fChain)
    return -5;
  Long64_t centry = fChain->LoadTree (entry);
  if (centry < 0)
    return centry;
  if (!fChain->InheritsFrom (TChain::Class ()))
    return centry;
  TChain *chain = (TChain *) fChain;
  if (chain->GetTreeNumber () != fCurrent)
    {
      fCurrent = chain->GetTreeNumber ();
      Notify ();
    }
  return centry;
}

void
gun::Init (TTree * tree) {
  // The Init() function is called when the selector needs to initialize
  // a new tree or chain. Typically here the branch addresses and branch
  // pointers of the tree will be set.

  // Set branch addresses and branch pointers
  hits_mdt_hitglobposx = 0;
  hits_mdt_hitglobposy = 0;
  hits_mdt_hitglobposz = 0;
  hits_mdt_sim_stationname= 0;
  hits_mdt_sim_stationeta=0;
  hits_mdt_sim_stationphi=0;

  hits_csc_hitglobposx = 0;
  hits_csc_hitglobposy = 0;
  hits_csc_hitglobposz = 0;
  hits_csc_sim_stationname= 0;
  hits_csc_sim_stationeta=0;
  hits_csc_sim_stationphi=0;

  hits_rpc_hitglobposx = 0;
  hits_rpc_hitglobposy = 0;
  hits_rpc_hitglobposz = 0;
  hits_rpc_sim_stationname= 0;
  hits_rpc_sim_stationeta=0;
  hits_rpc_sim_stationphi=0;
  hits_rpc_sim_doubletr=0;
  hits_rpc_off_doubletr=0;

  hits_tgc_hitglobposx = 0;
  hits_tgc_hitglobposy = 0;
  hits_tgc_hitglobposz = 0;
  hits_tgc_sim_stationname= 0;
  hits_tgc_sim_stationeta=0;
  hits_tgc_sim_stationphi=0;




  if (!tree)
    return;
  fChain = tree;
  fCurrent = -1;
  fChain->SetMakeClass (1);
//globpos branches
  fChain->SetBranchAddress ("Hits_MDT_hitGlobalPositionX", &hits_mdt_hitglobposx, &b_hits_mdt_hitglobposx);
  fChain->SetBranchAddress ("Hits_MDT_hitGlobalPositionY", &hits_mdt_hitglobposy, &b_hits_mdt_hitglobposy);
  fChain->SetBranchAddress ("Hits_MDT_hitGlobalPositionZ", &hits_mdt_hitglobposz, &b_hits_mdt_hitglobposz);

  fChain->SetBranchAddress ("Hits_CSC_hitGlobalPositionX", &hits_csc_hitglobposx, &b_hits_csc_hitglobposx);
  fChain->SetBranchAddress ("Hits_CSC_hitGlobalPositionY", &hits_csc_hitglobposy, &b_hits_csc_hitglobposy);
  fChain->SetBranchAddress ("Hits_CSC_hitGlobalPositionZ", &hits_csc_hitglobposz, &b_hits_csc_hitglobposz);

  fChain->SetBranchAddress ("Hits_RPC_hitGlobalPositionX", &hits_rpc_hitglobposx, &b_hits_rpc_hitglobposx);
  fChain->SetBranchAddress ("Hits_RPC_hitGlobalPositionY", &hits_rpc_hitglobposy, &b_hits_rpc_hitglobposy);
  fChain->SetBranchAddress ("Hits_RPC_hitGlobalPositionZ", &hits_rpc_hitglobposz, &b_hits_rpc_hitglobposz);

  fChain->SetBranchAddress ("Hits_TGC_hitGlobalPositionX", &hits_tgc_hitglobposx, &b_hits_tgc_hitglobposx);
  fChain->SetBranchAddress ("Hits_TGC_hitGlobalPositionY", &hits_tgc_hitglobposy, &b_hits_tgc_hitglobposy);
  fChain->SetBranchAddress ("Hits_TGC_hitGlobalPositionZ", &hits_tgc_hitglobposz, &b_hits_tgc_hitglobposz);

//simstation branches
  fChain->SetBranchAddress ("Hits_MDT_sim_stationName", &hits_mdt_sim_stationname, &b_hits_mdt_sim_stationname);
  fChain->SetBranchAddress ("Hits_MDT_sim_stationEta", &hits_mdt_sim_stationeta, &b_hits_mdt_sim_stationeta); 
  fChain->SetBranchAddress ("Hits_MDT_sim_stationPhi", &hits_mdt_sim_stationphi, &b_hits_mdt_sim_stationphi);

  fChain->SetBranchAddress ("Hits_CSC_sim_stationName", &hits_csc_sim_stationname, &b_hits_csc_sim_stationname);
  fChain->SetBranchAddress ("Hits_CSC_sim_stationEta", &hits_csc_sim_stationeta, &b_hits_csc_sim_stationeta); 
  fChain->SetBranchAddress ("Hits_CSC_sim_stationPhi", &hits_csc_sim_stationphi, &b_hits_csc_sim_stationphi);

  fChain->SetBranchAddress ("Hits_RPC_sim_stationName", &hits_rpc_sim_stationname, &b_hits_rpc_sim_stationname);
  fChain->SetBranchAddress ("Hits_RPC_sim_stationEta", &hits_rpc_sim_stationeta, &b_hits_rpc_sim_stationeta); 
  fChain->SetBranchAddress ("Hits_RPC_sim_stationPhi", &hits_rpc_sim_stationphi, &b_hits_rpc_sim_stationphi);
  fChain->SetBranchAddress ("Hits_RPC_sim_doubletR", &hits_rpc_sim_doubletr, &b_hits_rpc_sim_doubletr);
  fChain->SetBranchAddress ("Hits_RPC_off_doubletR", &hits_rpc_off_doubletr, &b_hits_rpc_off_doubletr);

  fChain->SetBranchAddress ("Hits_TGC_sim_stationName", &hits_tgc_sim_stationname, &b_hits_tgc_sim_stationname);
  fChain->SetBranchAddress ("Hits_TGC_sim_stationEta", &hits_tgc_sim_stationeta, &b_hits_tgc_sim_stationeta); 
  fChain->SetBranchAddress ("Hits_TGC_sim_stationPhi", &hits_tgc_sim_stationphi, &b_hits_tgc_sim_stationphi);
  cout << "Set branch addresses." << endl;

  Notify ();
}

Bool_t
gun::Notify ()
{
  // The Notify() function is called when a new file is opened. 

  return kTRUE;
}

#endif // #ifdef gun_cxx

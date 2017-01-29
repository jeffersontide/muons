# offlineToOnline.py

# ugh terrible deal with it
# why are some of the TGC's showing up as gray in persint, also why do they
#    overlap in weird ways

# Any station can be classified by:
# - type             "csc", "mdt"
# - subtype          "EIS", "CSL", "T4E" etc.
# - position         "E" or "F"
# - phi sector       usually 1..8
# - eta sector       usually +-1
# - phi subsector    usually 1
# - eta subsector    usually 1, but becomes important for big ribs/plates
# - rpc-specific: dR1/dR2     detectors are stacked radially atop each other

def offlineToOnline(id, detectorType):
   if detectorType == "csc":
      # offline:	(CS)(L)(A)(08)		(CSC)(Large/Small)(A/C)(sector 1-8)
      # online:	(CS)(L)(A)(16)		(CSC)(Large/Small)(A/C)(sector 1-16)
      # CS (S,L) F (1,2) Z (+,-) 1

      # split id string
      stationType   = id[0:3]      # CS (S / L)
      stationPos    = id[3]        # F
      stationPhi    = id[4]        # 1 / 2
      stationEta    = id[5:6]      # Z+ / Z-
      stationSubPhi = id[7]        # 1
      stationSubEta = None

   if detectorType == "mdt":
      # default phi range is 1..8
      #       phi      eta
      # EIS            +-1..2
      # EOS            +-1..6
      # EOL            +-1..6
      # EMS            +-1..5
      # EML            +-1..5
      # EIL            +-1..4  * phi1 & phi5 have eta 1..5
      # BOG   6..7      -4..4
      # BOF   6..7      -4..4  * does not include eta=0
      # BMF   6..7     * phi6: +-(1..3) / phi7: (-1, +-2, +-3)
      # BEE            +-1..2
      # BIR   6,8      * phi6: +-(1..6) / phi8: +-(2..6)
      # BIM   6,8      +-1..5
      # BOS   -6,-7    +-1..6
      # BOL            +-1..6
      # BMS   -6,-7    +-1..6
      # BML            +-1..6 # phi7: +-(1..5)
      # BIS            +-1..8
      # BIL   -6,-8    +-1..6

      # split id string
      stationType   = id[0:3]    # EOL, BIS, etc.
      stationPos    = id[3]      # F
      stationPhi    = id[4]
      stationEta    = id[5:6]    # Z+ / Z-
      stationSubPhi = None
      stationSubEta = id[7]

   if detectorType == "rpc":
      # do this later

   if detectorType == "tgc":
      # Nearest to beamline:
      # - F, E
      # - Eta 1, 2, 3, 4, 5
      #
      # Naming:  T (1..4) (E,F) F (1..8) Z (+,-)
      # - T1FF                      (1..6)
      # - T1EF                      (1..6) [Eta (1..4)]
      # - T2FF                      (1..6)
      # - T2EF                      (1..6) [Eta (1..5)]
      # - T3FF                      (1..6)
      # - T3EF                      (1..6) [Eta (1..5)]
      # - T4FF                      (1..6)
      # - T4EF                      (1..3)*
      #
      # * except for sectors 4,6,8 which have only 2 subdivisions each
      #
      # e.g. T2EF3Z+4 (eta=3)

      # split id string
      stationType   = id[0:3]    # T (1..4) (E/F)
      stationPos    = id[3]      # F
      stationPhi    = id[4]      # (1..8)
      stationEta    = id[5:6]    # Z+ / Z-
      stationSubPhi = id[7]      # (1..6) except for T4EF
      stationSubEta = None      # this will probably fuck up too































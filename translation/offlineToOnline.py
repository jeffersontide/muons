# offlineToOnline.py

# ugh terrible deal with it
# why are some of the TGC's showing up as gray in persint, also why do they
#    overlap in weird ways

# Any station (s) can be classified by:
# - type             "csc", "mdt"
# - subtype          "EIS", "CSL", "T4E" etc.
# - position         "E" or "F"
# - phi sector       usually 1..8
# - eta sector       usually +-1
# - phi subsector    usually 1
# - r layer          when detectors are stacked radially atop each other (rpcs and some mdts)

def offlineToOnline(id, detectorType, inputType):
   if detectorType == "csc":
      # eta = +/- 1
      #
      # web:      (CS)(L/S)(|eta|)(A/C)(staggerPhi)
      # offline:	(CS)(L/S)F(phi)
      # online: 	(CS)(L/S)(|eta|)(A/C)(staggerPhi)
      #
      # phi:         1  1  2  2  3  3  4  4
      # size:        L  S  L  S  L  S  L  S
      # staggerPhi:  01 02 03 04 05 06 07 08
      #
      # phi:         5  5  6  6  7  7  8  8
      # size:        L  S  L  S  L  S  L  S
      # staggerPhi:  09 10 11 12 13 14 15 16

      # split id string
      sType   = id[0:3]      # CS (S / L)
      sPos    = id[3]        # F
      sPhi    = id[4]        # 1..8
      sEta    = id[6:7]      # Z (+ / -) 1
      sSubEta = None

   # https://twiki.cern.ch/twiki/bin/viewauth/Atlas/DifferencesInMDTOnlineAndOffline
   if detectorType == "mdt":
      # default phi range is 1..8
      #       phi      eta
      # EIS            +-1..2
      # EOS            +-1..6
      # EOL            +-1..6
      # EMS            +-1..5
      # EML            +-1..5
      # EIL            +-1..4  * phi1 & phi5 have eta 1..5
      # BOG   6..7      -4..4  * INCLUDES eta=0
      # BOF   6..7     +-1..4
      # BMF   6..7     +-1..3
      # BEE            +-1..2
      # BIR   6,8      * phi6: +-(1..6) / phi8: +-(2..6)
      # BIM   6,8      +-1..5
      # BOS   -6,-7    +-1..6
      # BOL            +-1..6
      # BMS   -6,-7    +-1..6
      # BML            +-1..6 # phi7: +-(1..5)
      # BIS            +-1..8
      # BIL   -6,-8    +-1..6

      # split id string from persint (offline)
      # sType   = id[0:3]    # EOL, BIS, etc.
      # sPos    = id[3]      # F
      # sPhi    = id[4]
      # sEta    = id[6:7]    # -1, +3, etc.
      # sSubPhi = None

      # web:         XXX(|eta|)(A/B/C)(0 phi)
      # online:      XXX(|eta|)(A/B/C)(phi *2)
      # offline:     XXXF(phi)Z(eta)

      sType = id[0:3]

      if sType == "BIL":
         # online: (phi *2 -1)

      elif sType == "BIS":
         #

      elif sType == "BML":
         # online: (phi *2 -1)

      elif sType == "BMS":
         #

      elif sType == "BOL":
         # online: (phi *2 -1)

      elif sType == "BOS":
         #

      elif sType == "BIM":
         # online: (phi *2 -1)

      elif sType == "BIR":
         # online: (phi *2 -1)

      elif sType == "BEE":
         #

      elif sType == "BMF":
         #

      elif sType == "BOF":
         # online: (|eta| *2 -1)

      elif sType == "BOG":
         # online: (|eta| *2)

      elif sType == "EIL":
         # online: (phi *2 -1)

      elif sType == "EEL":
         # online: (phi *2 -1)
         if phi == 3:
            eta = 2        # only one eta sector

      elif sType == "EES":
         #

      elif sType == "EML":
         # online: (phi *2 -1)

      elif sType == "EMS":
         #

      elif sType == "EOL":
         # online: (phi *2 -1)

      elif sType == "EOS":
         #

      elif sType == "EIS":
         #

      else:
         # throw a fit

   if detectorType == "rpc":
      #TODO

   # http://atlas-proj-tgc.web.cern.ch/atlas-proj-tgc/doc/numbering.pdf
   if detectorType == "tgc":
      # Nearest to beamline:
      # - F, E
      # - Eta 1, 2, 3, 4, 5
      #
      # Naming:  T (1..4) (E,F) F (1..8) Z (+,-)
      #
      # - T1FF      (1..6)
      # - T1EF      (1..6) [Eta (1..4)]
      # - T2FF      (1..6)
      # - T2EF      (1..6) [Eta (1..5)]
      # - T3FF      (1..6)
      # - T3EF      (1..6) [Eta (1..5)]
      # - T4FF      (1..6)
      # - T4EF      (1..3)*
      #
      # * except for sectors 4,6,8 which have only 2 subdivisions each
      #
      #
      # F type:
      #        eta:    +/- 1
      #        phi:    (1-8) stretched
      #        subPhi: (1-6) repeating
      #        SIPhi:  (24, 1, 2, 3, ..., 23)   # single index
      #
      #   web:       (XXF)(|eta|)(A/C)(SIPhi)
      #   offline:   (XXF)F(phi)Z(sgn(eta))(subPhi)
      #   online:
      #
      #
      # E type:
      #        phi:     (1-8) stretched
      #        subPhi:  (1-6) repeating
      #        SIPhi:   (47, 48, 1, 2, 3, ..., 46)
      #
      #     web:        (XXE)(|eta|)(A/C)(SIPhi)
      #     offline:    (XXE)F(phi)Z(sgn(eta))(subPhi)     (eta separate)
      #     online:
      #
      # Offline --> online translation:
      #
      #

      # split id string
      sType   = id[0:3]    # T (1..4) (E/F)
      sPos    = id[3]      # F
      sPhi    = id[4]      # (1..8)
      sEta    = id[6]      # +/-
      sSubPhi = id[7]      # (1..6)


































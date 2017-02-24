# offlineToOnline.py

# ugh terrible

# google for general info leads to:
#  http://atlas.web.cern.ch/Atlas/GROUPS/MUON/TDR/pdf_final/naming.pdf
#  - region     B/E/F    Barrel/Endcap/Forward
#  - station    I/E/M/O  Inner/Extra/Middle/Outer
#  - size       L/S      Large/Small

# main classifications:
# - type             "csc", "mdt"
# - subtype          "EIS", "CSL", "T4E" etc.
# - phi sector       usually 1..8
# - eta sector       usually +-1
# - phi subsector    usually 1

def offlineToOnline(id, detectorType, inputType):
   if detectorType == "csc":
      # eta = +/- 1
      #
      # web:      (CS)(L/S)(|eta|)(A/C)(staggerPhi)
      # online: 	(CS)(L/S)(|eta|)(A/C)(staggerPhi)
      # offline:	(CS)(L/S)F(phi)Z(eta)
      #
      # phi:         1  1  2  2  3  3  4  4
      # size:        L  S  L  S  L  S  L  S
      # staggerPhi:  01 02 03 04 05 06 07 08
      #
      # phi:         5  5  6  6  7  7  8  8
      # size:        L  S  L  S  L  S  L  S
      # staggerPhi:  09 10 11 12 13 14 15 16
      return

   if detectorType == "mdt":
      # later: check against https://twiki.cern.ch/twiki/bin/viewauth/Atlas/DifferencesInMDTOnlineAndOffline
      #
      # default phi range is 1..8
      # * = phi odd when switching to online phi count
      #
      #       phi      eta
      # EIS            +-1..2
      # EOS            +-1..6
      # EOL*           +-1..6
      # EMS            +-1..5
      # EML*           +-1..5
      # EES            +-2
      # EEL*           +-2     * phi3 only has eta 1
      # EIL*           +-1..4  * phi1 & phi5 have eta 1..5
      # BOG   6..7      -4..4  * INCLUDES eta=0    (|eta| *2)
      # BOF   6..7     +-1..4  * (|eta| *2 -1)
      # BMF   6..7     +-1..3
      # BEE            +-1..2
      # BIR*  6,8      * phi6: +-(1..6) / phi8: +-(2..6)
      # BIM*  6,8      +-1..5
      # BOS   -6,-7    +-1..6
      # BOL*           +-1..6
      # BMS   -6,-7    +-1..6
      # BML*           +-1..6 # phi7: +-(1..5)
      # BIS            +-1..8
      # BIL*  -6,-8    +-1..6

      # online follows persint, whose lookup table is stored in 'mdt lookup.txt'
      # web:         (XXX)(|eta|)(A/B/C)(0 phi)
      # online:      (XXX)(|eta|)(A/B/C)(phi *2)
      # offline:     (XXX)F(phi)Z(eta)
      return

   if detectorType == "rpc":
      # online taken from persint, but can't find the table this time ???
      #
      # web:      (XXX)(|eta|)(A/B/C)(0 phi)
      # online:   (XXX)(|eta|)(A/B/C)(phi *2 -(odd))
      # offline:  (XXX)F(phi)Z(+-eta)
      #
      # phi default (1..8)
      #
      # XXX:      phi:        eta range:
      # BML*                  +-7
      # BMS       -6,-7       +-6
      # BMF       6,7         +-3
      # BOL*                  +-6
      # BOS       -6,-7       +-6
      # BOF       6,7         +-4           |eta| -> *2 -1
      # BOG       6,7         +-4           |eta| -> *2, includes 0B
      return

   if detectorType == "tgc":
      # Online convention taken from http://atlas-proj-tgc.web.cern.ch/atlas-proj-tgc/doc/numbering.pdf and Masato's email
      #
      #
      # Nearest to beamline:
      # - F, E
      # - Eta 1, 2, 3, 4, 5 (offline)
      # - Eta 5, 4, 3, 2, 1 (online)
      #
      # Nearest to z=0:
      # T4, T1, T2, T3 (I, M1, M2, M3 for online)
      #
      #
      #  subtype    subphi
      # - T1FF      (1..6)
      # - T1EF      (1..6) [Eta (1..4)]
      # - T2FF      (1..6)
      # - T2EF      (1..6) [Eta (1..5)]
      # - T3FF      (1..6)
      # - T3EF      (1..6) [Eta (1..5)]
      # - T4FF      (1..6)
      # - T4EF      (1..3)*
      #
      # * except for sectors 4,6,8 which have only 2 subdivisions each (see below)
      #
      #
      # E type:
      #        eta:     see above for range
      #        phi:     (1-8) stretched
      #        subPhi:  (1-6) repeating
      #        SIPhi:   (47, 48, 1, 2, 3, ..., 46)
      #
      #     web:        (XX)E(|eta|)(A/C)(SIPhi)
      #     online:     (YY)E(|eta|)(A/C)(SIPhi)*
      #     offline:    (XX)EF(phi)Z(sgn(eta))(subPhi)     (eta separate)
      #
      #
      # F type:
      #        eta:    +/- 1
      #        phi:    (1-8) stretched
      #        subPhi: (1-6) repeating
      #        SIPhi:  (24, 1, 2, 3, ..., 23)   # single index
      #
      #   web:       (XX)F(|eta|)(A/C)(SIPhi)
      #   online:    (YY)F(|eta|)(A/C)(SIPhi)*
      #   offline:   (XX)FF(phi)Z(sgn(eta))(subPhi)
      #
      #
      # *  M subtype: phi(1..12)          big wheels
      #           E: subphi(0..3)
      #           F: subphi(0,2)
      #    I subtype:                     small wheel
      #           E: phi(1,3,...,15) subphi(0..2 except 7(1,2) and 11(0,1) and 15(1,2),
      #                                      which makes sense in the picture)
      #           F: phi(1..24)
      return
































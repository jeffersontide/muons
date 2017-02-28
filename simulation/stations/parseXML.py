#gets the list of MS stations from .xml file

import xml.etree.ElementTree as ET
tree = ET.parse('IdDictMuonSpectrometer_R.03.xml')
root = tree.getroot()

file = open("stations.txt", "w")
stations = set()

for region in root.findall('region'):
   type = region.get('group').upper()
   for range in region.findall('.//range[1]'):
      group = range.get('value')
      for range in region.findall('.//range[2]'):
         eta_range = range.get('value')
         for range in region.findall('.//range[3]'):
            phi_range = range.get('value')

            # Split into eta & phi sectors
            eta_ = eta_range.split(" ")
            phi_ = phi_range.split(" ")
            for eta in eta_:
               eta = int(eta)
               etaAbs = abs(eta)

               if eta > 0:
                  side = "A"
               elif eta == 0:
                  side = "B"
               elif eta < 0:
                  side = "C"
               else:
                  raise

               eta = format(etaAbs, '01d') + side

               for phi in phi_:
                  phi = format(int(phi), '02d')
                  out = "".join([type, group, eta, phi])

                  # prevent duplicate stations
                  if out not in stations:
                     print(out)
                     file.write(out + "\n")
                     stations.add(out)

file.close()
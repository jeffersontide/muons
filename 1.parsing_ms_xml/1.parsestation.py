#gets the list of MS stations from .xml file

import xml.etree.ElementTree as ET
tree = ET.parse('IdDictMuonSpectrometer_R.03.xml')
root = tree.getroot()


for region in root.findall('region'):
	group = region.get('group')
	for range in region.findall('.//range[1]'):
		value = range.get('value')
		for range in region.findall('.//range[2]'):
			value2 = range.get('value')
			for range in region.findall('.//range[3]'):
				value3 = range.get('value')
				print "%s/%s/%s/%s" % (group, value, value2, value3)


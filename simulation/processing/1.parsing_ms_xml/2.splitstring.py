#formats output.out

text_file = open("output.out", "r")

for line in text_file:
	#print line, #comma supresses new line
	line2 = line.rstrip('\n') #remove newl	
	linesplit = line2.split('/')
	linesplit2 = linesplit[2].split(' ')
	linesplit3 = linesplit[3].split(' ')	
	for m in range(len(linesplit2)):	
		for n in range(len(linesplit3)):		
			print linesplit[0], linesplit[1], linesplit2[m], linesplit3[n]

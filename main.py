# -*- coding: utf-8 -*-
from PIL import Image
import sys, codecs

def get_char(current):
    if current != [0,0,0,0,0,0,0,0]:
        total_val = current[0] + (current[1] << 1) + (current[2] << 2) + (current[4] << 3) + (current[5] << 4) + (current[6] << 5) + (current[3] << 6) +(current[7] << 7)
    else:
        total_val = 4
    return unichr(0x2800 + total_val)

def nearest_multiple(num, mult):
    return num - (num%mult)

try:
    im = Image.open(sys.argv[1])
except IndexError:
    print "Use file as args / drag file into this script"
    raise SystemExit

#Resize img to fit better
width = im.size[0]
height = im.size[1]
if width > 100:
    height = 100 * height / width
    width = 100

width = nearest_multiple(width, 2)
height = nearest_multiple(height, 4)
im = im.resize(( width, height ), Image.NEAREST)

try:
    weight = float(sys.argv[2])
except IndexError:
    weight = 3
    
px = im.load()
output_line = u""

for imgy in range(0, height, 4):
    for imgx in range(0, width, 2):    
        current = [0,0,0,0,0,0,0,0]
        cindex = 0
        for x in range(2):
            for y in range(4):
                temp = px[imgx+x, imgy+y]
                avg = (temp[0] + temp[1] + temp[2]) / weight
                try:
                    if(temp[3] < 32): avg = 255
                except:
                    pass
                if(avg < 128):
                    current[cindex] = 1
                cindex += 1
    
        output_line += get_char(current)
    output_line += u"\r\n"

#print output_line,

with codecs.open("braille.txt", "w", "utf-8-sig") as f:
    f.write(output_line)

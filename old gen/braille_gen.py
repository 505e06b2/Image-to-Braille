# -*- coding: utf-8 -*-
from PIL import Image, ImageFont, ImageDraw
import codecs

font = ImageFont.truetype("UBraille.ttf", 8)
fcontents = u"# -*- coding: utf-8 -*-\ndef get_char(current):\n    if   current == [0,0,0,0,0,0,0,0]: return u\"⠄\"\n"

def check_pixel(p):
    if p == 0:
        return 1
    return 0

for char in [unichr(x) for x in range(0x2801, 0x28ff)]:
    im = Image.new("1", (3,7), 1)
    draw = ImageDraw.Draw(im)

    draw.text((-2, -1), char, 0, font)

    px = im.load()
    fcontents += u"    elif current == [%d, %d, %d, %d, %d, %d, %d, %d]: return u\"%s\"\n" % (check_pixel(px[0,0]), check_pixel(px[0,2]), check_pixel(px[0,4]), check_pixel(px[0,6]),
                                                                               check_pixel(px[2,0]), check_pixel(px[2,2]), check_pixel(px[2,4]), check_pixel(px[2,6]), char)

fcontents += u"    return u\"⠄\"\n"

with codecs.open("braille.py", "w", "utf-8-sig") as f:
    f.write(fcontents)

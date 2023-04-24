**BOOKLET SCAN TO PDF**
__Set Up__
Need to install the following directories: (name | version)
"canvas": "^2.11.2",
"image-size": "^1.0.2",
"image-to-pdf": "^2.0.0",
"jimp": "^0.22.7",
"merge-images": "^2.0.0",
"pdf-img-convert": "^1.2.1",
"sharp": "^0.32.0"

Running the command `npm i` should also work.

__Configuration__
For the input and output files, edit in `index.js` lines 2 and 3 respectively.
Default: input in the same directory as index.js as `input.pdf` and output is `output.pdf`

INPUT MODES:
Change constant `inputModes` (line 4, index.js) for one of the following:
`0` for an input where you scanned duplex short side, and you can see the front page of booklet on the first page of input (default).
`1` for an input where you scanned duplex long side, and you can see the front page of booklet on the first page of input. 
`2` for an input where you scanned duplex short side, and you can see the front page of booklet on the last page of input.
`3` for an input where you scanned duplex long side, and you can see the front page of booklet on the last page of input. 

OUTPUT MODES:
Change constant `outputModes` (line 5, index.js) for one of the following:
`0` for an output where each page is on a separate page (default).
`1` for an output where the front and back page is separate pages and the other pages are doubled up.

SIZES:
Change array `size` (line 6, index.js) with the arrangement: `[width, height]`
Note that width and height are in pixels, where 1cm = approx 28.3464 pixels or 1 inch = 72 pixels. If in output mode 0, this means all pages are in this size, and in output mode 1, this means that all pages have double the width of the specified size, with the first and last page having whitespaces as it is the covers.
Example sizes (common) where width < height:
A3: `[841.89, 1190.55]`
A4: `[595.28, 841.89]`
A5: `[419.53, 595.28]`
Letter: `[612.00, 792.00]`

__Start__
Same way you would start a normal Node function; `node index.js` (this was made in Node v18.12.1)
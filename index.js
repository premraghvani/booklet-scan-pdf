/* >> OPTIONS << */
const inputFile = "input.pdf";
const outputFile = "output.pdf";
const inputModes = 2;
const outputModes = 1;
let size = [ 595.28, 841.89 ];

/* >> DEPENDENCIES << */
const pdf2img = require("pdf-img-convert");
const fs = require("fs");
const sizeOf = require("image-size");
const sharp = require("sharp");
const img2pdf = require("image-to-pdf");
const { createCanvas, loadImage } = require('canvas');

/* >> CODE << */

(async function () {
    // Image Split
    console.log("Retrieving PDF...")
    pdfArray = await pdf2img.convert(inputFile);
    console.log("PDF loaded + pages splitted...");

    // Dimension Search
    const dimensions = sizeOf(Buffer.from(pdfArray[0]));

    // split
    let individualSet = [];
    for(var i = 0; i < pdfArray.length; i++){
        const lhs = await sharp(Buffer.from(pdfArray[i])).extract({ left: 0, top: 0, width: Math.floor(dimensions.width/2), height: dimensions.height }).toBuffer();
        const rhs = await sharp(Buffer.from(pdfArray[i])).extract({ left: Math.floor(dimensions.width/2), top: 0, width: Math.floor(dimensions.width/2), height: dimensions.height }).toBuffer();
        individualSet.push(lhs);
        individualSet.push(rhs);
        delete pdfArray[i];
    }
    console.log("Divided pages")
    
    // get order of pages
    let ordering = findOrdering(individualSet.length).order;
    let pages = [];
    for(var i = 0; i < individualSet.length; i++){
        pages.push(individualSet[ordering[i]]);
    }
    delete individualSet;
    console.log("Reordered pages")

    if(outputModes == 0){
        // individual pages
        img2pdf(pages, size).pipe(fs.createWriteStream(outputFile))
    } else {
        // merged
        size[0] = size[0] * 2;
        let pages2 = [];
        pages2.push(pages[0])
        const dimensions2 = sizeOf(Buffer.from(pages[0]));
        for(var i = 1; i < pages.length-1; i=i+2){
            const lhs = await loadImage(pages[i])
            const rhs = await loadImage(pages[i+1])
            const canvas = createCanvas(dimensions2.width*2, dimensions2.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(lhs,0,0);
            ctx.drawImage(rhs,dimensions2.width,0);
            pages2.push(canvas.toBuffer())
        }
        pages2.push(pages[pages.length-1])
        img2pdf(pages2, size).pipe(fs.createWriteStream(outputFile))
    }
    console.log("Done!")
})();

function findOrdering(len){
    let ordering = [];
    let rotations = [];
    if(inputModes == 0){ // short side, front is front
        let tmp = [];
        for(var i = 0; i < (len/2); i++){
            if(i % 2 == 0){
                ordering.push(2*i+1);
                tmp.push(2*i);
            } else {
                ordering.push(2*i);
                tmp.push(2*i+1)
            }
        }
        for(var i = 0; i < tmp.length; i++){
            ordering.push(tmp[tmp.length-1-i]);
        }
    } else if(inputModes == 1){ // long side, front is front

    } else if(inputModes == 2){ // short side, back is front
        let tmp = [];
        let rhs = true;
        for(var i = (len/2)-1; i >= 0; i--){
            if(rhs){
                ordering.push(2*i+1);
                tmp.push(2*i);
                rhs = false;
            } else {
                ordering.push(2*i);
                tmp.push(2*i+1);
                rhs = true;
            }
        }
        for(var i = 0; i < tmp.length; i++){
            ordering.push(tmp[tmp.length-1-i]);
        }
    } else if(inputModes == 3){ // long side, back is front

    }
    return {order:ordering,rotate:rotations};
}
import { fabric } from "fabric";
import { ImageMaker } from "../DiagramClasses/Canvas_Module"

// create a PNG image based on the data in a canvas
export const apiImageMaker = (req, res, next) => {
    const canvas = req.canvas;

    if(canvas == null || canvas == undefined) 
        res.status(400).json({error: 'Error processing data, the data sent was either undefined or null'});
    else
    {
        const imageMaker = new ImageMaker();

        const pngStream = imageMaker.Stream;

        png.Stream.on("data", chunk => res.write(chunk));
        png.Stream.on("end", () => res.end());
    }
}


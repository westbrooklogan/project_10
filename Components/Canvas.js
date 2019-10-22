import { fabric } from "fabric"; 

// canvas class that generates a static version
// of the HTML element canvas that can be used
// for creating PNGs
export class Canvas {
   
    // constructor that takes a diagram built in the Diagram Maker
    constructor(diagram) {
        // create a new static canvas that the diagram will be 
        // drawn onto
        this.canvas = new fabric.StaticCanvas(null, {
            backgroundColor:'white', width: 2600, height: 1000 });
        
        // add all the items in the diagram to the canvas
        this.paint_Canvas(diagram);
    }

    // add all items in the diagram to the canvas
    paint_Canvas(diagram) {
        // grab each component of diagram to add to canvas
        diagram.forEach(diagramLevel => {
            // add the business workflow level
            this._canvas.add(diagramLevel.level);

            // add the shapes associated with each business workflow 
            diagramLevel.shapes.forEach(shapeCollection => 
                shapeCollection.forEach(shape =>
                    this._canvas.add(shape)
                )
            )
        });

        // render everything in the canvas
        this._canvas.renderAll();
    }

    // getters and setters for the canvas attribute of 
    // the canvas class.
    get canvas() { return this._canvas; }
    set canvas(canvas) { this._canvas = canvas; }
}
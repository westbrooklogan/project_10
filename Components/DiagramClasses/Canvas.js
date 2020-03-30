import { fabric } from "fabric"; 

// canvas class that generates a static version
// of the HTML element canvas that can be used
// for creating PNGs
export class Canvas {
   
    // constructor that takes a diagram built in the Diagram Maker
    constructor(diagram, width, height, legends) {
        // create a new static canvas that the diagram will be 
        // drawn onto
        this.canvas = new fabric.Canvas(null, {
            backgroundColor:'white', width: width, height: height});
        
        // add all the items in the diagram to the canvas
        this.paint_Canvas(diagram, legends);
    }

    // add all items in the diagram to the canvas
    paint_Canvas(diagram, legends) {
        // grab each component of diagram to add to canvas
        diagram.forEach(diagramCollection => {
            diagramCollection.forEach(diagramLevel => {
                
                // add the business workflow level
                this._canvas.add(diagramLevel.Level.Shape.Shape);

                // add the shapes associated with each business workflow 
                diagramLevel.Content.forEach(shapeCollection => 
                    shapeCollection.forEach(shape => {
                        this._canvas.add(shape.Shape.Shape);

                        if(shape.Children != undefined && shape.Children != null)
                            shape.Children.forEach(child =>
                                this._canvas.add(child.Shape.Shape)
                            );
                    })
                )
            })
        });

        legends.legend.forEach(labelItem => {
            //console.log(labelItem.label);
            this._canvas.add(labelItem.label);
        })

        //this._canvas.add(legends.legend);

        // render everything in the canvas
        this._canvas.renderAll();
    }

    // getters and setters for the canvas attribute of 
    // the canvas class.
    get canvas() { return this._canvas; }
    set canvas(canvas) { this._canvas = canvas; }
}
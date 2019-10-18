import { fabric } from "fabric";

export class Canvas {
    Canvas() {
        this.canvas = new fabric.StaticCanvas(null, {
            backgroundColor:'white', width: 550, height: 500 });   
    }

    constructor(diagram) {
        this.canvas = new fabric.StaticCanvas(null, {
            backgroundColor:'white', width: 2600, height: 1000 });
        
        this.paint_Canvas(diagram);
    }

    paint_Canvas(diagram) {
        diagram.forEach(diagramLevel => {
           // console.log("diagram.level: ", diagramLevel.level)
            this._canvas.add(diagramLevel.level);

            diagramLevel.shapes.forEach(shapeCollection => 
                shapeCollection.forEach(shape =>
                    this._canvas.add(shape)
                )
            )
        });

        this._canvas.renderAll();
    }

    get canvas() { return this._canvas; }
    set canvas(canvas) { this._canvas = canvas; }
}
import { fabric } from "fabric";

export class ShapeConnector {
    constructor(shapes) {
        this._offsetX = 20;
        this._offsetY = 20;
        this.Shapes = this.connect_Shape(shapes);
    }
    
    get Shapes() { return this._shapes; }
    set Shapes(shapes) { this._shapes = shapes; }

    connect_Shape = shapes => {
        const workFlow = [
            shapes.workStreamShapes,
            shapes.portfolioShapes,
            shapes.l1Shapes,
            shapes.l2Shapes
        ];
        
        const l3Shape = shapes.l3Shapes;
        const maxHeight = shapes.maxHeight
        let currentY = this._offsetY;
        let currentX = this._offsetX;

        workFlow.forEach((flow, index) => {
            currentX = this._offsetX;
            currentY = maxHeight * index + this._offsetY;
            console.log(currentY)
            flow.level.set({top: currentY, left: currentX});

            flow.shapes.forEach((shapeCollection, index) => {
                shapeCollection.forEach(shape => {
                   
                   // console.log(shape.width);
                   (index == 0) ? currentX += flow.level.width :
                    currentX += shape.width;
                   // console.log("currentX: " + currentX);
                    shape.set({top: currentY, left: currentX});
                })
            });

          //console.log("flow.level:  ", flow.level);
        });

        currentX = this._offsetX;
        let width = l3Shape.level.width;

        l3Shape.level.set({top:currentY + maxHeight, left:this._offsetX});

        l3Shape.shapes.forEach((shapeCollection, index) => {
            currentX =  (index + 1) * width + this._offsetY;
            let y = currentY;

            shapeCollection.forEach(shape => {
                y += shape.height;
                shape.set({top: y, left: currentX});
            })
        })

        workFlow.push(l3Shape);

        return workFlow;
    }
}
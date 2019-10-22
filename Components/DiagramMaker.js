// creates the layout of the diagram
// takes each shape (workflow level element) and 
// gives it a relative location based on other elements
export class DiagramMaker {
    // constructor
    // creates the offsets used from the top
    // and left of the page
    constructor(shapes) {
        this._offsetX = 20;
        this._offsetY = 20;
        // put shapes in relative positions
        // or connect shapes to each other
        this.Shapes = this.connect_Shape(shapes);
    }
    
    // getter and setter of the shapes attribute of this class
    get Shapes() { return this._shapes; }
    set Shapes(shapes) { this._shapes = shapes; }

     // put shapes in relative positions
    // or connect shapes to each other
    connect_Shape = shapes => {
        // workflow elements to l2
        const workFlow = [
            shapes.workStreamShapes,
            shapes.portfolioShapes,
            shapes.l1Shapes,
            shapes.l2Shapes
        ];
        
        // get the l3 shapes, maxHeight and 
        // set start locations to offsets
        const l3Shape = shapes.l3Shapes;
        const maxHeight = shapes.maxHeight
        let currentY = this._offsetY;
        let currentX = this._offsetX;

        workFlow.forEach((flow, index) => {
            currentX = this._offsetX;
            currentY = maxHeight * index + this._offsetY;
            flow.level.set({top: currentY, left: currentX});

            flow.shapes.forEach((shapeCollection, index) => {
                shapeCollection.forEach(shape => {
                   

                   (index == 0) ? currentX += flow.level.width :
                    currentX += shape.width;
                    shape.set({top: currentY, left: currentX});
                })
            });
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
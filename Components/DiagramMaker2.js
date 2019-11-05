import { ShapeCollectionError } from "../Errors/DataErrors";

export class DiagramMaker2 {
    get Shapes() { return this._shapes; }
    set Shapes(shapes) { this._shapes = shapes; }

    get OffsetX() { return this._offsetX; }
    set OffsetX(offsetX) { this._offsetX = offsetX; }

    get CurrentX() { return this._currentX; }
    set CurrentX(currentX) {this._currentX = currentX; }

    get OffsetY() { return this._offsetY; }
    set OffsetY(offsetX) { this._offsetY = offsetY; }

    get CurrentY() { return this._currentY; }
    set CurrentY(currentY) { this._currentY = currentY; }

    get TotalX() { return this._totalX; }
    set TotalX(totalX) {this._totalX = totalX; }

    get TotalY() { return this._totalY; }
    set TotalY(totalY) { this._totalY = totalY; }

    constructor(shapes) {
        this._offsetX = 200;
        this._offsetY = 200;
        this._currentX = this._offsetX;
        this._currentY = this._offsetY;
        this._totalX = 0;
        this._totalY = 0;
        this.Shapes = this.connect_Shapes(shapes);

        //Ricardo start here
    }

    connect_Shapes = shapeCollection => {
        if(shapeCollection == undefined || shapeCollection == null)
            throw ShapeCollectionError;

        return shapeCollection.map(collection => 
            this._locate_XY(collection)
        );
    }

    _locate_XY(shapes) {
        var localX = this._currentX;
        var localY = this._offsetY;
        this._currentY = this._offsetY;
        var currentDepth = this._offsetY;
        var last = shapes.length - 1;

        for(let i = last; i >= 0; i--) {
            var level = shapes[i].Level;
            var content = shapes[i].Content;

            level.Shape.Shape.set({
                left: localX,
                top:  localY
            });
            
            localX += level.Shape.Width;

            content.map(group => {
            
                group.map(shape => {
                    var height = shape.Shape.Height;
                    var width = shape.Shape.Width;
        
                    shape.Shape.Shape.set({
                        left: localX,
                        top:  localY
                    });

                    localY += height;

                    if(shape.Children != undefined || shape.children != null) 
                        shape.Children.map(child => {
                            var y = localY;
                            localY += child.Shape.Height;
                            return child.Shape.Shape.set({
                                left: localX,
                                top: y
                            });
                        });

                    currentDepth = Math.max(currentDepth, localY);
                    localX += width;
                    localY = this._currentY;
                    this._totalX = Math.max(this._totalX, localX)
                    return shape;
                })
            });

            localX = this._currentX;
            this._currentY = currentDepth;
            this._totalY = Math.max(currentDepth, this._totalY);
            localY = currentDepth;
        }
        
        this._currentX = this._totalX;

        return shapes;
    }    
}
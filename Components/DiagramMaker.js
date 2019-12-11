import { ShapeCollectionError } from "../Errors/DataErrors";


export class DiagramMaker {
    // getter and setter for the shapes
    get Shapes() { return this._shapes; }
    set Shapes(shapes) { this._shapes = shapes; }

    // getter and setter for the x offset or 
    // the offset from the left side of the canvas
    get OffsetX() { return this._offsetX; }
    set OffsetX(offsetX) { this._offsetX = offsetX; }

    // getter and setter for the current 
    // x-coordinate where the next shape to be moved
    get CurrentX() { return this._currentX; }   
    set CurrentX(currentX) {this._currentX = currentX; }

    // getter and setter for the y offset or
    // the offset from the top of the canvas
    get OffsetY() { return this._offsetY; }
    set OffsetY(offsetY) { this._offsetY = offsetY; }

    // getter and setter for the current
    //y-coordinate where the next shape to be moved
    get CurrentY() { return this._currentY; }
    set CurrentY(currentY) { this._currentY = currentY; }

    // getter and setter for the total width of the entire diagram
    get TotalX() { return this._totalX; }
    set TotalX(totalX) {this._totalX = totalX; }

    // getter and setter for the total height of the entire diagram
    get TotalY() { return this._totalY; }
    set TotalY(totalY) { this._totalY = totalY; }

    /********************************************
     * constructor for the diagram maker        *
     * initialize certain properies to change   *
     * the white space around the canvas and    *
     * therefore total size of the canvas then  *
     * change this._offsetX for left and right  *
     * white space and this.offsetY for top and *
     * bottom white space.                      *
     ********************************************/
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

    // takes a shapecollection and gives them locations
    // in the diagram therefore connecting each shape to its
    // neighbors
    connect_Shapes = shapeCollection => {
        if(shapeCollection == undefined || shapeCollection == null)
            throw ShapeCollectionError;

        // give each shape in a workstream an x- and y-coordinate
        return shapeCollection.map(collection => 
            this._locate_XY(collection)
        );
    }

    // give each shape an x- and y-coordinate
    _locate_XY(shapes) {
        var localX = this._currentX; // the local X for a level
        var localY = this._offsetY; // local Y for a level
        this._currentY = this._offsetY; // used to set the localY
        var currentDepth = this._offsetY; // where the next level y-coordinate should start
        var last = shapes.length - 1; // last shape

        // work with shape backwards assuming they came from the shapemapper
        for(let i = last; i >= 0; i--) {
            var level = shapes[i].Level; // get the level
            var content = shapes[i].Content; // get the shapes in that level

            // locate the level (always left of content)
            level.Shape.Shape.set({
                left: localX,
                top:  localY
            });
            // console.log(level.Shape.Shape);
            // content should start where level stops
            localX += level.Shape.Width;

            // get each collection of shapes in the content
            content.map(shapeCollection => {
                
                // get each shape in each shapeCollection
                shapeCollection.map(shape => {
                    // shape height and widht
                    var height = shape.Shape.Height; 
                    var width = shape.Shape.Width;
                    
                    // set the location of the shape
                    shape.Shape.Shape.set({
                        left: localX,
                        top:  localY
                    });

                    // if the shape has children they should
                    // start after then parent
                    localY += height;

                    // set each child location where each child is under the previous sibling
                    if(shape.Children != undefined || shape.children != null) 
                        shape.Children.map(child => {
                            var y = localY;
                            localY += child.Shape.Height;
                            return child.Shape.Shape.set({
                                left: localX,
                                top: y
                            });
                        });
                    
                    // set where the next level should start which should be under
                    // the set of children with the greatest height
                    currentDepth = Math.max(currentDepth, localY);
                    localX += width; // increase local X for next shape
                    localY = this._currentY; // each shape in a level should have same Y start location
                    this._totalX = Math.max(this._totalX, localX) 
                    return shape;
                })
            });
            
            // reset localX for next level to 
            // start at left side of canvas
            localX = this._currentX;
            this._currentY = currentDepth; // set Y start for next level
            // total height of the canvas is going to be after last level's
            // element with greatest amount of children
            this._totalY = Math.max(currentDepth, this._totalY); 
            localY = currentDepth;
        }
        // set currentX for next workstream
        this._currentX = this._totalX;

        return shapes;
    }    
}
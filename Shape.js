import { fabric } from "fabric";

export class Shape {
    // shape constructor that stores a shape and 
    // its children are initialized as an empty array
    Shape = shape => {
        this.Shape = shape;
        this.Children = [];
    }

    // shape construct that stores a shape and initializes the children
    Shape = (shape, shapeChildren) => {
       this.Shape = shape;
       this.Children = shapeChildren;
    }

    // getter and setter for shape
    get Shape() { return this._shape; }

    set Shape(shape) { this._shape = shape; }

    // getter and setter for shape children
    get Children() { return this._shapeChildren; }

    set Children(children) { 
        if(children == undefined || children == null)
            alert("Error. No children object to add to shape \n. \
                   Please make sure there are shape children\n");
        else
            this._shapeChildren = children;
     }

    // push a child onto the shape children children
    pushChild = child => {
        if(children == undefined || children == null)
        alert("Error. No children to add to shape \n. \
               Please make sure there are shape children\n");
        else
            this._shapeChildren.push(child);
    }

    // pushes multiple children to the shape children
    pushChildren = children => children.forEach(child => this._shapeChildren.push(child));
}


import { fabric } from "fabric";
import { NoStatusError, NoTextError, BadRectangleError, BadTextBoxError } from "../Errors/DataErrors";
import { colorMap } from "../Components/colorMap";

// shape class that stores information about the shapes
export class Shape {
    constructor() {
        this._width = 160;
        this._status = null;
        this._text = "";
        this._shapeReady = false;
        this._height = 80;
    }

    // indicates if the shapes are ready to be generated
    get ShapeReady() { return this._shapeReady; }

    set ShapeReady(shapeReady) { this._shapeReady = shapeReady; }

    // getter and setter for shape
    get Shape() { return this._shape; }

    set Shape(shape) { this._shape = shape; }

    // getter and setter for height
    get Height() {  return this._height; }

    set Height(height) {
        if(height <= 0) 
            height = 80;

        this._height = height;
        
        // if there is no text, then there 
        if(this._textBox != undefined && this._textBox != null  && 
            this._width > 0)
                this.TextBox = this._makeTextboxWithHeight();
    }

    //getter and setter for width
    get Width() { return this._width; }

    set Width(width) { 
        if(width <= 0)
            width = 160;
        
        this._width = width;

        if(this._text != undefined && this._text != null)
            this.TextBox = this._makeTextBox(this.Text); 
     }

    // getter and setter for color
    get Color() { return this._color; }

    set Color(color) {
        if(color == null || color == undefined || color == "")
            throw BadColorError;

        this._color = color;

        this.Rectangle.fill = color;

        if(this._textBox != undefined && this._textBox != null)
            this.Shape = this._map_To_Group();
    }

    // getter and setter for textbox
    get Text() { return this._text; }

    set Text(text) { 
        this._text = text;

        this._makeTextBox(text);
    }
    
    get TextBox() { return this._textBox; }

    set TextBox(textBox) { 
        if(textBox == null || textBox == undefined ||
            textBox.height <= 0 || textBox.width <= 0)
                throw BadTextBoxError;
        
        this._textBox = textBox;

        if(this.ShapeReady)
            this.Shape = this._map_To_Group();
    }

    get Rectangle() { return this._rectangle; }

    set Rectangle(rectangle) {
        if(rectangle == null || rectangle == undefined ||
            rectangle.height <= 0 || rectangle.width <= 0) 
                throw BadRectangleError;

        this._rectangle = rectangle;

        if(this.ShapeReady)
            this.Shape = this._map_To_Group();
     }

    get Status() { return this._status; }

    set Status(status) { 
        this._status = status;

        if(this.ShapeReady)
            this.Rectangle = this.rectangle(status);
    }

    // make the shape
    makeShape = (text, status, width) => {
        this.Width = width;

        this._textBox = this.makeTextBox(text);
        
        this.TextBox.height == 0 ? this._height = this._width / 2 : this._height = this.TextBox.height;
    
        this.rectangle = _rectangle(status);
        
        this.ShapeReady = true;
        this.Shape = this._map_To_Group();
    }

    makeShape = (text, status) => {
        if(this.Width == undefined || this.Width == null || this.Width <= 0)
            this._width = 160;
        
        this._textBox = this.makeTextBox(text);
    
        this.TextBox.height == 0 ? this._height = this._width / 2 : this._height = this.TextBox.height;
    
        this._rectangle = this._rectangle(status);
        
        this.ShapeReady = true;
        this.Shape = this._map_To_Group();
    }

    makeShape = () => {
        if(this.Status == undefined || this.Status == null)
            throw NoStatusError;

        if(this.Width == undefined || this.Width == null || this.Width <= 0)
            this._width = 160;
        
        this._rectangle = this._rectangle(this.Status);
    
        this.ShapeReady = true;
        this.Shape = this._map_To_Group();
    }

    _makeTextBox = text => {
        if(text == undefined || text == null)
            throw NoTextError;
        
        this._text = text;
        // fabricjs text object
        // the text argument is a string
        return new fabric.Textbox(text, {
            fontSize: 16, // size of text
            originX: 'center', // horizontal orientation to origin
            originY: 'center', // vertical orientation to origin
            fixedWidth: this.Width,
            width: this.Width,
            textAlign: 'center'
        });
    }

    _makeTextboxWithHeight = () => {
        if(this._text == undefined || this._text == null)
            throw NoTextError;
        
        if(this._height <= 0 )
            height = 80;

        // fabricjs text object
        // the text argument is a string
        return new fabric.Textbox(this._text, {
            fontSize: 16, // size of text
            originX: 'center', // horizontal orientation to origin
            originY: 'center', // vertical orientation to origin
            fixedWidth: this.Width,
            width: this.Width,
            textAlign: 'center',
            height: this._height
        });
    }

    _map_To_Group = () => 
        new fabric.Group([this.Rectangle, this.TextBox], {
            width: this.Width,
            height: this.Height,
        });

    _rectangle = status => {
        this._determineColor(status);
        
        // fabric js rectangle
        return new fabric.Rect({
            fill: this.Color,
            width: this.Width,
            height: this.Height, 
            stroke: 'white', // border color
            strokeWidth: 2, // border width
            originX: 'center', // horizontal orientation to origin
            originY: 'center' // vertical orientation to origin
        });
    }
        
    _determineColor = status => {
        if(status == null || status == undefined)
            throw NoStatusError;
        
        this._status = status
        this._color = colorMap[this.Status];
    }
}





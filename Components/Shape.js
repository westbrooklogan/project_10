import { fabric } from "fabric";
import { NoStatusError, NoTextError, BadRectangleError, BadTextBoxError } from "../Errors/DataErrors";
import { colorMap } from "../Components/colorMap";

var RECT = 0;
var TEXT = 1;
// shape class that stores information about the shapes
export class Shape {
    constructor() {
        this._width = 240;
        this._status = null;
        this._text = "";
        this._shapeReady = false;
        this._height = 120;
        this._textColor = "#000000";
    }
    
    // indicates if the shapes are ready to be generated
    get () { return this._shapeReady; }

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
        if(this._textBox != undefined && this._textBox != null) {
            this._setTextBoxHeight();

            if(this._shape != undefined && this._shape != null)
            this._setShapeHeight();
        }
        else   
            this._makeTextboxWithHeight();
    }

    //getter and setter for width
    get Width() { return this._width; }

    set Width(width) { 
        if(width <= 0)
            width = 240;
        
        this._width = width;

        if(this._textBox != undefined && this._textBox != null) {
            this._setTextBoxWidth();

            if(this._shape != undefined && this._shape != null)
                this._setShapeWidth();
        }
        else
            this.makeTextBox(this.Text); 
     }
    
    // getter and setter of text color
    get TextColor() { return this._textColor; }
    set TextColor(textColor) { 
        this._textColor = textColor;

        if(this._textBox != undefined && this._textBox != null)
            this._textBox.set({
                fill: textColor
            });
     }

    // getter and setter for color
    get Color() { return this._color; }

    set Color(color) {
        if(color == null || color == undefined || color == "")
            throw BadColorError;

        this._color = color;

        
        this._rectangle.set({ fill: color });

        if(this._shape != undefined && this._shape != null)
            this._shape.item(RECT).set({ fill: color });
        else if(this._textBox != undefined && this._textBox != null)
            this._map_To_Group();
    }

    // getter and setter for text
    get Text() { return this._text; }

    set Text(text) { 
        this._text = text;

        if(this._textBox != undefined && this._textBox != null) {
            this._textBox.set({ text });
            
            if(this._shape != undefined && this._shape != null)
                this._shape.item(TEXT).set({ text });
        }
        else
            this.makeTextBox(text);
    }
    
    // getter and setter for the textbox
    get TextBox() { return this._textBox; }

    set TextBox(textBox) { 
        // bad argument
        if(textBox == null || textBox == undefined ||
            textBox.height <= 0 || textBox.width <= 0)
                throw BadTextBoxError;
        
        this._textBox = textBox;
        
        // if the shape is ready to map to a group then map it 
        if(this.ShapeReady)
            this._map_To_Group();
    }

    // getter and setter rectangle
    get Rectangle() { return this._rectangle; }

    set Rectangle(rectangle) {
        // bad argument
        if(rectangle == null || rectangle == undefined ||
            rectangle.height <= 0 || rectangle.width <= 0) 
                throw BadRectangleError;

        this._rectangle = rectangle;
        
        // if shape is ready then map to group with the textbox
        if(this.ShapeReady)
            this._map_To_Group();
    }
    
    // getter and setter for the status
    get Status() { return this._status; }

    set Status(status) { 
        // if shape is ready make a rectangle that determines the color
        if(this._rectangle != undefined && this._rectangle != null) 
           this._setRectangle();
        else {
            this._status = status;

            if(this.ShapeReady)
                this._newRectangle(status);
        }
    }
    
    adjustTextColor = brightness => {
        if(brightness <= 80)
            this.TextColor = "#ffffff";
    }

    _setTextBoxHeight = () => {
        var height = this._height;
        var text = this._text;
        this._textBox.set({ height, text });
    }

    _setTextBoxWidth = () => {
        var width = this._width;
        var text = this._text;
        this._textBox.set({ width, text });
    }

    _setShapeHeight = () => {
        var height = this._height;
        var text = this._text;
        this._shape.item(RECT).set({ height });
        this._shape.item(TEXT).set({ height, text });
        this._shape.set({ height });
    }

    _setShapeWidth = () => {
        var width = this._width;
        var text = this._text;
        this._shape.item(RECT).set({ width });
        this._shape.item(TEXT).set({ width, text });
        this._shape.set({ width });
    }

    _setRectangle = () => {
        this._determineColor(status);
        var fill = this._color;
        this._rectangle.set({ fill });

        if(this._shape != undefined && this._shape != null)
            this._shape.item(RECT).set({ fill });
    }

    // make the shape with a given text, status, and width
    makeShape = (text, status, width) => {
        this.Width = width;

        this.makeTextBox(text); // make a text box with the given text
        
        // set the height of the textbox to either the 
        //set height, or a default if the text box doesn't have a height
        this.TextBox.height == 0 ? this._height = this._width / 2 : this._height = this.TextBox.height;
    
        this._newRectangle(status);
        
        // the shape is ready so if any changes to 
        // a shape object, then the shape needs to be changed
        this.ShapeReady = true;
        this._map_To_Group(); // combine textbox and rectangle
    }

    // make the shape with a given text, and status
    makeShape = (text, status) => {
        // get a default height
        if(this.Width == undefined || this.Width == null || this.Width <= 0)
            this._width = 240;
        
        this.makeTextBox(text); // make textbox with given text
        
         // set the height of the textbox to either the 
        //set height, or a default if the text box doesn't have a height
        this.TextBox.height == 0 ? this._height = this._width / 2 : this._height = this.TextBox.height;
    
        this._newRectangle(status);
        
         // the shape is ready so if any changes to 
        // a shape object, then the shape needs to be changed
        this.ShapeReady = true;
        this._map_To_Group(); // combine textbox and rectangle
    }

    // make the shape
    makeShape = () => {
        // can't make a shape without status or width
        if(this.Status == undefined || this.Status == null)
            throw NoStatusError;

        if(this.Width == undefined || this.Width == null || this.Width <= 0)
            this._width = 240;
        
        this._newRectangle(this.Status);
        
        // the shape is ready so if any changes to 
        // a shape object, then the shape needs to be changed
        this.ShapeReady = true;
        this._map_To_Group(); // combine textbox and rectangle
    }

    makeTextBox = text => {
        if(text == undefined || text == null)
            throw NoTextError;
    
        this._text = text;
        // fabricjs text object
        // the text argument is a string
        this._textBox = new fabric.Textbox(text, {
            fontSize: 24, // size of text
            originX: 'center', // horizontal orientation to origin
            originY: 'center', // vertical orientation to origin
            fixedWidth: this.Width,
            width: this.Width,
            textAlign: 'center',
            fill: this._textColor
        });
    }

    _makeTextboxWithHeight = () => {
        if(this._text == undefined || this._text == null)
            throw NoTextError;
        
        if(this._height <= 0 )
            height = 80;

        // fabricjs text object
        // the text argument is a string
        this._textBox = new fabric.Textbox(this._text, {
            fontSize: 24, // size of text
            originX: 'center', // horizontal orientation to origin
            originY: 'center', // vertical orientation to origin
            fixedWidth: this.Width,
            width: this.Width,
            textAlign: 'center',
            height: this._height,
            fill: this._textColor
        });
    }

    // map a rectangle and textbox to a group
    _map_To_Group = () => {
        this.Shape = new fabric.Group([this.Rectangle, this.TextBox], {
            width: this.Width,
            height: this.Height,
        });
    }

    _newRectangle = status => {
        this._determineColor(status);
        
        // fabric js rectangle
        this._rectangle = new fabric.Rect({
            fill: this.Color,
            width: this.Width,
            height: this.Height, 
            stroke: 'white', // border color
            strokeWidth: 2, // border width
            originX: 'center', // horizontal orientation to origin
            originY: 'center' // vertical orientation to origin
        });
    }
    

    // determine the color of a rectangle
    _determineColor = status => {
        if(status == null || status == undefined)
            throw NoStatusError;
        
        this._status = status
        this._color = colorMap[this.Status];
    }
}





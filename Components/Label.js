import { fabric } from "fabric";
import { Shape } from "./Shape";


export class Label extends Shape {

    constructor(status, statusColor, labelHeight){
        super();
        this.width = 240;
        this._status = null;
        this._text = "";
        this._height = labelHeight;
        this._textColor = "#000000";
        this.label = this.makeShape(status, statusColor)
    }

    makeShape = (status, statusColor) => {
        // get a default height
        if(this.Width == undefined || this.Width == null || this.Width <= 0)
            this.width = 240;
        
        this.makeTextBox(status); // make textbox with given text
        
        // Make text bold
        this._textBox.set({
            fontWeight: "bold"
        });
    
        this._newRectangle(statusColor);
        
         // the shape is ready so if any changes to 
        // a shape object, then the shape needs to be changed
        
        this._map_To_Group(); // combine textbox and rectangle

        // Move textbox to the left
        this._shape.item(1).set({
            left: this._shape.item(1).left + this.Width
        });

        return this._shape;
    }


    _newRectangle = color => {
        if(color == null)
            throw NoColorError;

        this._textColor = color

        // fabric js rectangle
        this._rectangle = new fabric.Rect({
            fill: this._textColor,
            width: this.Width,
            height: this.Height, 
            stroke: 'white', // border color
            strokeWidth: 2, // border width
            originX: 'center', // horizontal orientation to origin
            originY: 'center' // vertical orientation to origin
        });
    }
    
}
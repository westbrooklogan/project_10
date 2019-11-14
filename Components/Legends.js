import { fabric } from "fabric";
import { Label } from "./Label";

//import { colorMap } from "./Components/colorMap";

export class Legend { 
    /*get Shapes() { return this._shapes; }
    set Shapes(shapes) {this._shapes = shapes; }

    get Colors() { return this._colors; }
    set Colors(colors) { this._col; }
    */
    constructor(height, offsetX, map) {
        this.height = height;
        this.offsetX = offsetX;
        this.mapColors = map._statuses;
        this.status = Object.keys(this.mapColors);
        this.colors = Object.values(this.mapColors);
        this.legend = this.make_Legend();
    
    }

    make_Legend = () => {
        //arrayLegend = [];
        
        this.rect = new Label(this.status[1], this.colors[1])
        //console.log(this.rect.label)

        this.rect.label.set({
            left: this.offsetX,
            top: this.height
        });
        return this.rect.label
        
        
        /*status.forEach(colorName => {
            colorStatus = this.mapColors[colorName];
            rect = new Shape(colorName, colorStatus);
            console.log(rect);
        
        });
        */
        //console.log(arrayLegend);
        //return rect;
    }


}
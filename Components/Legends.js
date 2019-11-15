import { fabric } from "fabric";
import { Label } from "./Label";
import { nonMaturityStatuses } from "./nonMaturityStatuses";

//import { colorMap } from "./Components/colorMap";

export class Legend { 
    /*get Shapes() { return this._shapes; }
    set Shapes(shapes) {this._shapes = shapes; }

    get Colors() { return this._colors; }
    set Colors(colors) { this._col; }
    */
    constructor(TotalY, offsetX, map) {
        this.TotalY = TotalY;
        this.offsetX = offsetX;
        this.mapColors = map._statuses;
        this.status = Object.keys(this.mapColors);
        this.colors = Object.values(this.mapColors);
        this.labelHeight = 30;
        this.offsetFromDiagram = 30;
        this.legend = this.make_Legend();

    
    }

    make_Legend = () => {
        this.arrayLegend = [];
        
        this.rect = new Label(this.status[1], this.colors[1], this.labelHeight);
        //console.log(this.rect.label)
        
        this.status.forEach(colorName => {
            var maturityStatus = true;
            nonMaturityStatuses.forEach(status => {
                if (colorName == status) {
                    maturityStatus = false;
                }
            });
            if (maturityStatus) {
            this.colorStatus = this.mapColors[colorName];
            this.arrayLegend.push(new Label(colorName, this.colorStatus, this.labelHeight));
            }
        });

        //console.log(this.arrayLegend)
        this.CurrentY = this.TotalY + this.offsetFromDiagram;

        this.arrayLegend.map(labelItem => {
            labelItem.label.set({
                left: this.offsetX,
                top: this.CurrentY
            });
            this.CurrentY = this.CurrentY + this.labelHeight + 3.75
            
        });

        this.TotalY = this.CurrentY 

        //this.GroupHeight = this.CurrentY - (this.TotalY + this.offsetFromDiagram);
        //this.GroupWidth = this.arrayLegend[0].width * 2;
        this.rect.label.set({
            left: this.offsetX,
            top: this.TotalY + 30
        });
/*
        this.finalGruop = new fabric.Group(this.arrayLegend, {
            width: this.GroupWidth,
            height: this.GroupHeight
        });
*/
        return this.arrayLegend
    }


}
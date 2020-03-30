import { Label } from "./Label";

export class Legend { 
   
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
        
        this._rect = new Label(this.status[1], this.colors[1], this.labelHeight);
        
        this.status.forEach(colorName => {
            if (this.mapColors[colorName]['maturityStatus'] == 'Maturity') {
               
                this.colorStatus = this.mapColors[colorName]['color'];

                this.arrayLegend.push(new Label(colorName, this.colorStatus, this.labelHeight));
            }
        });

        this.CurrentY = this.TotalY + this.offsetFromDiagram;

        this.arrayLegend.map(labelItem => {
            labelItem.label.set({
                left: this.offsetX,
                top: this.CurrentY
            });
            this.CurrentY = this.CurrentY + this.labelHeight + 3.75
            
        });

        this.TotalY = this.CurrentY 

        this._rect.label.set({
            left: this.offsetX,
            top: this.TotalY + 30
        });

        return this.arrayLegend
    }


}
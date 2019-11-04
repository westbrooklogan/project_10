import { colorMap } from "./colorMap";

export class ColorMapper{
    constructor(){
        this._statuses = {};
    }

    _addNewstatus(status, color){
        if(!(status in this._statuses))
            this._statuses[status] = color
    }

    _getdata(){
        return this._statuses;
    }

    _generate_Status = (status) => {
        var newColor;
        do{
            newColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            if(newColor.length < 7) { newColor += "0" }       
            var birghtness = this._brightness_Calc(newColor);
        }while(birghtness < 20 || birghtness > 85);
    
        colorMap[status] = newColor;
        this._addNewstatus(status, newColor);
    }
    
    _brightness_Calc = (newColor) => {
        var c = newColor.substring(1);
        var rgb = parseInt(c, 16);
        var r = (rgb >> 16) & 0xff;
        var g = (rgb >>  8) & 0xff;
        var b = (rgb >>  0) & 0xff;
    
        var lumi = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
        return lumi;
    }

    _printData(){
        var newstatuses = this._getdata();
            Object.keys(newstatuses).forEach(function(key){
                console.log(key, newstatuses[key]);
            });
        }
    
}
import { colorMap } from "./colorMap";

// color mapper class that maps statuses to colors and their brightnesses
// or generates random colors and their respective brightness if 
// an unknown/unmapped status is encountered
export class ColorMapper{

    constructor(){
        this._statuses = {}; // map for statuses
        this._brightness = {}; // map for their respective brightness
    }

    // add a new status to the mapped statuses if not
    // already mapped
    _addNewstatus(status, color, brightness){
        if(!(status in this._statuses)) {
            this._statuses[status] = color;
            this._brightness[status] = brightness;
        }
    }

    // get the statuses
    _getdata(){
        return this._statuses;
    }

    // generate a random color and its respective brightness
    // for a given status
    _generate_Status = (status) => {
        var newColor;
        var brightness;
        // as long as it is to bright or too dark
        // then remap to a different color.
        do{
            // get a random hex number that represents a color and test 
            // its brightness
            newColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            if(newColor.length < 7) { newColor += "0" }       
                brightness = this.brightness_Calc(newColor); 
        }while(brightness < 20 || brightness > 85);
        
        colorMap[status] = newColor; // add color map to status
        this._addNewstatus(status, newColor, brightness);
    }
    
    // calculate the brightness by using
    // the hex bits that represent the 
    // rgb (red,green,blue) values of
    // the given color
    brightness_Calc = (color) => {
        var c = color.substring(1);
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
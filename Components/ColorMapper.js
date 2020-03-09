
// color mapper class that maps statuses to colors and their brightnesses
// or generates random colors and their respective brightness if 
// an unknown/unmapped status is encountered
export class ColorMapper{

    constructor(colorMap){
        this._statuses = {}; // map for statuses
        this._brightness = {}; // map for their respective brightness
        this._colorMap = colorMap;
    }

    // add a new status to the mapped statuses if not
    // already mapped
    addNewstatus = (status, colorStatus, brightness) => {
        
        if(this._statuses[status] == undefined) {
            this._colorMap[status] = colorStatus;
            colorStatus.status = status;
            this._statuses[status] = colorStatus;
            this._brightness[status] = brightness;

        }
    }

    // get the statuses
    _getdata = () => this._statuses;

    // generate a random color and its respective brightness
    // for a given status
    generate_Status = status => {
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

        var newStatus = {
            "color" : newColor,
            "maturityStatus": "Maturity",
        }; // add color map to status

        this._addNewstatus(status, newStatus, brightness);
    }
    
    // calculate the brightness by using
    // the hex bits that represent the 
    // rgb (red,green,blue) values of
    // the given color
    brightness_Calc = color => {
        var c = color.substring(1);
        var rgb = parseInt(c, 16);
        var r = (rgb >> 16) & 0xff;
        var g = (rgb >>  8) & 0xff;
        var b = (rgb >>  0) & 0xff;
    
        var lumi = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    
        return lumi;
    }

    _printData = () => {
        var newstatuses = this._getdata();
            Object.keys(newstatuses).forEach(function(key){
                console.log(key, newstatuses[key]);
            });
    }

    assign_Color_To_Group = shapeCollection => {
        if(this.is_ColorMap_Empty())
            return null;
        
        
    }

    _mapColorToShape = (shape) => {
        var status = shape.Status;
       
        // give it a status and generate random colors and
        // their respective brightness for statuses that don't 
        // already map to a color. if the status exists then just map it
        
        if(this.ColorMap[status] != undefined) {
            var colorStatus = this.ColorMap[status];
            var color = colorStatus.color;
            var brightness = this.brightness_Calc(color);
            this.addNewstatus(status, colorStatus, brightness);
        }
         else
            this.generate_Status(status);
    
        // the text color should be black for lighter colors and 
        // white for darker colors
        shape.adjustTextColor(this._brightness[status]);
    }

    is_ColorMap_Empty = () => this._colorMap == null || this._colorMap == undefined ? true : false;
    
    is_Status_Empty = () => this._statuses == null || this._statuses == undefined ? true : false;

    is_Brightness_Empty = () => this._brightness == null || this._brightness == undefined ? true : false;
}
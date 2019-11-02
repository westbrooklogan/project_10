import { Shape } from "./Shape";
import { NoDataError } from "../Errors/DataErrors";
import { colorMap } from "./colorMap";

// maps work flow data into shapes
export class ShapeMapper2 {

    // get/set the shape collection of the shape mapper
    get ShapeCollection() { return this._shapeCollection; }
    set ShapeCollection(shapeCollection) { this._shapeCollection = shapeCollection; }
    get ColorMap() { return this._colorMap; }
    set ColorMap(colorMap) { this._colorMap = colorMap; }

    // constructor that maps Data
    constructor(dataToMap) {    
        if(dataToMap == undefined || dataToMap == null)
            throw NoDataError;

            //this._shapeCollection = map_Data_To_Group(workFlowData);
            this.ShapeCollection = this.map_Data_To_Group(dataToMap);
        
    }

    // make a new object with the given features
    _makeShape = (name, status, children, width) => {
        var shape = new Shape(); // make a new shape
        // give it a width
        shape.Width = (width == undefined || width == null) ? 160 : width;
        // give it text or an empty string
        shape.Text = name;
        // give it a status
        if(!(status in colorMap))
            shape.Status = this._generate_Status(status);
        shape.Status = status;


        var shapeChildren = [];

        if(children != undefined && children != null && children.length)
            children.map(child => {
                var childStatus = (child.Status == undefined || child.Status == null) ?
                    status : child.Status;

                shapeChildren.push(this._makeShape(child.Name, childStatus, child.Children));
            });
        
        return {
            Shape: shape,
            Children: shapeChildren,
            Y_Height: shapeChildren.length
        };
    }
         
    change_Shapes_To_Max_Height = (shapeCollection, height) =>  
        shapeCollection.map(item => {
            //console.log(item.Level);
            (item.Level == undefined || item.Level == null) ?
                item.Shape.Height = height :
                    item.Level.Shape.Height = item.MaxYHeight * height;

            var children = item.Children;
            var content = item.Content;

            if(content != undefined && content != null && content.length)
                content.map(shape => this.change_Shapes_To_Max_Height(shape, height));
                    
            if(children != undefined && children != null && children.length)
                this.change_Shapes_To_Max_Height(children, height);

            return item;
        });

    _map_To_Group = data => {  
        if(data == undefined || data == null)
            throw NoDataError;

        var shapeCollection = [];
        var maxHeight = 0;
        var last = data.length - 1;
        var width = [];

        for(let i = last; i > 0; i--) {
            var level = data[i].Level;
            var content = data[i].Content;
            var maxYHeight = 0;
            var contentWidth = [];

            var result = {
                Level: this._makeShape(level, "Level", null, 160),
                
                Content : content.map((item, index) => {
                    var w = (width[index] == undefined || width[index] == null) ? 160 : width[index];

                    contentWidth.push(item.length * w);

                    return item.map(itemInfo => {
                        var status = (itemInfo.Status == undefined || itemInfo.Status == null) ?
                            status = level : status = itemInfo.Status;

                        var shape = this._makeShape(itemInfo.Name, status, itemInfo.Children, w);
                        maxHeight = Math.max(maxHeight, shape.Shape.Height);
                        maxYHeight = Math.max(maxYHeight, shape.Y_Height);
                        return shape;
                    });
                }),

                MaxYHeight : maxYHeight + 1
            };

            shapeCollection.push(result);
            width = contentWidth;
        }

        var level = data[0].Level;
        var content = data[0].Content;
        var previousContent = data[1].Content;

        var maxYHeight = 0;
        var contentWidth = [];

        var result = {
            Level: this._makeShape(level, "Level", null, 160),
            
            Content : content.map((item, index) => {
                var w = previousContent.length * width[index];
                
                contentWidth.push(item.length * w);

                return item.map(itemInfo => {
                    var status = (itemInfo.Status == undefined || itemInfo.Status == null) ?
                        status = level : status = itemInfo.Status;

                    var shape = this._makeShape(itemInfo.Name, status, itemInfo.Children, w);
                    maxHeight = Math.max(maxHeight, shape.Shape.Height);
                    maxYHeight = Math.max(maxYHeight, shape.Y_Height);
                    return shape;
                });
            }),

            MaxYHeight : maxYHeight + 1
        };

        shapeCollection.push(result);

        shapeCollection = this.change_Shapes_To_Max_Height(shapeCollection, maxHeight);

        shapeCollection = this._shapes(shapeCollection);
        
        return shapeCollection;
    }
    
    _shapes = (shapeCollection) => 
        shapeCollection.map(collection => {
            var children = collection.Children;
            var content = collection.Content;
            
            (collection.Level == undefined || collection.Level == null) ?
                collection.Shape.makeShape():
                    collection.Level.Shape.makeShape();

            if(children != undefined && children != null && children.length)
                this._shapes(children);

            if(content != undefined && content != null && content.length)
                content.map(shapes =>
                    this._shapes(shapes)
                );
            
            return collection;
        });

    // maps all the workflow elements to shapes and groups them
    map_Data_To_Group = dataToMap => {
        
        if(dataToMap == undefined || dataToMap == null)
            throw NoDataError;
    
        const content = dataToMap.Content;
        var collection = [];

        content.forEach(item => collection.push(this._map_To_Group(item)));

        return collection;
    }

    _generate_Status = (status) => {
        var newColor;
        do{
            newColor = '#'+Math.floor(Math.random()*16777215).toString(16);
            if(newColor.length < 7) { newColor += "0" }       
            var birghtness = this._brightness_Calc(newColor);
        }while(birghtness < 15 || birghtness > 85);
    
        colorMap[status] = newColor;
    
        //return colorMap[status];
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

}


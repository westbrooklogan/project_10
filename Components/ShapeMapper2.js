import { Shape } from "./Shape";
import { NoDataError } from "../Errors/DataErrors";
import { colorMap } from "./colorMap";
import { ColorMapper } from "./ColorMapper";

// maps work flow data into shapes
export class ShapeMapper2 {

    // get/set the shape collection of the shape mapper
    get ShapeCollection() { return this._shapeCollection; }
    set ShapeCollection(shapeCollection) { this._shapeCollection = shapeCollection; }
    get ColorMap() { return this._colorMap; }
    set ColorMap(colorMap) { this._colorMap = colorMap; }

    // constructor that maps Data
    constructor(dataToMap, colormapper) {    
        if(dataToMap == undefined || dataToMap == null)
            throw NoDataError;
        this.mappedcolors = colormapper;
            //this._shapeCollection = map_Data_To_Group(workFlowData);
            this.ShapeCollection = this.map_Data_To_Group(dataToMap);
    }

    // make a new object with the given features
    _makeShape = (name, status, children, width) => {
        var shape = new Shape(); // make a new shape
        // give it a width
        shape.Width = (width == undefined || width == null) ? 240 : width;
        // give it text or an empty string
        shape.Text = name;
        
        // give it a status and generate random colors and
        // their respective brightness for statuses that don't 
        // already map to a color if the status exists then just map it
        if(status in colorMap) {
            var color = colorMap[status];
            var brightness = this.mappedcolors._brightness_Calc(color);
            this.mappedcolors._addNewstatus(status, color, brightness);
        }
         else
            this.mappedcolors._generate_Status(status);
    
   
        shape.Status = status;

        // the text color should be black for lighter colors and 
        // white for darker colors
        shape.adjustTextColor(this.mappedcolors._brightness[status]);

        var shapeChildren = [];

        // if the shape has children then perform this operation on each child
        if(children != undefined && children != null && children.length)
            children.map(child => {
                var childStatus = (child.Status == undefined || child.Status == null) ?
                    status : child.Status;

                shapeChildren.push(this._makeShape(child.Name, childStatus, child.Children, width));
            });
        
        // return the shape with its current height.
        return {
            Shape: shape,
            Children: shapeChildren,
            Y_Height: shapeChildren.length
        };
    }
    
    // adjusting the shapes height according the shape with the 
    // greatest height.
    change_Shapes_To_Max_Height = (shapeCollection, height) =>  
        shapeCollection.map(item => {
            // if its is a level the set the level's height 
            // according to all the total height of all its children
            (item.Level == undefined || item.Level == null) ?
                item.Shape.Height = height :
                    item.Level.Shape.Height = item.MaxYHeight * height;

            // if it has children or content then perform this operation
            // on them. Note: can't have both, it is either a level with
            // content or it is a content item with children
            var children = item.Children;
            var content = item.Content;

            if(content != undefined && content != null && content.length)
                content.map(shape => this.change_Shapes_To_Max_Height(shape, height));
                    
            if(children != undefined && children != null && children.length)
                this.change_Shapes_To_Max_Height(children, height);

            return item;
        });
    
    // map the data to a group
    _map_To_Group = data => {  
        if(data == undefined || data == null)
            throw NoDataError;

        var shapeCollection = [];
        var maxHeight = 0;
        var last = data.length - 1;
        var width = [];

        // must map the data in reverse order
        // must know the width of children to 
        // know the width of the parent
        for(let i = last; i > 0; i--) {
            var level = data[i].Level;
            var content = data[i].Content;
            var maxYHeight = 0;
            var contentWidth = [];

            // the result
            var result = {
                // make a shape for the level
                Level: this._makeShape(level, "Level", null, 240),
               
                // make the shape for each item in the content
                Content : content.map((item, index) => {
                    // the widht should be based on the width of the last processed items
                    var w = (width[index] == undefined || width[index] == null) ? 240 : width[index];

                    // the width of the current item should be stored for use 
                    // in next iteration of item operations. the length is 
                    // the number of items times the width so the next item
                    // with have a width that spans the next level down
                    contentWidth.push(item.length * w);

                    // process each item
                    return item.map(itemInfo => {
                        // get the status if it exists otherwise color it based on the level
                        // in which it is located
                        var status = (itemInfo.Status == undefined || itemInfo.Status == null) ?
                            status = level : status = itemInfo.Status;

                        // make the shape
                        var shape = this._makeShape(itemInfo.Name, status, itemInfo.Children, w);
                        // the element with the biggest height
                        maxHeight = Math.max(maxHeight, shape.Shape.Height);
                        // the element with the most children
                        maxYHeight = Math.max(maxYHeight, shape.Y_Height);
                        return shape;
                    });
                }),
                // the most number of children plus the parent element
                MaxYHeight : maxYHeight + 1
            };
            // push onto the collection and use the width
            // of current items processed be used for next
            // iteration of item processing
            shapeCollection.push(result);
            width = contentWidth;
        }

        /********************************************************
         * the below code performs the same operation above but *
         * for the last element in the list so refer to the     *
         * inline comments in the for loop above                *
         ********************************************************/   
        var level = data[0].Level;
        var content = data[0].Content;
        var previousContent = data[1].Content;

        var maxYHeight = 0;
        var contentWidth = [];

        var result = {
            Level: this._makeShape(level, "Level", null, 240),
            
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

        // change all the shapes' height to the max height found
        shapeCollection = this.change_Shapes_To_Max_Height(shapeCollection, maxHeight);
        
        // actually bind the textbox and rectangles together in a group
        shapeCollection = this._shapes(shapeCollection);
        
        return shapeCollection;
    }
    
    //bind the textbox and rectangles together in a group
    _shapes = (shapeCollection) => 
        shapeCollection.map(collection => {
            var children = collection.Children;
            var content = collection.Content;
            // make bind to group for either level or content
            (collection.Level == undefined || collection.Level == null) ?
                collection.Shape.makeShape():
                    collection.Level.Shape.makeShape();

            // bind to group for children or content. Remember that only levels
            // have content and content elements have children, never both
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
}
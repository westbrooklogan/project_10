import { colorMap } from "colorMap";
import { Shape } from "Shape";

// constants for workflow levels
const WORKSTREAM = "Workstream",
      PORTFOLIO =  "Portfolio",
      L1_BUSINESS_PROCESS = "L1 Business Process",
      L2_BUSINESS_PROCESS = "L2 Business Process",
      L3_BUSINESS_PROCESS = "L3 Business Process";

// maps work flow data into shapes
class ShapeMapper {

    // constructor
    ShapeMapper() {

    }

    // constructor that maps workflow data
    ShapeMapper = workFlowData => {
        if(workFlowData == undefined || workFlowData == null)
            return null;

        this._shapeCollection = map_Data_To_Group(workFlowData, 0);
    }

    // maps all the workflow elements to shapes and groups them
    map_Data_To_Group = (workFlowData, currentLevel) => {
        if(workFlowData == undefined || workFlowData != null)
            return null;
        
        // get each workflow level element from the workflow data
        const workStream = workFlowData[WORKSTREAM],
              portfolio = workFlowData[PORTFOLIO],
              l1_BusinessProcess = workFlowData[L1_BUSINESS_PROCESS],
              l2_BusinessProcess = workFlowData[L2_BUSINESS_PROCESS],
              l3_BusinessProcess = workFlowData[L3_BUSINESS_PROCESS];

        // if any of the workflow elements are undefined or null or empty then error
        if(workStream == undefined || workStream == null || workStream.length == 0 ||
            portfolio == undefined || portfolio == null || portfolio.length == 0 ||
            l1_BusinessProcess == undefined || l1_BusinessProcess == null || l1_BusinessProcess.length == 0 ||
            l2_BusinessProcess == undefined || l2_BusinessProcess == null || l2_BusinessProcess.length == 0 ||
            l3_BusinessProcess == undefined || l3_BusinessProcess == null || l3_BusinessProcess.length == 0) {
            
            alert("Please makes sure no business level is undefined or null.\n");
            return null;
        }
        
        
    }

    /* map an object representing a workflow
       data element into a shape and text
       object and group them together */
    _map_Data_To_Group = (data, workFlowLevel, currentLevel) => {
        if(data == undefined || data == null)
            return null;
        
        const color = _decide_Color(
            (workFlowLevel == "L3 Business Process") ? data["status"] : data[workFlowLevel]
        );
        
        if(color == null) {
            alert("Please make sure every element has a color.\n");
            return null;
        }
        
        // get the text from workflow data element
        const text = this._map_Data_To_Text(data["Name"]);
        const rect = this._rectangle().set({
            fill: color, // set the fill of the rectangle
            width: 160,
            height: 80
        });

        return new Shape(new group([text, rect]));
    }

    // map text into a fabricjs text object
    _map_Data_To_Text = text => {

        if( text == undefined && text == null && text == "")
            return null;
        
        return (
            // fabricjs text object
            // the text argument is a string
            new fabric.Text(text, {
                fontSize: 10, // size of text
                originX: 'center', // horizontal orientation to origin
                originY: 'center' // vertical orientation to origin
            })
        );        
    }

    // returns a rectangle object 
    _rectangle = () => 
        (
            // fabric js rectangle
            new fabric.Rect({
                stroke: 'black', // border color
                strokeWidth: 1, // border width
                originX: 'center', // horizontal orientation to origin
                originY: 'center' // vertical orientation to origin
            })
        );
    
    // determine the color of a rectangle
    _determine_Color = status => {
        if(status != undefined && status != null)
             return colorMap[status];
        
        return null;
    }
}
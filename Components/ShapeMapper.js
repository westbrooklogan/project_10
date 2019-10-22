import { colorMap } from "./colorMap";
import { Shape } from "./Shape";
import { fabric } from "fabric";

// constants for workflow levels
const WORKSTREAM = "Workstream",
      PORTFOLIO =  "Portfolio",
      L1_BUSINESS_PROCESS = "L1 Business Process",
      L2_BUSINESS_PROCESS = "L2 Business Process",
      L3_BUSINESS_PROCESS = "L3 Business Process",
      WORKFLOW_LEVEL = "Workflow Level",
      DEFAULT_WIDTH = 160,
      DEFAULT_HEIGHT = 80,
      PADDING = 10;

// maps work flow data into shapes
export class ShapeMapper {
    // get/set the shape collection of the shape mapper
    get ShapeCollection() { return this._shapeCollection; }
    set ShapeCollection(shapeCollection) { this._shapeCollection = shapeCollection; }

    // constructor that maps workflow data
    constructor(workFlowData) {
        if(workFlowData != undefined || workFlowData != null)
            //this._shapeCollection = map_Data_To_Group(workFlowData);
            this.ShapeCollection = this.map_Data_To_Group(workFlowData);
    }

    // maps all the workflow elements to shapes and groups them
    map_Data_To_Group = workFlowData => {
        
        if(workFlowData == undefined || workFlowData == null)
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
            
            console.error("Please makes sure no business level is undefined or null.\n");
            return null;
        }
        
        var maxHeight = 0;
        var maxDepth = 0;

        const textBoxes = l3_BusinessProcess.map(processElements => {
            maxDepth = Math.max(maxDepth, processElements.length);

            return processElements.map(processElement => {
                const text = this._map_Data_To_Text(processElement["Name"], DEFAULT_WIDTH),
                      height = text.height;

                maxHeight = Math.max(maxHeight, height);

                return { text: text, status: processElement["Status"] };
            })
        });

        maxHeight = Math.max(maxHeight, DEFAULT_HEIGHT);

        const l3ShapeGroups = textBoxes.map(textObjects => 
            textObjects.map(textObject => {
                const textBox = textObject.text, status = textObject.status;

                return this._map_Text_To_Group(textBox, status, maxHeight);
            })
        );
        
        const l3Height = maxHeight * maxDepth; 

        const l3Shape = this._map_Data_To_Group(L3_BUSINESS_PROCESS, WORKFLOW_LEVEL, DEFAULT_WIDTH, l3Height);
        
        const l1ElementWidth = [];

        const l2ShapeGroups = l2_BusinessProcess.map(processElements => {
            l1ElementWidth.push(processElements.length * DEFAULT_WIDTH);

            return processElements.map(processElement => 
                this._map_Data_To_Group(processElement, L2_BUSINESS_PROCESS, DEFAULT_WIDTH, maxHeight)
            )
        });
        const l2Shape = this._map_Data_To_Group(L2_BUSINESS_PROCESS, WORKFLOW_LEVEL, DEFAULT_WIDTH, maxHeight);
        
        const portfolioElementWidth = [];

        const l1ShapeGroups = l1_BusinessProcess.map((processElements, index) => {
            portfolioElementWidth.push(processElements.length * l1ElementWidth[index]);

            return processElements.map(processElement =>
                this._map_Data_To_Group(processElement, L1_BUSINESS_PROCESS, l1ElementWidth[index], maxHeight));
        });
        const l1Shape = this._map_Data_To_Group(L1_BUSINESS_PROCESS, WORKFLOW_LEVEL, DEFAULT_WIDTH, maxHeight);

        let workStreamElementWidth = 0;

        const portfolioShapeGroups = portfolio.map((processElements, index) => {
            workStreamElementWidth += (portfolioElementWidth[index] * processElements.length);

            return processElements.map(processElement =>
                this._map_Data_To_Group(processElement, PORTFOLIO, portfolioElementWidth[index], maxHeight));
        });

        const portfolioShape = this._map_Data_To_Group(PORTFOLIO, WORKFLOW_LEVEL, DEFAULT_WIDTH, maxHeight);

        const workStreamShapeGroups = workStream.map((processElements, index) =>
            processElements.map(processElement =>
                this._map_Data_To_Group(processElement, WORKSTREAM, workStreamElementWidth, maxHeight)
        ));
        const workStreamShape = this._map_Data_To_Group(WORKSTREAM, WORKFLOW_LEVEL, DEFAULT_WIDTH, maxHeight);

        return (
            {
                workStreamShapes: {
                    level: workStreamShape, 
                    shapes: workStreamShapeGroups
                },
                portfolioShapes: {
                    level: portfolioShape,
                    shapes: portfolioShapeGroups
                },
                l1Shapes: {
                    level: l1Shape, 
                    shapes: l1ShapeGroups
                },
                l2Shapes: {
                     level: l2Shape, 
                     shapes: l2ShapeGroups 
                },
                l3Shapes: {
                    level: l3Shape,
                    shapes: l3ShapeGroups
                },
                maxHeight: maxHeight
            }
        )
    }

    _map_Data_To_Group = (name, status, tWidth, tHeight) => {
        if(name == undefined || name == null)
            return null;
        
        const color = this._determine_Color(status);

        if(color == null) {
            console.error("Please make sure every element has a color.\n");
            return null;
        }
        
        const text = this._map_Data_To_Text(name, tWidth);

        // get the text from workflow data element
        const rect = this._rectangle(color, tWidth, tHeight);

        return new fabric.Group([rect, text], {
            width: tWidth,
            height: tHeight
        });
    }

    /* map an object representing a workflow
       data element into a shape and text
       object and group them together */
    _map_Text_To_Group = (text, status, height) => {
        if(text == undefined || text == null)
            return null;

        const color = this._determine_Color(status);

        if(color == null) {
            console.error("Please make sure every element has a color.\n");
            return null;
        }
        
        const textWidth = text.width;
        // get the text from workflow data element
        const rect = this._rectangle(color, textWidth, height);

        return new fabric.Group([rect, text], {
            width: textWidth,
            height: height
        });
    }

    // map text into a fabricjs text object
    _map_Data_To_Text = (text, width) => {

        if( text == undefined && text == null && text == "")
            return null;
        
            // fabricjs text object
            // the text argument is a string
        const textBox = new fabric.Textbox(text, {
            fontSize: 16, // size of text
            originX: 'center', // horizontal orientation to origin
            originY: 'center', // vertical orientation to origin
            fixedWidth: width,
            width: width,
            textAlign: 'center'
        });
        
        const height = textBox.height;
        
        return textBox;
    }

    // returns a rectangle object 
    _rectangle = (color, width, height) =>
        (
            // fabric js rectangle
            new fabric.Rect({
                fill: color,
                width: width,
                height: height, 
                stroke: 'white', // border color
                strokeWidth: 2, // border width
                originX: 'center', // horizontal orientation to origin
                originY: 'center' // vertical orientation to origin
            })
        );
    
    // determine the color of a rectangle
    _determine_Color = status => {
        if(status == undefined && status == null)
             return null;
        
        return colorMap[status];
    }
}
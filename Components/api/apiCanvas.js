// retrieves all the necessary classes for building diagrams
import * as Canvas from "../DiagramClasses/Canvas_Module";

export const apiCanvas = (req, res, next) => {
      // get some data
      const diagramData = req.diagramData;

      // create all of the shapes based on the data
      const shapeMapper = new Canvas.ShapeMapper(diagramData, new Canvas.ColorMapper(diagramData.ColorMap));

      const collection = get_Collection(shapeMapper);
      const colorMap = get_ColorMap(diagramData);
      const ColorMap = new Canvas.ColorMapper(colorMap);

      // create the diagram by giving the shapes a location
      const diagramMaker = new Canvas.DiagramMaker(collection);
  
      const totalX = get_TotalX(diagramMaker),
            offsetX = get_offSetX(diagramMaker),
            offsetY = get_offSetY(diagramMaker);
  
      let totalY = get_TotalY(diagramMaker);

      // create a legend to hold information about the statuses of each diagram element
      // for a business process
      const legends = new Canvas.Legend(totalY, offsetX, shapeMapper.mappedcolors);

      totalY = get_TotalY(legends);

      // create a new canvas based on legend and shape data
      const staticCanvas = new Canvas.Canvas(diagramMaker.Shapes,  totalX + offsetX, totalY + offsetY, legends);

      // send the canvas to the user
      res.json({Canvas: staticCanvas})
}

const get_ColorMap = obj => {
      if(obj == null || obj == undefined)
            return null;
    
      const colorMap = obj.ColorMap;

      if(colorMap == null || colorMap == undefined)
            return null;
    
      return colorMap;
}

const get_Collection = shapeMapper => { 
      if(shapeMapper == null || shapeMapper == undefined)
            return null;
      
      const collection = shapeMapper.ShapeCollection;

      if(collection == null || collection == undefined)
            return null;
      
      return collection;
}

const get_TotalX = diagramMaker => {
      if(diagramMaker == null || undefined)
            return null;
      
      const totalX = diagramMaker.TotalX;

      if(totalX <= 0)
            return null;
      
      return totalX;
}

const get_TotalY = diagramMaker => {
      if(diagramMaker == null || undefined)
            return null;
      
      const totalY = diagramMaker.TotalY;

      if(totalY <= 0)
            return null;
      
      return totalY;
}

const get_offSetX = diagramMaker => {
      if(diagramMaker == null || undefined)
            return null;
      
      const offsetX = diagramMaker.OffsetX;

      if(offsetX < 0)
            return null;
      
      return offsetX;
}

const get_offSetY = diagramMaker => {
      if(diagramMaker == null || undefined)
            return null;
      
      const offsetY = diagramMaker.OffsetY;

      if(offsetY < 0)
            return null;
      
      return offsetY;   
}


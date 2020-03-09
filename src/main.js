import { obj } from "../Components/parser"; 
import { Canvas } from "../Components/Canvas";
import { ImageMaker } from "../Components/ImageMaker";
import { ShapeMapper } from "../Components/ShapeMapper";
import { DiagramMaker } from "../Components/DiagramMaker";
import {ColorMapper} from "../Components/ColorMapper"
import { Legend } from "../Components/Legends";

export function main() {
  const shapeMapper = new ShapeMapper(obj, new ColorMapper(obj.ColorMap));

  const collection = get_Collection(shapeMapper);
  const colorMap = get_ColorMap(obj);
  const ColorMap = new ColorMapper(colorMap);

  const diagramMaker = new DiagramMaker(collection);
  
  const totalX = get_TotalX(diagramMaker);
        offsetX = get_offSetX(diagramMaker);
        offsetY = get_offSetY(diagramMaker);
  
  let totalY = get_TotalY(diagramMaker);

  const legends = new Legend(totalY, offsetX, shapeMapper.mappedcolors);

        totalY = get_TotalY(legends);

  const canvas = new Canvas(diagramMaker.Shapes,  totalX + offsetX, totalY + offsetY, legends);
  
  const imageMaker = new ImageMaker(canvas.canvas);
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

main();



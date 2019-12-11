import { obj } from "../Components/parser"; 
import { Canvas } from "../Components/Canvas";
import { ImageMaker } from "../Components/ImageMaker";
import { ShapeMapper } from "../Components/ShapeMapper";
import { DiagramMaker } from "../Components/DiagramMaker";
import {ColorMapper} from "../Components/ColorMapper"
import { Legend } from "../Components/Legends";

export function main() {
  const shapeMapper = new ShapeMapper(obj, new ColorMapper(obj.ColorMap));
  const collection = shapeMapper.ShapeCollection;
  
  const diagramMaker = new DiagramMaker(collection);
  
  const totalX = diagramMaker.TotalX,
        offsetX = diagramMaker.OffsetX,
        offsetY = diagramMaker.OffsetY;
  
  var totalY = diagramMaker.TotalY;

  const legends = new Legend(totalY, offsetX, shapeMapper.mappedcolors);

        totalY = legends.TotalY;

  const canvas = new Canvas(diagramMaker.Shapes,  totalX + offsetX, totalY + offsetY, legends);
  
  const imageMaker = new ImageMaker(canvas.canvas);
}

main();



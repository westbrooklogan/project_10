import { obj, obj2 } from "./Components/parser";
import { ShapeMapper } from "./Components/ShapeMapper";
import { DiagramMaker } from "./Components/DiagramMaker";
import { Canvas } from "./Components/Canvas";
import { ImageMaker } from "./Components/ImageMaker";
import { ShapeMapper2 } from "./Components/ShapeMapper2";
import { DiagramMaker2 } from "./Components/DiagramMaker2";
import { colorMap } from "./Components/colorMap";
import {ColorMapper} from "./Components/ColorMapper"
import { Legend } from "./Components/Legends";

function main() {
  const shapeMapper = new ShapeMapper2(obj2, new ColorMapper(obj2.ColorMap));
  const collection = shapeMapper.ShapeCollection;
  
  const diagramMaker = new DiagramMaker2(collection);
  
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

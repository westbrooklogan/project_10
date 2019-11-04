import { obj, obj2 } from "./Components/parser";
import { ShapeMapper } from "./Components/ShapeMapper";
import { DiagramMaker } from "./Components/DiagramMaker";
import { Canvas } from "./Components/Canvas";
import { ImageMaker } from "./Components/ImageMaker";
import { ShapeMapper2 } from "./Components/ShapeMapper2";
import { DiagramMaker2 } from "./Components/DiagramMaker2";
import { colorMap } from "./Components/colorMap";
import {ColorMapper} from "./Components/ColorMapper"

function main() {
  const shapeMapper = new ShapeMapper2(obj2, new ColorMapper());
  const collection = shapeMapper.ShapeCollection;
  
  const diagramMaker = new DiagramMaker2(collection);
  
  const totalX = diagramMaker.TotalX,
        totalY = diagramMaker.TotalY,
        offsetX = diagramMaker.OffsetX,
        offsetY = diagramMaker.OffsetY;

  const canvas = new Canvas(diagramMaker.Shapes,  totalX + offsetX, totalY + offsetY);
  
  const imageMaker = new ImageMaker(canvas.canvas);
}

main();

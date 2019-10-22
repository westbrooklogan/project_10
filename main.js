import { fabric } from "fabric";
import { obj } from "./Components/parser";
import { ShapeMapper } from "./Components/ShapeMapper";
import { DiagramMaker } from "./Components/DiagramMaker";
import { Canvas } from "./Components/Canvas";
import { ImageMaker } from "./Components/ImageMaker";

function main() {
  const shapeMapper = new ShapeMapper(obj);

  if(shapeMapper == undefined || shapeMapper == null) {
    console.error("Make sure the shapeMapper is defined and not null");
    return null;
  }

  const diagramMaker = new DiagramMaker(shapeMapper.ShapeCollection);

  if(diagramMaker == undefined || diagramMaker == null) {
    console.error("Make sure the shapeConnector is defined and not null");
    return null;
  }

  const canvas = new Canvas(diagramMaker.Shapes);

  if(canvas == undefined || diagramMaker == null) {
    console.error("Make sure the canvas is defined and not null");
    return null;
  }

  const imageMaker = new ImageMaker(canvas.canvas);
}

main();

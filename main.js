import { fabric } from "fabric";
import { obj } from "./parser";
import { ShapeMapper } from "./ShapeMapper";
import { ShapeConnector } from "./ShapeConnector";
import { Canvas } from "./Canvas";
import { ImageMaker } from "./ImageMaker";

function main() {
  const shapeMapper = new ShapeMapper(obj);

  if(shapeMapper == undefined || shapeMapper == null) {
    console.error("Make sure the shapeMapper is defined and not null");
    return null;
  }

  const shapeConnector = new ShapeConnector(shapeMapper.ShapeCollection);

  if(shapeConnector == undefined || shapeConnector == null) {
    console.error("Make sure the shapeConnector is defined and not null");
    return null;
  }

  const canvas = new Canvas(shapeConnector.Shapes);

  if(canvas == undefined || shapeConnector == null) {
    console.error("Make sure the canvas is defined and not null");
    return null;
  }

  const imageMaker = new ImageMaker(canvas.canvas);
}

main();

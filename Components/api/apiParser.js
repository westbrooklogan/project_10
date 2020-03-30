import { diagramData } from "../DiagramClasses/Parser"

export const apiParser = (req, res, next) => {
    if(diagramData != undefined && diagramData != null) {
    req.diagramData = diagramData;
    next();
    } else
        next(new Error("There is no data to process"));
}
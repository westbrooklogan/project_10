///Middleware for making PNG images
import { apiImageMaker } from "../../Components/api/apiImageMaker";
//Middleware for retrieving data
import { apiParser } from "../../Components/api/apiParser";
//Middleware for using data to create a diagram
import { apiCanvas } from "../../Components/api/apiCanvas";

//setup express
const express = require('express');
/*********************************************
 * initialize a router for urls              *
 * Note that all routes for these routes are *
 * {HOME_URL}/diagrammaker/{make_png, etc...}*
 *********************************************/
const router = express.Router();

//get a diagram based on some data
router.get('/', apiParser, apiCanvas);

// make an image based on some diagram
router.get('/make_png', apiImageMaker);

module.exports = router;
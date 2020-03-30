/*********************************************
 * Main server file for the ExpressJS Server *
 *********************************************/
// get the port from the environment file
require('dotenv').config();
//create an express application
const express = require('express');
// route for the diagram backend **see ./routes/DiagramRoute
const DiagramRouter = require('./routes/DiagramRoute');11
//start application
const app = express();

// set up the body parser that accepts json 
app.use(express.json());
//set up the route
app.use('/diagrammaker', DiagramRouter);

//make application listen on the port from .env or 8091 as default
app.listen(process.env.PORT || 8091, () => console.log('Server Started'));




const http = require('http');
const main = require('main')
const server = http.createServer();

server.on('request', (request, response) => {
    const {method, url, headers} = request;
    console.log(request);
    console.log("hello world");

}).listen(9000);
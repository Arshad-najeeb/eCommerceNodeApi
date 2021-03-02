
var http = require('http'); // Import Node.js core module
var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.post('/', function(request, response){
    console.log(request.body.username);
    console.log(request.body.email);
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify({ status: req.email}));  
    response.end(); 
});
var server = http.createServer(function (req, res) {   //create web server
    if (req.url == '/UserRegister') { //check the URL of the current request                  
        res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ status: req.email}));  
            res.end();  
    
    }
    else if (req.url == "/student") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is student Page.</p></body></html>');
        res.end();
    
    }
    else if (req.url == "/admin") {
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write('<html><body><p>This is admin Page.</p></body></html>');
        res.end();
    
    }
    else
        res.end('Invalid Request!');

});

server.listen(5000); //6 - listen for any incoming requests

console.log('Node.js web server at port 5000 is running..')
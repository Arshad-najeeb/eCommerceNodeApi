var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var app = express();
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
var buffer = require('buffer');
var path = require('path');
var fs = require('fs');
var crypto = require('crypto');

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

var server = app.listen(5000, function () {

    app.post('/UserRegister', function(request, response){
         // Connect to the db
            MongoClient.connect("mongodb://localhost:27017/project4", function (err, database) {
                const db = database.db('project4')
                db.collection('user', function (err, collection) {
                    
                    db.collection('user').count(function (err, count) {
                        let user = 
                        {
                            Id:count+1,
                            email: request.body.email,
                            password:crypto.createHash('md5').update(request.body.password).digest('hex'),
                            username: request.body.username,
                            shippingaddress: request.body.address
                        }
                    collection.insert(user);
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    response.write(JSON.stringify({ status: "1"}));  
                    response.end(); 
                        if (err) throw err;
                    });
                });       
            });
    });
    app.post('/AuserRegister', function(request, response){
        // Connect to the db
           MongoClient.connect("mongodb://localhost:27017/project4", function (err, database) {
               const db = database.db('project4')
               db.collection('auser', function (err, collection) {
                   
                   db.collection('auser').count(function (err, count) {
                       let auser = 
                       {
                           Id:count==0?1000:count+1000,
                           email: request.body.email,
                           username: "Anonymous",
                           shippingaddress: request.body.address
                       }
                   collection.insert(auser);
                   var query = { email: request.body.email };
                   db.collection("auser").find(query).toArray(function(err, result) {
                    if (err) throw err;
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    let r={
                        Id:result[0].Id,
                        email:result[0].email,
                        username:result[0].username,
                        address:result[0].shippingaddress
                    }
                   response.write(JSON.stringify({ status: "1",data:r}));  
                   response.end(); 
                  });
                       if (err) throw err;
                   });
               });       
           });
   });


    app.post('/Login', function(request, response){
        // Connect to the db
        MongoClient.connect("mongodb://localhost:27017/project4", function (err, database) {
            const db = database.db('project4')
            var query = { email: request.body.email,password: crypto.createHash('md5').update(request.body.password).digest('hex') };
            db.collection("user").find(query).toArray(function(err, result) {
             if (err) throw err;
             response.writeHead(200, { 'Content-Type': 'application/json' });
             if(result[0]!=null){
                let r={
                    Id:result[0].Id,
                    email:result[0].email,
                    username:result[0].username,
                    address:result[0].shippingaddress
                }
                response.write(JSON.stringify({ status: "1",data:r}));  
             } else{
                response.write(JSON.stringify({ status: "-1",data:"Invalid username or Password"}));  
             }
            response.end(); 
           });       
        });
       });

       app.get('/getProducts', function(request, response){
        // Connect to the db
        MongoClient.connect("mongodb://localhost:27017/project4", function (err, database) {
            const db = database.db('project4')
            db.collection("product").aggregate([
                {$lookup:
                            {
                                from: 'comments',
                                localField: 'id',
                                foreignField: 'product',
                                as: 'Comments'
                            }
                }
            ]).toArray(function(err, result) {
             if (err) throw err;
             response.writeHead(200, { 'Content-Type': 'application/json' });
             if(result[0]!=null){
                let r=[];
                for(let i in result){
                    r[i]={
                        id:result[i].id,
                        title:result[i].Title,
                        description:result[i].description,
                        thumbnail_url:result[i].image,
                        price:result[i].pricing,
                        category:"macbook",
                        quantity:10,
                        Comments:result[i].Comments!=null?result[i].Comments:null
                    }
                }
                response.write(JSON.stringify({ status: "1",data:r}));  
             } else{
                response.write(JSON.stringify({ status: "-1",data:"data not found"}));  
             }
            response.end(); 
           });       
        });
       });
       console.log('Node server is running..');
    });
    app.post('/InsertComment', function(request, response){
        // Connect to the db
           MongoClient.connect("mongodb://localhost:27017/project4", function (err, database) {
               const db = database.db('project4')
               db.collection('comments', function (err, collection) {
                   
                   db.collection('comments').count(function (err, count) {
                    let imagename;
                       if(request.body.image!=null){
                        var result           = '';
                        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                        var charactersLength = characters.length;
                        for ( var i = 0; i < charactersLength; i++ ) {
                           result += characters.charAt(Math.floor(Math.random() * charactersLength));
                        }
                         imagename="http://192.168.2.33:8081/"+result+"."+request.body.image.fileExtension;
                         var buf = Buffer(request.body.image.value, 'base64');
    
                        path='./images/'+result+'.'+request.body.image.fileExtension;
                        fs.writeFile(path, buf, { flag: 'w' }, function(err) {
                            if (err) 
                                return console.error(err); 
                        });
                       }
                       let comment = 
                       {
                           Id:count+1,
                           text: request.body.comment,
                           rating: request.body.rating,
                           user: request.body.user,
                           username: request.body.username,
                           product: request.body.product,
                           image:request.body.image!=null?imagename:null
                       }
                   collection.insert(comment);
                   response.writeHead(200, { 'Content-Type': 'application/json' });
                   response.write(JSON.stringify({ status: "1"}));  
                   response.end(); 
                       if (err) throw err;
                   });
               });       
           });
    });
    
    app.post('/UpdateUser', function(request, response){
        // Connect to the db
           MongoClient.connect("mongodb://localhost:27017/project4", function (err, database) {
               const db = database.db('project4')
                var myquery = { Id: request.body.Id };
                var newvalues = { $set: {email: request.body.email,
                    username: request.body.username,
                    shippingaddress: request.body.address } };
                    db.collection("user").updateOne(myquery, newvalues, function(err, res) {
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        if (err){
                            response.write(JSON.stringify({ status: "-1"}));  
                        } else{
                            var query = { Id:request.body.Id};
            db.collection("user").find(query).toArray(function(err, result) {
             if (err) throw err;
             if(result[0]!=null){
                let r={
                    Id:result[0].Id,
                    email:result[0].email,
                    username:result[0].username,
                    address:result[0].shippingaddress
                }
                response.write(JSON.stringify({ status: "1",data:r}));  
             } else{
                response.write(JSON.stringify({ status: "-1"}));  
             }
            response.end(); 
           });     
                        }
                      });
           });
    });
    
    app.post('/SetCart', function(request, response){
        // Connect to the db
           MongoClient.connect("mongodb://localhost:27017/project4", function (err, database) {
               const db = database.db('project4')
               db.collection('cart', function (err, collection) {
                   let pids = request.body.pids;
                   let uids = request.body.uid;
                   let pquantity = request.body.pquantity;
                   for(let i in pids){
                    db.collection('cart').count(function (err, count) {
                        let cart=
                        {
                            products: pids[i],
                            quantities: pquantity[i],
                            user:uids
                        }
                    collection.insert(cart);
                    
                        if (err) throw err;
                    });
                   }
                   response.writeHead(200, { 'Content-Type': 'application/json' });
                   response.write(JSON.stringify({ status: "1"}));  
                   response.end(); 
               });       
           });
    });
    
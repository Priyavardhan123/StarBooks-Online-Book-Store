var http = require('http');
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');

var app = express();

app.use(bodyparser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

var MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://admin:admin@democluster-shard-00-00.kbhmv.mongodb.net:27017,democluster-shard-00-01.kbhmv.mongodb.net:27017,democluster-shard-00-02.kbhmv.mongodb.net:27017/StarBooks?ssl=true&replicaSet=atlas-zh4oe4-shard-0&authSource=admin&retryWrites=true&w=majority";

try {
  mongoose.connect( uri, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
  console.log("connected"));  
  }catch (error) { 
  console.log("could not connect");    
}

app.post('/api/register', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    var user = {
      user_type : req.body.user_type,
      name : req.body.name,
      username : req.body.username,
      password : req.body.pass,
      email : req.body.email,
      contact : req.body.contact
    };
    dbo.collection("Users").insertOne(user, function (err, res) {
      if (err) throw err;
      console.log("1 record inserted");
      db.close();
    });
  });    
});

app.post('/api/login', function(req,res ){

  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    dbo.collection("Users").find({}).toArray(function(err,result){
      var i;
      for ( i=0 ; i<result.length ; i++ )
      {
        if (result[i].username==req.body.username && result[i].password==req.body.password && result[i].user_type==req.body.user_type)
        {
          res.send({success: "true"});
          break;
        }
      }
      if (i==result.length)
        res.send({success: "false", message: "Incorrect Username or password"});
      db.close();
    });
  });
});

app.get('/api/get_books', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    dbo.collection("Books").find({}).toArray(function(err,result){
      
      console.log(result);
      res.send({success: "true", book: result});
      db.close();
    });
  });
});

app.get('/api/get_user_details', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    dbo.collection("Users").find({username: req.query.username}).toArray(function(err,result){
      console.log(result);
      res.send({success: "true", user: result});
      db.close();
    });
  });
});


app.get('/api/get_cart', function(req,res ){

  let Books = []

  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var db1 = db.db("StarBooks");
    db1.collection("Orders").find({username: req.query.username, status: "in_cart"}).toArray(  function(err,result){
      for ( var i = 0 ; i<result.length ; i++ )
        Books.push((result[i].book_id) );
      res.send({success: "true", book_ids: Books, orders: result});
      db.close();
    });
  });
});

app.get('/api/get_order_history', function(req,res ){

  let Books = []

  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var db1 = db.db("StarBooks");
    db1.collection("Orders").find({username: req.query.username, status: "ordered"}).toArray(  function(err,result){
      for ( var i = 0 ; i<result.length ; i++ )
        Books.push((result[i].book_id) );
      res.send({success: "true", book_ids: Books, orders: result});
      db.close();
    });
  });
});

app.get('/api/get_book_by_id', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var db1 = db.db("StarBooks");
    db1.collection("Books").find({}).toArray( function(err,result){
      for ( var i=0 ; i<result.length ; i++ )
        if (result[i]._id == req.query.id)
          res.send({success: "true", book: result[i]});
      db.close();
    });
  });
});

app.get('/api/get_address', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var db1 = db.db("StarBooks");
    db1.collection("Users").find({username: req.query.username}).toArray( function(err,result){
      console.log(result);
      res.send({success: "true", addresses: result});
      db.close();
    });
  });
});

app.get('/api/place_order', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var db1 = db.db("StarBooks");
    
    db1.collection("Orders").updateMany({username: req.query.username}, {$set :{status: "ordered"}} , function (err, result) {
      if (err) throw err;
      console.log("Orders updated");
      res.send({success: true, message: "Order placed"});
      db.close();
    });
  });
});

app.post('/api/add_book', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    var book = {
      name : req.body.name,
      author : req.body.author,
      retailer : req.body.retailer,
      price : req.body.price,
      is_available : req.body.is_available,
      image : req.body.image,
      category : req.body.category,
      contact : req.body.contact
    };
    dbo.collection("Books").insertOne(book, function (err, res) {
      if (err) throw err;
      console.log("1 book inserted");
      db.close();
    });
  });    
});

app.post('/api/add_to_cart', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    var id = mongoose.Types.ObjectId(req.body.book_id)
    var order = {
      username : req.body.username,
      book_id : id,
      status : "in_cart",
      price : parseInt(req.body.price) * parseInt(req.body.quantity),
      date : req.body.date,
      quantity : req.body.quantity
    };
    // console.log(order);
    dbo.collection("Orders").insertOne(order, function (err, res) {
      if (err) throw err;
      console.log("1 order added to cart");
      db.close();
    });
  });    
});
app.post('/api/add_address', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    console.log(req.body);
    var query = {
      username : req.body.username
    };
    var new_record = {$set:{
      house_no : req.body.house_no,
      street_name : req.body.street_name,
      landmark : req.body.landmark,
      state : req.body.state,
      city : req.body.city,
      pin_code : req.body.pin_code,
      locality : req.body.locality
    }};

    dbo.collection("Users").findOneAndUpdate(query, new_record , function (err, res) {
      if (err) throw err;
      console.log("1 user updated");
      db.close();
    });
  });    
});

app.post('/api/remove_book', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    console.log(req.body.id);
    var id = mongoose.Types.ObjectId(req.body.id)
    var book = {
      _id : id
    };
    dbo.collection("Books").deleteOne(book, function (err, res) {
      if (err) throw err;
      if (res)
        console.log("1 book deleted");
      db.close();
    });
  }); 
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    console.log(req.body.id);
    var id = mongoose.Types.ObjectId(req.body.id)
    var order = {
      book_id : id
    };
    dbo.collection("Orders").deleteOne(order, function (err, res) {
      if (err) throw err;
      if (res)
        console.log("1 order deleted");
      db.close();
    });
  });    
});

app.post('/api/remove_from_cart', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    console.log(req.body.id);
    var id = mongoose.Types.ObjectId(req.body.id)
    var order = {
      _id : id
    };
    dbo.collection("Orders").deleteOne(order, function (err, res) {
      if (err) throw err;
      if (res)
        console.log("1 order removed from cart");
      db.close();
    });
  });    
});

app.post('/api/change_address', function(req,res ){
  MongoClient.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true},function(err, db) {
    if (err) throw err;
    var dbo = db.db("StarBooks");
    var user = {
      username : req.body.username
    };
    dbo.collection("Users").findOneAndUpdate(user, {$set : {house_no : ''}}, function (err, res) {
      if (err) throw err;
      db.close();
    });
  });    
});



app.listen(3000, function() { 
  console.log('Listening on port 3000..')
});

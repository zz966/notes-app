const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const article_router = require('./app/routers/article');
const user_router = require('./app/routers/user')
const auth = require('./app/middleware/auth')
const db = require('./app/models/mongoose')
const app = express();
const port = process.env.port || 3000
// mongoose.connect('mongodb://localhost/nodeDB', {useNewUrlParser: true,useCreateIndex:true});
// const db = mongoose.connection;


app.set('views',path.join(__dirname,'./app/views'));
app.set('view engine','pug');

// app.use((req,res,next)=>{    //this method should write before (app.use.router) 
//     console.log(req.method, req.path)
//     next()
// })


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// Set Public Folder
app.use(express.static(path.join(__dirname, './public')));

// parse application/json
app.use(bodyParser.json())

app.use('/',article_router);
app.use('/',user_router);



db.once('open',function(){
    console.log('connected to mongooseDB');
});

db.on('error',function(err){
    console.log(err);
});


app.listen(3000,function(req,res){
    console.log('server is listerning port '+ port)
});
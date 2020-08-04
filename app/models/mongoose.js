const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/nodeDB',{
    useNewUrlParser:true,
    useCreateIndex:true
})


var db = mongoose.connection;

module.exports = db;
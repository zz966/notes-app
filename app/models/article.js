let mongoose = require('mongoose');

// Article Schema
let articleSchema = mongoose.Schema({
  title:{
    type: String,
    required: true
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref:'User'       //reference to user model
  },
  content:{
    type: String,
    required: true
  },
  timeStamp:{
    type: Date,
    required: true
  }
}, {
  versionKey: false, // You should be aware of the outcome after set to false
  timestamps: true
});

var Article = mongoose.model('Article', articleSchema);
 module.exports = Article;

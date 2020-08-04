const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const Article = require('./article')


mongoose.set('useCreateIndex', true);
// User Schema
const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    trim:true,
    minlength:1,

  },
  email:{
    type: String,
    unique: true,
    required: true,
    trim:true,
    validate(value){
        if(!validator.isEmail(value)){
          throw new Error('Email is invalid');
        }
    }
  },
  password:{
    type: String,
    required: true,
    minlength:6,
    trim: true,
    validate(value){
      if(validator.contains(value,"password")){
        throw new Error('Email is invalid');
      }
    }
  },
  tokens:[{
    token:{
      type:String,
      require:true
    }
  }]
  
}, {
  versionKey: false, // You should be aware of the outcome after set to false
  timestamps: true
});

//middleware 这里用来 做数据验证
userSchema.pre('save',async function(next){ //signup and update 都会调用这个
    const user = this 

    if(user.isModified('password')){  //when update user password,encrypt password
      user.password = await bcrypt.hash(user.password, 8)
    }


    console.log("before save - user model") 
    next()
});

//Delete user tasks when user is removed
userSchema.pre('remove',async function(next){
  const user = this 
  await Article.deleteMany({author:user._id})
  next()
})


userSchema.virtual('article',{  //不是实际存数据，只是告诉mongose 哪个模型拥有哪个模型，他们之间的关系
  ref:'Article',
  localField:'_id',
  foreignField:'author'

})

userSchema.methods.toJSON = function(){  //让 model 不返回敏感数据
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}


userSchema.methods.generateAuthToken = async function(){ //token 有效期多久？
  const user = this
  const token = jwt.sign({_id:user._id.toString()},'thisisnodeapp')
  
  user.tokens = user.tokens.concat({token})
  await user.save()

  return token
}



const User= mongoose.model('User', userSchema);
module.exports = User;
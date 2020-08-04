const jwt = require('jsonwebtoken')
const User = require('../models/user')


const auth = async (req, res, next) =>{ //

    try{
       const token = req.header('Authorization').replace('Bearer ','') //Bearer 后面有个空格

        const decoded = jwt.verify(token,'thisisnodeapp')
      //  console.log(decoded) // { _id: '5d2e7364b1027b820bedcb2a', iat: 1563325284 }
      //如果登出，token 会被清除，所以 找唯一用户，并且token存在，这样就可以证明用户正在登录。
        const user = await User.findOne({_id:decoded._id,'tokens.token':token})

        if(!user){
            console.log('no user found --auth')
            throw new Error()
        }
    
        req.token = token
        req.user = user
       
       // console.log(token)
        next()
    }catch(e){
        res.status(401).send({error: " please authenticate."})
    }


    // console.log('auth middleware')
    // next()
}

module.exports = auth
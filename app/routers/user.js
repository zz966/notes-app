const express = require('express');
const router = express.Router();
const User = require('../models/user'); //bring in models
const Article = require('../models/article');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');

// signup Form
router.get('/signup', function(req, res){
    res.render('signup');
  });

//signup user
router.post('/signup', async (req, res)=>{  
   
  var user = new User(req.body)  //get form's data
  var signup_state = '';
  console.log(user);
  try{
      await user.save();
    //const token = await user.generateAuthToken() // 注册成功不一定要生成 token, 登录时生成
    //await res.status(201).send(user);  //Cannot set headers after they are sent to the client
       signup_state = 'successfully created an account!';
      // res.render('signup',{signup_state})
      res.send(user)

    // setTimeout(function(){
    //   console.log("signup succesfully")
    //   res.render('login')
    // },2000)
   
     
  }catch(e){
    res.status(400).send(e)
  }
    
});

// Login Form
router.get('/login', function(req, res){
    res.render('login');
});

// Login Process
router.post('/login', async (req, res)=>{  //登录成功 服务器会发一个token
 
  try{
      let user = await User.findOne({email:req.body.email}) // find user by unique email
      
       
      if(!user){      //if user not found
         return res.status(404).send()
      }else{
         //if user is founded
         let isMatch = await bcrypt.compare(req.body.password,user.password)

         if(!isMatch){
             throw new Error('unable to login, email or password is wrong')
         }
         //verified successfully
           const token = await user.generateAuthToken()
           let articles = await Article.find({})
           //res.send({user,token})
           res.render('index',{title:'Articles',articles: articles,user,token});
      }
       
      
  }catch(e){
       res.status(400).send(e)
  }


 });
 



//read my profile
router.get('/users/me',auth, async (req,res)=>{
  res.send(req.user)
  // try{
  // //  const users = await User.find({})
  //   console.log("hl")
  //   res.send(res.user)

  // }catch(e){
  //   res.status(500).send()
  // }
})



  // logout
  router.post('/logout', auth,async (req, res)=>{

    try{
      req.user.tokens = req.user.tokens.filter((token)=>{  //false, 就remove 特定的 token
          return token.token !== req.token
      })

      await req.user.save()

      res.send()

    }catch(e){
      res.status(500).send()
    }
    // try{
    //   await req.logout();

    //   res.redirect('/login');
    // } catch{

    // } 
    
  });


// logout all
router.post('/logoutAll',auth, async (req, res)=>{

    try{
      req.user.tokens = []

      await req.user.save()

      res.send()

    }catch(e){
      res.status(500).send()
    }
    
});



// update my profile
router.post('/users/me',auth, async (req,res)=>{

  let updates = Object.keys(req.body)
  console.log(updates)
  // const allowedUpdates = ['name','email','password']
  // const isaValidperation = updates.every((update)=>allowedUpdates.includes(update))  

  try{
     // let user = await User.findById(req.params.id)
      
     updates.forEach((update)=>{
        req.user[update] = req.body[update]
      })

      await req.user.save()
     // let user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    //   if(!user){  //no user with that id
    //     return res.status(404).send()
    // }

    res.send(req.user)   //success, send user data back

  }catch(e){
    res.status(400).send(e)
  }

})

//delete user themself
router.delete('/users/me',auth , async (req,res)=>{
  try{
   // const user = await User.findByIdAndDelete(req.user._id)

    await req.user.remove();
    res.send(req.user)

  }catch(e){
    res.status(500).send()
  }
})



module.exports = router;
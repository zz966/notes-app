const express = require('express');
const router = express.Router();
const Article = require('../models/article'); //bring in models
const auth = require('../middleware/auth')
//Route
// router.get('/',function(req,res){
 
//     Article.find({}, function(err, articles){
//         if(err){
//           console.log(err);
//         } else {
//           res.render('index', {
//             title:'Articles',
//             articles: articles
//           });
//         }
//       });
// });

router.get('/',async (req,res)=>{
    
    try{
        let articles =  await Article.find({});

        if(!articles){  //if no articles found 
            return res.status(404).send();      //404 Not Found
        }else{
            res.render('index', {
                title:'Articles',
                articles: articles
              });
        }
        
    }catch{
        return res.status(500).send();  //500 Internal Server Error

    }

   
});

router.get('/articles/add',function(req,res){
    res.render('add_article')
})

router.post('/articles/add',auth,async (req, res)=> {   //加 auth

    const article = new Article({
        ...req.body,
        author: req.user._id

    }) 
    console.log("article: "+article)
    article.timeStamp = new Date();
   
    console.log("article: "+article)

    //     let article = await new Article(req.body);

        try{
            article.save();
            
      //      res.status(201).send();
            res.redirect('/');
            
        }catch{
            res.status(500).send();
        }

});

//get all articles created by current user
//GET  /articles?limit=10&skip=0
//GET /tasks?sortBy=createdAt:desc
router.get('/articles',auth,async (req,res)=>{
    
    var sort = {}

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] ==='desc' ? -1: 1 //不是desc都是升序
    }
    try{
       var user =  await req.user.populate({
           path:'article',
           options:{
               limit: parseInt(req.query.limit),
               skip: parseInt(req.query.skip),
               sort:{createdAt:-1}  //-1 descending order， 1 ascending order
           }
        }).execPopulate();
        
        res.send(req.user.article)  
       // res.render("article",{article:article})
    }catch(e){
        res.status(500).send();
    }
})

//get article by id 
router.get('/article/:id',auth,async (req,res)=>{
    const _id  = req.params.id;   //article id 
    console.log("id"+_id)
    try{
        console.log("id"+req.user)  //为什么是req.user._id  user id
        var article = await Article.findOne({_id,author:req.user._id});

        if(!article){
            return res.status(404).send()
        }
        res.send(article)
       // res.render("article",{article:article})
    }catch(e){
        res.status(500).send();
    }
})

// router.get('/article/edit/:id',function(req,res){
//     Article.findById(req.params.id,function(err,article){
//         res.render('edit_article',{
//             article:article
//         })
//     })
// })

//display edit article by id
router.get('/article/edit/:id',auth, async (req,res)=>{

    try{
        let article = await Article.findById(req.params.id);
        res.render('edit_article',{article:article})
    }catch{
        res.status(500).send();
    }

})


// edit article by id 
router.post('/articles/edit/:id',auth,async (req,res)=>{
    
    // console.log("id"+req.params.id)  //article id
    // console.log("Uid"+req.user._id)  //article id
    try{
        var article = await Article.findOne( {_id:req.params.id,author:req.user._id});
        if(!article){  //no user with that id
            return res.status(404).send()
        }
        // console.log(article)
        // console.log(req.body.title)
        // console.log(req.body.content)
        article.title  =  req.body.title;
        article.content  =  req.body.content;

        await article.save()
        res.send(article)   //success, send user data back

    }catch(e){
        res.status(400).send(e)

    }
});


//delete article by id 
router.delete('/article/:id',auth, async (req,res)=>{

    try{
        let article = await Article.findByIdAndDelete({_id:req.params.id, author:req.user._id})
        if(!article){
            return res.status(404).send()
        }
        res.send(article)

    }catch{
        
        res.status(500).send()
    }

    // let query = {_id:req.params.id}

    // Article.deleteOne(query,function(err){
    //     if(err){
    //         console.log(err)
    //     }else{
    //         res.send('success');
    //     }
    // });
});


module.exports = router;
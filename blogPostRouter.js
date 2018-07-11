const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const morgan = require('morgan');
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// const {BlogPosts} = require('./models');
const {Blog} = require('./models');
const jsonParser = bodyParser.json();

const errMsg = {message: "Internal Server Error"};
// BlogPosts.create('I fell for it...','I tripped over a cord and hurt myself','John Doe','01-01-01');
// BlogPosts.create('My Dog','I got a new dog.  I call him Borg.  Because he goes "Borg, borg, borg, borg...".','John Doe','02-02-02');

router.get("/", (req, res)=>{
    Blog.find()
    .then(posts => {res.json(
        posts.map(post => post.blogInstance()))})
    .catch(err =>{
        console.error(err);
        res.status(500).json(errMsg);
    });
});

router.get("/:id", (req,res)=>{
    Blog.findById(req.params.id)
    .then(post => res.json(post.blogInstance()))
    .catch(err => {
        console.error(err);
        res.status(500).json(errMsg);
    })
})

router.post("/",(req, res)=>{
    const requiredFields = ["title", "content","author"];
    for(let i=0;i<requiredFields.length; i++){
        let field = requiredFields[i]
        if(!field in req.body){
            const message = `Missing ${field} in request body.`;
            console.err(message);
            return res.status(400).send(message);
        }
        
    }


    Blog.create({
        title: req.body.title,
        content: req.body.content,
        author: {
            firstName: req.body.author.firstName,
            lastName: req.body.author.lastName
        },
        created: req.body.created || new Date(Date.now())
    })
    .then( post => res.status(201).json(post))
    .catch(err =>{
        console.error(err);
        res.status(500).json({errMsg})
    })
})

router.put("/:id", (req, res)=>{ 
    const msgMissingID = `Missing ID`;
    const msgDiffID = `Request body ID and Request Parameter ID do not match!`

    if(req.params.id !== req.body.id){
        console.error(msgDiffID);
        return res.status(400).send(msgDiffID);
    }

    const willUpdate = {};
    const updateFields = ["title", "content", "author"];
    updateFields.forEach(field =>{
        if(field in req.body){
            willUpdate[field] = req.body[field];
        }
    })


    Blog.findByIdAndUpdate(req.params.id, {$set: willUpdate})
    .then(aPost => res.status(204).end())
    .catch(err=>res.status(500).json({message:"Internal server error"}))


})

router.delete("/:id", (req,res)=>{
    Blog.findByIdAndRemove(req.params.id)
    .then(aPost => res.status(204).end())
    .catch(err => res.status(500).json({message: "Not Found"}));
});
/*
router.get('/posts', (req,res)=>{
    res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res)=>{
    const requiredFields = ['title', 'content', 'author'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }
    const item = BlogPosts.create(req.body.title, req.body.content, req.body.author, req.body.publishDate);
    res.status(201).json(item);
})

router.put('/:id', jsonParser, (req,res)=>{
    console.log('Request Parameter ID', req.param.id);
    const requiredFields = ['title', 'content', 'author', "id"];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`
            console.error(message);
            return res.status(400).send(message);
        }
    }

    if (req.params.id !== req.body.id){
        const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
        console.error(message);
        return res.status(400).send(message);
    }
    console.log(`Updating blog post \`${req.params.id}\``);
    BlogPosts.update({
      id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      author: req.body.author,
      publishDate: req.body.publishDate
    });
    res.status(204).end();
});

router.delete('/:id', (req,res)=>{
    BlogPosts.delete(req.params.id);
    console.log(`Deleted Blog Entry "${req.params.ID}"`);
    res.status(204).end();
});

*/
module.exports = router;
var express = require("express"),
    methodOverride = require("method-override"),
    expressSanitizer = require ("express-sanitizer"),
    app = express(), 
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

// App config
mongoose.connect("mongodb://localhost/restful_blog_app",{useMongoClient:true});
app.use(bodyParser.urlencoded({extended:true}));
// express sanitizer needs to use after bodyparser
app.use(expressSanitizer());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));



var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type:Date, default:Date.now},
});
// Mongoose/Model Config
var Blog = mongoose.model("Blog", blogSchema);

// title
// image
// body 
// created

// RESTful routes

app.get("/", function(req, res){
    res.redirect("/blogs");
});

// Index route
app.get("/blogs", function(req, res){
 Blog.find({},function(err, blogs){
        if (err){
            console.log(err);
        }else {
           res.render("index", {blogs:blogs}); 
        }
    });
});

// New Route 
app.get("/blogs/new", function(req, res){
    res.render("new");
});

// create route
app.post("/blogs", function(req,res){
// create blog
    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err,newBlog)
    {
        if(err){
            console.log(err);
        }else{
            // Redirect
            res.redirect("/blogs");
        }
    });
});

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        }else{
             res.render("show", {blog:foundBlog});
        }
    });
});

//Edit route
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
        }else{
             res.render("edit", {blog:foundBlog});
        }
    });
});

//Update route 

app.put("/blogs/:id", function(req, res){
 Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
   if(err){
            console.log(err);
        }else{
            // redirect to show page
            res.redirect("/blogs/"+req.params.id);
        }
    });
});


app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err);
        }else{
            // redirect to index page
            res.redirect("/blogs/");
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("server connected");
});


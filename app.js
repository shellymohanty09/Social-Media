const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/peopleDB", {useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = {
  email: String,
  username: String,
  password: String,
};

const postSchema = {
  title: String,
  author: String,
  content: String,
  votes: Number,
}

const Person = mongoose.model("Person", personSchema);
const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/register", function(req,res){
  res.render("register");
});

app.post("/", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    Person.findOne({username:username}, function(err,foundUser){
      if(err){
        console.log(err);
      }else{
        if(foundUser){
          if(foundUser.password === password){
            //res.render("posts", {username:username});
            Post.find({}, function(err, posts){
               res.render("posts", {
                 username: username,
                 homeText: "hello",
                 homeData: "first post"
                 });
             });
          }
        }
      }
    });
});

app.post("/register", function(req,res){
  const username = req.body.username;
  const newPerson = new Person({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  newPerson.save(function(err){
    if(err){
      console.log(err);
    }else{
      //res.render("posts",{username:username});
      Post.find({}, function(err, posts){
         res.render("posts", {
           username: username,
           homeText: "hello",
           homeData: "sample post"
           });
       });
    }
  });
});

app.post("/posts", function(req,res){
  res.render("compose");
});

app.post("/compose",function(req,res){
  const post = new Post ({
   title: req.body.postTitle,
   author:req.body.postAuthor,
   content: req.body.postBody
 });

 post.save(function(err){
  if (!err){
    res.render("posts",{username:req.body.postAuthor,});
  }
});
});


app.listen(3000, function() {
  console.log("Server started successfully");
});

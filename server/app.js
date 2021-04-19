require("dotenv").config();
const express = require("express");
const db = require("./lib/db");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./models/post");

/*
  We create an express app calling
  the express function.
*/
const app = express();

/*
  We setup middleware to:
  - parse the body of the request to json for us
  https://expressjs.com/en/guide/using-middleware.html
*/
app.use(express.json());
app.use(cors());
app.use((req, res, next) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);
  next();
});
/*
  Endpoint to handle GET requests to the root URI "/"
*/
app.get("/", (req, res) => {
  res.json({
    "/posts": "read and create new posts",
    "/posts/:id": "read, update and delete an individual post",
  });
});

app.get("/posts", (req, res) => {
  Post.find()
    .then((posts) => {
      console.log(posts);
      res.status(200);
      res.json(posts);
    })
    .catch((error) => {
      res.status(500);
      res.json({
        error: "Internal Server Error",
      });
    });
});

app.post("/posts", (req, res) => {
  Post.create(req.body)
    .then((newPost) => {
      console.log(newPost);
      res.status(201);
      res.json(newPost);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/posts/:id", (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200);
        res.json(post);
        console.log(post);
      } else {
        res.status(404);
        console.log("Not Found");
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: "Internal Server Error" });
    });
});

app.patch("/posts/:id", (req, res) => {
  Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedPost) => {
      if (updatedPost) {
        res.status(200);
        res.json(updatedPost);
        console.log(updatedPost);
      } else {
        res.status(404);
        console.log("Not Found");
      }
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: "Internal Server Error" });
    });
});

app.delete("/posts/:id", (req, res) => {
  Post.findByIdAndDelete(req.params.id)
    .then((post) => {
      console.log("deleted successfully");
      res.status(200);
      res.json(post);
    })
    .catch((error) => {
      res.status(500);
      res.json({ error: "Internal Server Error" });
    });
});

const { PORT, MONGO_URL } = process.env;

/*
  We have to start the server. We make it listen on the port 4000

*/
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongodb = mongoose.connection;

mongodb.on("open", () => {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

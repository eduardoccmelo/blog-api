const express = require("express");
const db = require("./lib/db");
const cors = require("cors");

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
  db.findAll()
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
  db.insert(req.body)
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
  db.findById(req.params.id)
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
  db.updateById(req.params.id, req.body)
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
  db.deleteById(req.params.id)
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

/*
  We have to start the server. We make it listen on the port 4000

*/
app.listen(4000, () => {
  console.log("Listening on http://localhost:4000");
});

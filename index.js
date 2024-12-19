import bodyParser from "body-parser";
import express from "express";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
let posts = [];

// Render the home page with all posts
app.get("/", (req, res) => {
    res.render("index.ejs", { posts: posts || [] });
});

// Handle new post submission
app.post("/submit", (req, res) => {
    const { post_title, text } = req.body;
    const newPost = {
      title: post_title,
      text: text,
      id: posts.length + 1,  // Assign an ID based on the length of the array
    };
    posts.push(newPost);
    console.log(posts);
    res.render("index.ejs", { post_title, text, posts });
});

// Handle post deletion
app.post("/delete", (req, res) => {
  const { id } = req.body;

  // Remove the post by ID
  posts = posts.filter(post => post.id !== parseInt(id));
  console.log("Posts after deletion:", posts);

  // Redirect back to the home page
  res.redirect("/");
});

// Render the edit form for the specified post
app.get("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find(post => post.id === postId);

  if (post) {
    res.render("edit.ejs", { post });  // Render the edit form with current post data
  } else {
    res.status(404).send("Post not found");
  }
});

// Handle editing the post and updating it
app.post("/edit/:id", (req, res) => {
  const postId = parseInt(req.params.id);
  const { post_title, text } = req.body;

  // Find the post and update its details
  let post = posts.find(post => post.id === postId);
  if (post) {
    post.title = post_title;
    post.text = text;
    console.log("Updated Posts:", posts);

    // After updating, redirect to the home page
    res.redirect("/");
  } else {
    res.status(404).send("Post not found");
  }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
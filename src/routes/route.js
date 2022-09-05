const express = require("express");
const router =express.Router();
const AuthorController = require("../Controllers/authorController")
const BlogController = require("../Controllers/blogController")

router.post("/authors", AuthorController.createAuthor)
router.post("/blogs", BlogController.createBlog)
router.get("/blogs", BlogController.getBlogs)


module.exports=router;
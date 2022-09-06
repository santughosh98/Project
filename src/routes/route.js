const express = require("express");
const router =express.Router();
const AuthorController = require("../Controllers/authorController")
const BlogController = require("../Controllers/blogController")

router.post("/authors", AuthorController.createAuthor)
router.post("/blogs", BlogController.createBlog)
router.get("/blogs", BlogController.getBlogs)
router.put("/blogs/:blogId", BlogController.updateBlog)
router.delete("/blogs/:blogId", BlogController.deleteBlogs)
router.delete("/blogs", BlogController.deleteBlogs2)





module.exports=router;
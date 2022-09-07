const express = require("express");
const router =express.Router();
const AuthorController = require("../Controllers/authorController")
const BlogController = require("../Controllers/blogController")
const mw=require("../middleWare/auth")

router.post("/authors", AuthorController.createAuthor)
router.post("/login", AuthorController.login)

router.post("/blogs",mw.authenticate, BlogController.createBlog)
router.get("/blogs",mw.authenticate, BlogController.getBlogs)

router.put("/blogs/:blogId",mw.authenticate,mw.authorize, BlogController.updateBlog)
router.delete("/blogs/:blogId",mw.authenticate,mw.authorize, BlogController.deleteBlogs)
router.delete("/blogs",mw.authenticate,mw.authorize, BlogController.deleteBlogs2)





module.exports=router;
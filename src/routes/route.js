const express = require("express");
const router =express.Router();
const AuthorController = require("../Controllers/authorController")
const BlogController = require("../Controllers/blogController")
const mw=require("../middleWare/auth")

router.post("/authors", AuthorController.createAuthor)
router.post("/login", AuthorController.login)

router.post("/blogs",mw.authenticate,mw.idAuth, BlogController.createBlog)
router.get("/blogs",mw.authenticate,mw.idAuth, BlogController.getBlogs)

router.put("/blogs/:blogId",mw.authenticate,mw.idCheck,mw.authorize, BlogController.updateBlog)
router.delete("/blogs/:blogId",mw.authenticate,mw.authorize, BlogController.deleteBlogs)
router.delete("/blogs",mw.authenticate,mw.authorize, BlogController.deleteBlogs2)





module.exports=router;
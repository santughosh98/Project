const blogModel = require("../Model/blogModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authenticate = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        if (!token)
            return res.status(401).send({ status: false, msg: "token is required" });
        jwt.verify(token, "group-09-secretkey", function (error, decoded) {
            if (error) {
                return res.status(401).send({ status: false, msg: "Authentication failed" });
            } else {
                req.token = decoded;
                next();
            }
        });
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};

const authorize = async (req, res, next) => {
    try {
        let blogId = req.params.blogId;
        let a = req.query;
        
        if(Object.keys(a).length==0){
            { return res.status(400).send({ message: "No query params received. Aborting delete operation",
         })}}
        
        const blog = await blogModel.find({
            $or: [
                { _id: blogId },
                { tags: a.tags },
                { category: a.category },
                { subcategory: a.subcategory },
            ],
        });
        console.log(blog)
        if (!blog) {
            return res.status(404).send({ status: false, msg: "blog not found ok" });
        }
        
        let tokenUser = req.token.authorId;
        if(a.authorId){
        let logUser= a.authorId
        if(tokenUser !== (logUser||blog.authorId)){

            return res.status(403).send({ status: false, msg: "you are not authorized 1" });
        }else{
            next()
        }}else{
        for(let i in blog){
            if(blog[i].authorId==tokenUser){
            next()
            }else{
                return res.status(403).send({ status: false, msg: "you are not authorized " });
            }}}
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};

const authIdValid = (req, res, next) => {
    try {

       // let x=req["x-api-key"]
        if (req.query.authorId || req.body.authorId) {
            if (!mongoose.Types.ObjectId.isValid(req.query.authorId || req.body.authorId)) {
                return res
                    .status(400)
                    .send({ status: false, msg: "!!Oops author id is not valid" });
            }else{next()}
        }else if(!req.query.authorId || !req.body.authorId) {
            next()
        }      }
     catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
};

const blogIdValid = (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.blogId)) 
        { return res.status(400).send({ status: false, msg: "! Oops blog id is not valid" }) }
        else { next() }
    } catch (err) {
        return res.status(500).send({ status: false, error: err.message });
    }
}
module.exports = { authenticate, authorize, authIdValid, blogIdValid }

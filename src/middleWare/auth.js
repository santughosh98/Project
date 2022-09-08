const blogModel = require("../Model/blogModel")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")


const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, msg: "token is required" })
        jwt.verify(token, "group-09-secretkey", function (error, decoded) {
            if (error) {
                return res.status(401).send({status: false, msg: "Authentication failed" })
            } else {
                req.token = decoded
                next()
            }
        })
    } catch (error) { res.status(500).send({status: false,err:error.message}) }
}


const authorize = async (req, res, next) => {
    try {
        let blogId = req.params.blogId
         let a=req.query       
        const blog = await blogModel.findOne({$or:[{_id:blogId},{authorId:a.authorId},{tags:a.tags},{category:a.category},{subcategory:a.subcategory}]})
        if (!blog) { return res.status(404).send({ status: false, msg: "blog not found" }) }
        let tokenUser = req.token.userId
        let logUser = blog.authorId.toString()
        if (tokenUser !==( logUser||blog.authorId) ){
            res.status(403).send({ status: false, msg: "you are not authorized" })
        } else {
            next()
        }
    } catch (err) { res.status(500).send({ status: false, error: err.message }) }

}

const idCheck = async (req,res,next)=>{
    try{
    if (!mongoose.Types.ObjectId.isValid(req.params.blogId)) 
           { return res.status(400).send({ status:false,msg: "!!Oops blog id is not valid" })}
           else{
            next()
           }
        } catch (err) { res.status(500).send({ status: false, error: err.message }) }
}

const idAuth = async (req,res,next)=>{
    try{
    if (!mongoose.Types.ObjectId.isValid(req.query.authorId ||req.body.authorId)) 
           { return res.status(400).send({ status:false,msg: "!!Oops authorId  is not valid" })}
           else{
            next()
           }
        } catch (err) { res.status(500).send({ status: false, error: err.message }) }
}

module.exports = { authenticate, authorize , idCheck,idAuth}
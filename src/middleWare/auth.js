const blogModel = require("../Model/blogModel")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")


const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, msg: "token is required" })
        jwt.verify(token, "group-09-secretkey", function (error, decoded) {
            if (error) {
                return res.status(401).send({ msg: "Authentication failed" })
            } else {
                req.token = decoded
                next()
            }
        })
    } catch (error) { res.status(500).send(error.message) }
}


const authorize = async (req, res, next) => {
    try {
        let blogId = req.params.blogId
         let authid=req.query.authorId
         if (!mongoose.Types.ObjectId.isValid(blogId||authid)) 
           { return res.status(400).send({ status:false,msg: "!!Oops author id is not valid" })}
        const blog = await blogModel.findOne({$or:[{_id:blogId},{authorId:authid}]})
        if (!blog) { return res.status(404).send({ status: false, msg: "blog not found" }) }
        let tokenUser = req.token.userId
        let logUser = blog.authorId.toString()
        if (tokenUser !==( logUser||authid) ){
            res.status(403).send({ status: false, msg: "you are not authorized" })
        } else {
            next()
        }
    } catch (err) { res.status(500).send({ status: false, error: err.message }) }

}

module.exports = { authenticate, authorize }
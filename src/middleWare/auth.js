const blogModel = require("../Model/blogModel")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authenticate = async (req, res, next) => {
    try {
<<<<<<< HEAD
        let token = req.headers["x-api-key"] 
        if (!token) return res.status(401).send({ status: false, msg: "please enter token" })
=======
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, msg: "token is required" })
>>>>>>> db49746602a4d6044a0efd12076c0669a8302037
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
        if(!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).send({ error: "!!Oops blogId id is not valid" })
            }
        const blog = await blogModel.findById(blogId)
        if (!blog) { return res.status(404).send({ status: false, msg: "blog not found" }) }
        let tokenUser = req.token.userId
        let logUser = blog.authorId.toString()
        if (tokenUser !== logUser) {
           return res.status(403).send({ status: false, msg: "you are not authorized" })
        } else {
            next()
        }
    } catch (err) { res.status(500).send({ status: false, error: err.message }) }

}

module.exports = { authenticate, authorize }
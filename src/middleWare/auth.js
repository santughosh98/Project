const blogModel = require("../Model/blogModel")
const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
    try {
        let token = req.headers["x-api-key"] 
        if (!token) return res.status(401).send({ status: false, msg: "Authentication failed" })
        jwt.verify(token, "group-09-secretkey", function (error, decoded) {
            if (error) {
                return res.status(401).send({ msg: error.message })
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
        const blog = await blogModel.findById(blogId)
        if(!blog){ return res.status(404).send({ status: false, msg: "blog not found" })}
        let tokenUser = req.token.userId
        let logUser = blog.authorId.toString()  
        if (tokenUser !== logUser) {
            res.status(403).send({ status: false, msg: "you are not authorized" })
        } else {
            next()
        }
    } catch (err) { res.status(500).send({ status: false, error: err.message }) }

}

module.exports = { authenticate, authorize }
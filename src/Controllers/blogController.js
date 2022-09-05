const blogModel = require("../Model/blogModel")
const authorModel = require("../Model/authorModel");


const createBlog = async (req, res) => {
    try {
        let data = req.body;
        if (!data.authorId) {
            return res.status(400).send({ error: "author id required" })
        }
        let authId = await authorModel.findById(data.authorId)
        if (!authId) {
            return res.status(401).send({ error: "!!Oops author id is invalid!!" })
        }
        if(data.isPublished===true){
            data.publishedAt=Date.now()
        }
        let savedata = await blogModel.create(data)
        return res.status(201).send({ data: savedata })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}

const getBlogs = async (req, res) => {
     try {
        let combination = req.query
        let dataBlog =await blogModel.find({$and:[{isDeleted:false,isPublished:true},combination]})
    if (dataBlog==0){
        return res.status(404).send({error:" DATA NOT FOUND "})
    }else 
        return res.status(201).send({ data: dataBlog })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}
        
module.exports = { createBlog,getBlogs }
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
    // try {
        // let data = req.body
        //let combination = req.query
       // console.log(combination)
        // if (data.isDeleted === true && data.isPublished === false){
        //     res.status(404).send({error:" DATA NOT FOUND "})
        // }else{
        let dataBlog =await blogModel.find({isDeleted:false,isPublished:true})
        console.log(dataBlog)
    if (dataBlog.length==0){
        res.status(404).send({error:" DATA NOT FOUND "})
    }
        return res.status(201).send({ data: dataBlog })
    // } catch (err) {
    //     res.status(500).send({ status: false, error: err.message })
    // }
}
        
module.exports = { createBlog,getBlogs }
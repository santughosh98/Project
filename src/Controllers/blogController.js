const blogModel = require("../Model/blogModel")
const authorModel = require("../Model/authorModel");
//----------------------------------create blog------------------------------------------------//
const createBlog = async (req, res) => {
    try {
        let data = req.body;
        if (!data.authorId) {return res.status(400).send({ error: "author id required" })}
        let authId = await authorModel.findById(data.authorId)
        if (!authId) { return res.status(401).send({ error: "!!Oops author id is invalid!!" })}
        if (data.isPublished === true) { data.publishedAt = Date.now()}
        let savedata = await blogModel.create(data)
        return res.status(201).send({ data: savedata })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
}
//--------------------------------------fetching blogs-----------------------------------//
const getBlogs = async (req, res) => {
    try {
        let combination = req.query
        let dataBlog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, combination] })
        if (dataBlog == 0) {
            return res.status(404).send({ error: " DATA NOT FOUND " })
        } else
            return res.status(201).send({ data: dataBlog })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}


//------------------------------------updation---------------------------------------//
const updateBlog = async function (req, res) {
    try{
    let data = req.params.blogId
    let update = req.body
    let alert = await blogModel.findOne({ _id: data, isDeleted: true })
    if (alert) return res.status(404).send({ msg: "Blog deleted" })
    let blogs = await blogModel.findOneAndUpdate({ _id: data },
        {
            $set: {
                title: update.title, body: update.body, isPublished: update.isPublished,
                publishedAt: Date.now()
            },
            $push: { tags: update.tags, subcategory: update.subcategory }
        }, { new: true })
    return res.status(200).send({ status: true, msg: blogs })
}catch(err){res.status(500).sent({error:err.message})}
}

//<<<<<<<<<<<<deletion1>...................

const deleteBlogs = async (req, res) => {
    try {
        let BlogId = req.params.blogId
        let findData = await blogModel.find({ $and: [{ isDeleted: false},{_id:BlogId}]})
        if (findData.length==0) {
            return res.status(404).send({ status: false, msg: "no blog found" })
         } else {
            let findData2 = await blogModel.findOneAndUpdate({ _id: BlogId },
                { $set: { isDeleted: true, deletedAt: Date.now() } },
                { new: true })
            return res.status(200).send({ status: true, msg: "data deleted" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}

//<<<<<<<<<<<<deletion2............>...................

const deleteBlogs2 = async (req,res)=>{
    try{
        let data=req.query
        let blog= await blogModel.find({ $and: [{ isDeleted: false, isPublished: false },data]})
        if(blog==0){return res.status(404).send("no any blog matching")}
            let deleteBlogData = await blogModel.updateMany(data,
                { $set: { isDeleted:true, deletedAt: Date.now() } },
                { new: true })
            return res.status(200).send({ status: true, Deleted: "deletion of blog is completed" })
    }catch(err){res.send(err.message)}
}


module.exports = { createBlog, getBlogs, updateBlog, deleteBlogs, deleteBlogs2 }
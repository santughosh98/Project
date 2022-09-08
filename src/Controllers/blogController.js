const blogModel = require("../Model/blogModel")
const authorModel = require("../Model/authorModel");
const mongoose = require('mongoose')

//-------------------------------------create blog------------------------------------------------//
const createBlog = async (req, res) => {
    try {
        let data = req.body;      // req.body.xyz=pqw
        let { title, authorId, category, body, isPublished } = data
        // ==Mandatory_fields== \\
        if (Object.keys(data).length == 0) return res.status(400).send({ status:false,msg: "incomplete input" })
        if (!title) return res.status(400).send({ status:false,msg: "Title is required" })
        if (!body) return res.status(400).send({ status:false,msg: "body is required" })
        if (!category) return res.status(400).send({ status:false,msg: "category is required" })
        if (!authorId) return res.status(400).send({ status:false,msg: "author id required" })
        //==format==\\
        if (!mongoose.Types.ObjectId.isValid(authorId)) {
            return res.status(400).send({ status:false,msg: "!!Oops author id is not valid" })
        }
        if (typeof isPublished !== "boolean") {
            return res.status(400).send({ status:false,msg:"input is needed"})
        }

        // ==Duplication== \\
        let authId = await authorModel.findById(authorId)
        if (!authId) { return res.status(404).send({ msg: "!!Oops author id doesn't exist" }) }

        if (data.isPublished === true) { data.publishedAt = Date.now() }

        let savedata = await blogModel.create(data)
        return res.status(201).send({ data: savedata })
    } catch (err) {
        res.status(500).send({ status: false, status:false,msg: err.message })
    }
}

//------------------------------------------fetching blogs-----------------------------------------//
const getBlogs = async (req, res) => {
    try {
        let combination = req.query
        let dataBlog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, combination] })
        if (dataBlog == 0) {
            return res.status(404).send({ status:false,msg: " DATA NOT FOUND " })
        } else
            return res.status(200).send({ data: dataBlog })
    } catch (err) {
        res.status(500).send({ status: false, status:false,msg: err.message })
    }
}


//------------------------------------updation---------------------------------------//
const updateBlog = async function (req, res) {
    try {
        let data = req.params.blogId
        let update = req.body
        if (!mongoose.Types.ObjectId.isValid(data)) 
        { return res.status(400).send({ status:false,msg: "!!hain Oops author id is not valid" })}
        let alert = await blogModel.findOne({ _id: data, isDeleted: true })
        if (alert) return res.status(404).send({ msg: "no blog found" })
        let blogs = await blogModel.findOneAndUpdate({ _id: data },
            {
                $set: {
                    title: update.title, body: update.body, isPublished: update.isPublished,
                    publishedAt: Date.now()
                },
                $push: { tags: update.tags, subcategory: update.subcategory }
            }, { new: true }) // , upsert: true 
        return res.status(200).send({ status: true, msg: blogs })
    } catch (err) { res.status(500).sent({ status:false,msg: err.message }) }
}

//<<<<<<<<<<<<deletion1>...................

const deleteBlogs = async (req, res) => {
    try {
        let BlogId = req.params.blogId
        if (!mongoose.Types.ObjectId.isValid(BlogId)) 
        { return res.status(400).send({ status:false,msg: "!!hain Oops author id is not valid" })}
        let findData = await blogModel.find({ _id: BlogId, isDeleted: false })
        if (findData.length == 0) {
            return res.status(404).send({ status: false, msg: "no blog found" })
        } else {
            let findData2 = await blogModel.findOneAndUpdate({ _id: BlogId },
                { $set: { isDeleted: true, deletedAt: Date.now() } },
                { new: true })
            return res.status(200).send({ status: true, msg: "data deleted succesfully" })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}

//<<<<<<<<<<<<deletion2............>...................

const deleteBlogs2 = async (req, res) => {
    try {
        let data = req.query
        let blog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: false }, data] })
        if (blog == 0) { return res.status(404).send("no such blog present") }
        let deleteBlogData = await blogModel.updateMany(data,
            { $set: { isDeleted: true, deletedAt: Date.now() } },
            { new: true })
        return res.status(200).send({ status: true, Deleted: "deletion of blog is completed" })
    } catch (err) { res.send(err.message) }
}


module.exports = { createBlog, getBlogs, updateBlog, deleteBlogs, deleteBlogs2 }
const blogModel = require("../Model/blogModel")
const authorModel = require("../Model/authorModel");
const { find } = require("../Model/blogModel");
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
        if (data.isPublished === true) {
            data.publishedAt = Date.now()
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
        let dataBlog = await blogModel.find({ $and: [{ isDeleted: false, isPublished: true }, combination] })
        if (dataBlog == 0) {
            return res.status(404).send({ error: " DATA NOT FOUND " })
        } else
            return res.status(201).send({ data: dataBlog })
    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}
const updateBlog = async function (req, res) {
    let data = req.params.blogId
    let update = req.body
    let upTags = update.tags
    let upSubcat = update.subcategory
    let alert = await blogModel.findOne({ _id: data, isDeleted: true })
    if (alert) return res.status(400).send({ msg: "Blog deleted" })
    let blogs = await blogModel.findOneAndUpdate({ _id: data },
        {
            $set: {
                title: update.title, body: update.body, isPublished: update.isPublished,
                publishedAt: Date.now()
            },
            $push: { tags: upTags, subcategory: upSubcat }
        }, { new: true })

    return res.status(200).send({ status: true, msg: blogs })
}

const deleteBlogs = async (req, res) => {
    try {
        let BlogId = req.params.blogId
        let findData = await blogModel.findById({ _id: BlogId }).select({ _id: 0, isDeleted: 1 })
        if (!findData) {
            return res.status(404).send({ status: false, msg: "no blog found" })
        } else if (findData.isDeleted === true) {
            return res.send({ status: false, msg: "Data is already deleted" })
        } else {
            let findData2 = await blogModel.findOneAndUpdate({ _id: BlogId },
                { $set: { isDeleted: true, deletedAt: Date.now() } },
                { new: true })
            return res.status(200).send({ status: true, msg: findData2 })
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}

// const deleteBlogs2 = async (req, res) => {
//     try {
//         let filterData = req.query
//         let check = await blogModel.find(filterData)
//         if (check == 0) {
//             return res.status(404).send({ status: false, msg: "blog data not found" })
//         }
//         for (let i=0;i<check.length;i++){
//            let a = check[i]
//         if (a.isDeleted === true) return res.send({ status: false, msg: "Data is already deleted" })
//         if (a.isPublished === true)  res.send({ status: false, msg: "data has been published" })
//      }
//             let deleteBlogData = await blogModel.updateMany(filterData,
//                 { $set: { isDeleted: true, deletedAt: Date.now() } },
//                 { new: true })
//             return res.status(200).send({ status: true, msg: deleteBlogData })
        
//     } catch (err) {
//         res.status(500).send({ status: false, msg: err.message })
//     }
// }



const deleteBlogs2 = async (req,res)=>{
    try{
        let data=req.query
        let blog= await blogModel.find(data)
        if(blog==0){ res.status(404).send("blog not found")}
        for(let i in blog){
            if(blog[i].isDeleted===true)return res.status(400).send("already deleted")
            if(blog[i].isPublished===true)return res.status(400).send("blog has been published")
        }
            let deleteBlogData = await blogModel.updateMany(data,
                { $set: { isDeleted: true, deletedAt: Date.now() } },
                { new: true })
            return res.status(200).send({ status: true, succesfullyDeleted: deleteBlogData })
        
    }catch(err){res.send(err.message)}
}














module.exports = { createBlog, getBlogs, updateBlog, deleteBlogs, deleteBlogs2 }
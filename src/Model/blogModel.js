const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim:true,
    },
    body: {
        type: String,                  
        required: true,
        trim:true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        trim:true,
        required:true
    },
    tags: [String],
    category: {
        type: String,
        required: true,
        trim:true
    },
    subcategory: [String],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    publishedAt:Date,
    deletedAt:Date,
    
}, { timestamps: true })
module.exports = mongoose.model("Blog", blogSchema)
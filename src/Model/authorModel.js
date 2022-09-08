const mongoose = require("mongoose")
const emailValidation =require("validator")

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
       // match:/<< $& >>/,
        required: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        trim:true
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr", "Mrs", "Miss"]
    },
    email: {
        type: String,
       // match: /.+\@.+\..+/,//"email id is invalid",
       //validate:[emailValidation.isEmail,"is inValid"],
        required: true,
        unique: true,
        trim:true
    },
    password: {
        type: String,
        required: true,
        trim:true
    }
}, { timestamps: true })
module.exports = mongoose.model("Author", authorSchema)

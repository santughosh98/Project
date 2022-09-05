const authorModel = require("../Model/authorModel")
const validator = require("validator")
const createAuthor = async (req,res)=>{
    try{
    let data = req.body;
    
    let savedata = await authorModel.create(data)
    res.status(201).send({data:savedata})
    }catch(err){
        res.status(500).send({error:err.message,status:false})
    }
}

module.exports = {createAuthor}

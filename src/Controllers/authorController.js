const authorModel = require("../Model/authorModel")
const jwt = require("jsonwebtoken");
const validEmail = /.+\@.+\..+/
const stringvalid =/^[A-Z]+[a-z]+(?:(?:|['_\. ])([a-z]*(\.\s)?[a-z])+  )*$/
// /^[A-Z]+[a-z]+(?:(?:|['_\. ])([a-z]*(\.\s)?[a-z])+)*$/
const passValid=/^[a-zA-Z0-9@]{6,10}$/

const createAuthor = async (req, res) => {
    try {
        let data = req.body;
        let { fname, lname, title, email,password } = data
        //--mandatory field--//
        if (!fname) { return res.status(400).send({ status: false, msg: "First Name is required...!" }) }
        if (!lname) { return res.status(400).send({ status: false, msg: "last Name is required...!" }) }
        if (!title) { return res.status(400).send({ status: false, msg: "title is required...!" }) }
        if (!email) { return res.status(400).send({ status: false, msg: "email is required...!" }) }
        if (!password) { return res.status(400).send({ status: false, msg: "password is required...!" }) }

        //---format---//
        let validFn=stringvalid.test(fname)
        if (!validFn) { return res.status(400).send({ status:false,msg: "first name is in invalid format first letter should always be capital and only albhabates are allowed" }) }
        let validLn=stringvalid.test(lname)
        if (!validLn) { return res.status(400).send({ status:false,msg: "last name is in invalid format first letter should always be capital  and only albhabates are allowed" }) }
        if (title != "Mr" && title != "Mrs" && title !="Miss")
        return res.status(400).send({status : false,msg: "you can choose either Mr or Mrs or Miss only" })
        let validE = validEmail.test(email)
        if (!validE) { return res.status(400).send({ status:false,msg: "email id valid format =>(examplexx@xyz.xyz)" }) }
        let validP=passValid.test(password)
        if (!validP) { return res.status(400).send({ status:false,msg: "Your password must contain at least one alphabet one number and one special character minimum 6 character" }) }

        //----dublicate key---//

        let inUse= await authorModel.findOne({email:email})
        if(inUse)return res.status(400).send({status:false,msg:"email already in use"})
        //----creating authors-----------------------------//
        let savedData = await authorModel.create(data)
        return res.status(201).send({status:true, data: savedData })

    } catch (err) {
        res.status(500).send({ err: err.message, status: false })
    }
}

const login = async (req, res) => {
    try {
        let data = req.body
     let {email,password}=data
        if (!email) {
            return res.status(400).send({ status: false, msg: "please enter  your email" })
        } else if (!password) {
            return res.status(400).send({ status: false, msg: "please enter your password" })
        } else {
            let user = await authorModel.findOne({ email: email, password: password });
            if (!user) {
                return res.status(401).send({ status: false, msg: "your email or password is incorrect" })
            } else {
                let token = jwt.sign(
                    {
                        authorId: user._id.toString(),   //<1st input>
                        team: "Group-09"
                    }, "group-09-secretkey");   //2nd input which is very very hard to guess
                //  res.setHeader("x-api-key", token);
                res.status(200).send({ status: true, msg: "login successful ",token });
            }
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })

    }
}

module.exports = { createAuthor, login }

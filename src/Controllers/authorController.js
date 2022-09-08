const authorModel = require("../Model/authorModel")
const jwt = require("jsonwebtoken");
const validEmail = /.+\@.+\..+/
const stringvalid =/[A-Za-z]/
const passValid=/[a-zA-Z0-9@]{6,7}$/

//^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/
//
const createAuthor = async (req, res) => {
    try {
        let data = req.body;
        let { fname, lname, title, email,password } = data
        //--mandatory field--//
        if (!fname) { return res.status(400).send({ status: false, msg: "First Name is required...!" }) }
        if (!lname) { return res.status(400).send({ status: false, msg: "last Name is required...!" }) }
        if (!title) { return res.status(400).send({ status: false, msg: "titlr is required...!" }) }
        //---format---//
        let validFn=stringvalid.test(fname)
        if (!validFn) { return res.status(400).send({ data: "first name id is in invalid format" }) }
        let validLn=stringvalid.test(lname)
        if (!validLn) { return res.status(400).send({ data: "last name id is in invalid format" }) }
        if (title != "Mr" && title != "Mrs" && title !="Miss")
        return res.status(400).send({status : false,msg: "u can choose either Mr or Mrs or Miss only" })
        let validE = validEmail.test(email)
        if (!validE) { return res.status(400).send({ data: "email id is in invalid format" }) }
        let validP=passValid.test(password)
        if (!validP) { return res.status(400).send({ data: "password is in invalid format" }) }
        //----dublicate key---//
        let inUse= await authorModel.find({email:email})
        if(inUse!==0)return res.status(400).send({status:false,msg:"email already in use"})
        //----//
        let savedData = await authorModel.create(data)
        return res.status(201).send({ data: savedData })

    } catch (err) {
        res.status(500).send({ error: err.message, status: false })
    }
}

const login = async (req, res) => {
    try {
        let userMail = req.body.email;
        let userPassword = req.body.password;
        if (!userMail) {
            return res.status(400).send({ status: false, msg: "plz enter  ur email" })
        } else if (!userPassword) {
            return res.status(400).send({ status: false, msg: "plz enter ur password" })
        } else {
            let user = await authorModel.findOne({ email: userMail, password: userPassword });
            if (!user) {
                return res.status(401).send({ status: false, msg: "emailid or password is invalid" })
            } else {
                let token = jwt.sign(
                    {
                        userId: user._id.toString(),   //<1st input>
                        team: "Group-09"
                    }, "group-09-secretkey");   //2nd input which is very very hard to guess
                res.setHeader("x-api-key", token);
                res.status().send({ status: true, msg: "login succesfully " });
            }
        }
    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })

    }
}

module.exports = { createAuthor, login }

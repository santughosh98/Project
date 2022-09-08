const authorModel = require("../Model/authorModel")
const jwt = require("jsonwebtoken");
const validEmail = /.+\@.+\..+/
const stringvalid =/<< $& >>/


const createAuthor = async (req, res) => {
    try {
        let data = req.body;
        let { fname, lname, title, email,password } = data
        if (!fname) { return res.status(400).send({ status: false, msg: "First Name is required...!" }) }
        if (!lname) { return res.status(400).send({ status: false, msg: "last Name is required...!" }) }
        if (!title) { return res.status(400).send({ status: false, msg: "titlr is required...!" }) }
        let validFn=stringvalid.test(fname)
        if (!validFn) { return res.status(401).send({ data: "first name id is in invalid format" }) }
        let validLn=stringvalid.test(lname)
        if (!validLn) { return res.status(401).send({ data: "last name id is in invalid format" }) }
        let validT=stringvalid.test(title)
        if (!validT) { return res.status(401).send({ data: "title is in invalid format" }) }
        let validE = validEmail.test(email)
        if (!validE) { return res.status(401).send({ data: "email id is in invalid format" }) }
        let validP=stringvalid.test(password)
        if (!validP) { return res.status(401).send({ data: "title is in invalid format" }) }
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
                return res.status(401).send({ status: false, msg: "email or password is incorrect" })
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

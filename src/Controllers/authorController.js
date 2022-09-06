const authorModel = require("../Model/authorModel")
const createAuthor = async (req, res) => {
    try {
        let data = req.body;
        let savedData = await authorModel.create(data)
        res.status(201).send({ data: savedData })
    } catch (err) {
        res.status(500).send({ error: err.message, status: false })
    }
}

module.exports = { createAuthor }

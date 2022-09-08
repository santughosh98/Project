const express = require("express");
const bodyParser = require("body-parser");
const route = require("./routes/route.js");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

<<<<<<< HEAD
mongoose
  .connect(
    "mongodb+srv://qilzaejmqsvtjzzyit:lLDqFD4KNDzknQZO@cluster0.r6t2jbn.mongodb.net/Mini-Project-blogging09",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected")) // ==>> promise > 1 pending 2 rejected 3 fulfilled
  .catch((err) => console.log(err));

app.use("/", route);
=======
mongoose.connect("mongodb+srv://qilzaejmqsvtjzzyit:lLDqFD4KNDzknQZO@cluster0.r6t2jbn.mongodb.net/Mini-Project-blogging09", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected")) // ==>> promise > 1 pending 2 rejected 3 fulfilled
.catch ( err => console.log(err) )

app.use('/', route); 
>>>>>>> db49746602a4d6044a0efd12076c0669a8302037

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});


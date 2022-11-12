const express = require("express");
const userRoutes = require('./routes/userRoutes')
const cors = require("cors"); /* cors is a middleware. it will add some headers in each response and our API can be called from everywhere*/
const mongoose = require("mongoose");

const app = express();


app.use(express.json()); // called because express cannot handle a json file directly
app.use(cors());

app.use("/user", userRoutes)


app.get("/", (req, res) => {
  res.send("User API");
});


const PORT = 5001;

mongoose
  .connect(
    "mongodb+srv://yashsah:Tennis2012@yashcluster.oasbwbz.mongodb.net/?retryWrites=true&w=majority",{ useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connected to Database");
    app.listen(PORT, () => {
      console.log(`Server up and running at PORT ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

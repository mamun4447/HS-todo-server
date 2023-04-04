require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;

app.use(bodyParser());
app.use(cors());
app.use(express());

//==> Mongo BoilerPlate <===//

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://userdashboard:L7gpwkHEpWQxXqt6@cluster0.otp6uvz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//==>Mongo Connection<===//
async function run() {
  try {
    await client.connect();
    console.log("Connected!");
  } catch (error) {
    console.error(error);
  }
}
run();

//====database collections=====//
const todoCollection = client.db("hsTodo").collection("todo");
const userCollection = client.db("hsTodo").collection("user");

//===Post user's===//
// app.post("/user", async (req, res) => {
//   try {
//     const user = req.body;
//     await userCollection.insertOne(user);
//     res.send({ success: true, message: "User data added to DB!" });
//   } catch (error) {
//     res.send({
//       success: false,
//       message: "Couldn't add this user, please try again!",
//     });
//   }
// });

//<===>Post To-do's<===>//
//<========================>//
app.post("/todo", async (req, res) => {
  try {
    const todo = req.body;
    const result = await todoCollection.insertOne(todo);
    res.send({ success: true, message: "New note added!" });
  } catch (error) {
    res.send({
      success: false,
      message: "Couldn't add a note, please try again!",
    });
  }
});

//====Get to-do's====//
app.get("/todo", async (req, res) => {
  try {
    const result = await todoCollection.find({}).toArray();
    res.send({ success: true, data: result });
  } catch (error) {
    res.send({ success: false });
  }
});

//====Update todo====//
app.patch("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await new todoCollection.findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: req.body }
    );
    res.send({ success: true, message: "Updated successfully!!" });
  } catch (error) {
    console.error(error);
    res.send({ success: false, message: "Couldn't update, please try again!" });
  }
});

//===Delete todo===//
app.delete("/todo/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await todoCollection.deleteOne({ _id: new ObjectId(id) });
    res.send({ success: true, message: "Deleted Successfully!" });
  } catch (error) {
    console.log(error);
    res.send({ success: false, message: "Couldn't delete, try again!" });
  }
});

//===> Initial <===//
app.get("/", (req, res) => {
  res.send("Server is running!");
});
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

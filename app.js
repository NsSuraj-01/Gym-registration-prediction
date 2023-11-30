// const express = require("express");
// const bodyParser = require("body-parser");
// const path = require("path");
// const mongoose = require("mongoose");
// const ejs = require("ejs");
// const _ = require("lodash");


// const app = express();
// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({
//   extended: true
// }))
// app.use(express.static(('public')));


// // ----- Database ----- 
// const dbName = "Students"
// const dbURI = "mongodb://127.0.0.1:27017/" +dbName;

// mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
// .then( () => console.log("connected to " + dbName + " database"))
// .catch( (err) => console.log(err))

// // schema
// const resultSchema = new mongoose.Schema(
//   {
//     "StudentID": Number,
//     "FirstName": String,
//     "LastName" : String,
//     "Age": Number,
//     "Gender": String,
//     "Height": Number,
//     "Weight": Number,
//     "BloodPressure": String,
//     "Cholesterol": Number,
//     "HeartRate": Number,
//     "TestDate": String,
//     "TestResult": String
//   }
// )

// // model
// const Result = mongoose.model("Result", resultSchema);

// // count number of documents
// async function countDocs() {
//   const num = await Result.countDocuments();
//   console.log(num);
// }

// const stInfo = [];
// // find query
// async function find(key, value) {
//   const results = await Result.find({[key] : value})
//   results.forEach( (item) => {
//     stInfo.push(item);
//   });
//   console.log(stInfo);
// }



// // server

// app.get("/", (req, res) => {
//   res.render("getData");
// })

// app.post("/getData", (req, res) => {
//   const sid = req.body.id;
//   find("StudentID" ,sid);
//   res.render("result");
// })

// app.get("/result", (req, res) => {
//   res.render("result", {
//     results : stInfo
//   })
// })

// app.listen(3000, () => {
//   console.log("Server is running on Port 3000");
// })

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(('public')));

// ----- Database ----- 
const dbName = "Students";
const dbURI = "mongodb://127.0.0.1:27017/" + dbName;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to " + dbName + " database"))
  .catch((err) => console.log(err));

// Schema
const resultSchema = new mongoose.Schema({
  "StudentID": Number,
  "FirstName": String,
  "LastName": String,
  "Age": Number,
  "Gender": String,
  "Height": Number,
  "Weight": Number,
  "BloodPressure": String,
  "Cholesterol": Number,
  "HeartRate": Number,
  "TestDate": String,
  "TestResult": String
});

// Model
const Result = mongoose.model("Result", resultSchema);

// Function to find query
async function find(key, value) {
  const stInfo = [];
  const results = await Result.find({ [key]: value });
  results.forEach((item) => {
    stInfo.push(item);
  });
  return stInfo;
}

// Server
app.get("/", (req, res) => {
  res.render("getData");
});

app.get("/form", (req, res) => {
  res.render("form");
})

app.post("/getData", async (req, res) => {
  const sid = req.body.id;
  const stInfo = await find("StudentID", sid);
  res.render("result", { results: stInfo });
});

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});

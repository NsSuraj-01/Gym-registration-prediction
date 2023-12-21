
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

async function insert(key, value, doc) {
  await Result.insert({[key] : value}, doc);
}

async function findAndReplace(key, value, doc) {
  const res = await Result.findOneAndReplace({[key] : value}, doc, {upsert: true})
  if(res === null) {
    console.log("Inserted")
  } else {
    console.log("Updated")
  }
}

// async function getCount() {
  
// }

// Server
app.get("/", (req, res) => {
  res.render("getData");
});

app.get("/form", (req, res) => {
  res.render("form");
})

app.post("/form", (req, res) => {
  const data = req.body;
  const sid = req.body.StudentID;
  // console.log(data, sid);
  findAndReplace("StudentID", sid, data);
  res.render("getData")
})

app.get("/getData", (req, res) => {
  res.render("getData")
})

app.post("/getData", async (req, res) => {
  const sid = req.body.id;
  const stInfo = await find("StudentID", sid);
  res.render("result", { results: stInfo });
});

app.get("/gym-data", (req, res) => {
  const total_count = getCount();
  res.render("gym-data", {
    count : total_count
  })
})

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});

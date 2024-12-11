const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const apiRoutes = require('./routes/api'); 
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(('public')));
app.use(bodyParser.json());
app.use('/api', apiRoutes); // All API routes start with /api

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

const axios = require("axios");

async function getPrediction(data) {
  try {
    // Send data to your Python API or model
    const response = await axios.post("http://127.0.0.1:8000/predict", data); 
    return response.data.prediction; 
  } catch (error) {
    console.error("Error during prediction:", error.message);
    return { error: "Prediction failed. Try again later." };
  }
}

module.exports = { app, findAndReplace };

// Server
app.get("/", (req, res) => {
  res.render("home", {activePage: "home"});
});

app.get("/form", (req, res) => {
  res.render("form", { activePage: "form" });
})

app.post("/form", async (req, res) => {
  const data = req.body;
  const action = req.body.action; 

  if (action === "submit") {
    await findAndReplace("StudentID", data.StudentID, data);
    console.log("Data saved or updated successfully");
    res.render("home", { activePage: "home", message: "Form submitted successfully!" });
  }
  else if (action === "predict") {
    test_data = {
      Age: data.Age,
      Gender: data.Gender,
      BMI: data.Weight / ((data.Height / 100) ** 2),
      Cholesterol: data.Cholesterol,
      HeartRate: data.HeartRate,
    };

    const prediction = await getPrediction(test_data);

    if (prediction.error) {
      res.status(500).send("Prediction failed. Try again later.");
      return;
    }

    console.log("Prediction result:", prediction);
    const updatedData = { ...data, Prediction: prediction };
    await findAndReplace("StudentID", data.StudentID, updatedData);

    res.render("prediction", { activePage: "prediction", prediction: prediction });
  }
  else {
    res.status(400).send("Invalid action");
  }
});


app.get("/getData", (req, res) => {
  res.render("getData", {activePage: "getData"} )
})

app.post("/getData", async (req, res) => {
  const sid = req.body.id;
  const stInfo = await find("StudentID", sid);
  res.render("result", { activePage : "getData", results: stInfo });
});

app.get("/gym", (req, res) => {
  res.render("gym", {activePage : "gym"} );
});

app.listen(3000, () => {
  console.log("Server is running on Port 3000");
});
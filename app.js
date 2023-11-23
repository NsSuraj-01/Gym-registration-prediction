const express = require("express");
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/stats.html");
})

app.post("/", (req, res) => {
  var mass = Number(req.body.m);
  var height = parseFloat(req.body.h);
  
  console.log(mass, height);
  var index = mass / (height ** 2);
  index = (Math.round(index*10)/10);

  var result = function(index) {
    if (index < 18.5) {
      return ("Underweight")
    } else if (index >= 18.5 && index <= 24.9) {
      return ("Healthy weight")
    } else {
      return ("Overweight | Obesity")
    }
  }

  res.send("Your BMI: " + index + "<br>Status: " + result(index));
})

app.listen(1000, () => {
  console.log("Server is running on Port 3000");
})

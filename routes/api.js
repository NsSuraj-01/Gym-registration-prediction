const { findAndReplace } = require('../app');
const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to handle form submission
router.post('/form', async (req, res) => {
  try {
    const formData = req.body;
    await findAndReplace({ StudentID : formData.StudentID }, formData);
    res.status(200).send('Form data successfully submitted and saved!');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle prediction
router.post('/predict', async (req, res) => {
  try {
    const formData = req.body;

    // Ensure required fields for prediction
    const requiredFields = ['Age', 'Gender', 'Height', 'Weight', 'Cholesterol', 'HeartRate'];
    const missingFields = requiredFields.filter(field => !(field in formData));

    if (missingFields.length > 0) {
      return res.status(400).send(`Missing fields: ${missingFields.join(', ')}`);
    }

    // Calculate BMI for prediction
    formData.BMI = formData.Weight / ((formData.Height / 100) ** 2);

    // Call Python API for prediction
    const response = await axios.post('http://127.0.0.1:5000/predict', {
      Age: formData.Age,
      Gender: formData.Gender,
      BMI: formData.BMI,
      Cholesterol: formData.Cholesterol,
      HeartRate: formData.HeartRate,
    });

    const prediction = response.data.prediction;

    // Add prediction to the form data
    formData.Prediction = prediction;

    // Update the database with the form data and prediction
    const query = { StudentID: formData.StudentID };
    await findAndReplace(query, formData);

    res.status(200).json({
      updatedData: formData,
      message: 'Prediction successful and data updated!',
    });
  } catch (error) {
    console.error('Error predicting:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

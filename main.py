# import os
# import io
# import pickle
# import pandas as pd

# import numpy as np
# from PIL import Image
# from PIL import ImageOps

# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware

# # Load the model
# try:
#     with open('./model.pkl', 'rb') as f:
#         model = pickle.load(f)
# except Exception as e:
#     print(f'Error loading the model : {e}')
#     model = None

# app = FastAPI()

# # CORS middleware setup
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"]
# )

# @app.post("/predict")
# async def predict_reg(data: dict):
#     if model is None:
#         return {"error": "Model not loaded"}
     
#     test_data = pd.DataFrame({
#         "Age": data["Age"],
#         "Gender": data["Gender"],
#         "BMI": data["BMI"],
#         "Cholesterol": data["Cholesterol"],
#         "HeartRate": data["HeartRate"]
#     })
    
#     # Make prediction
#     pred = model.predict(test_data)
    
#     return {"prediction": int(pred[0])}

import pickle
import pandas as pd
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# Load the model
try:
    with open('./model.pkl', 'rb') as f:
        model = pickle.load(f)
    print("Model loaded successfully.")
except Exception as e:
    print(f"Error loading the model: {e}")
    model = None

# Initialize FastAPI app
app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Input validation using Pydantic
class PredictionInput(BaseModel):
    Age: int
    Gender: int  # 0 for Male, 1 for Female
    BMI: float
    Cholesterol: int
    HeartRate: int

# Prediction endpoint
@app.post("/predict")
async def predict_reg(data: PredictionInput):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    # Convert input to DataFrame
    test_data = pd.DataFrame([{
        "Age": data.Age,
        "Gender": data.Gender,
        "BMI": data.BMI,
        "Cholesterol": data.Cholesterol,
        "HeartRate": data.HeartRate
    }])

    try:
        # Make prediction
        pred = model.predict(test_data)
        return {"prediction": int(pred[0])}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

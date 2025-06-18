from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model("C:/Users/DELL/Documents/ML Projects/Plant-Disease/Plant Disease/models/1.keras")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return {"message": "hell alive"}

def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((256, 256))  
    image = np.array(image) / 255.0   

    image = np.array(Image.open(BytesIO(data)))
    return image

@app.post("/predict")
async def predict(
     file: UploadFile = File(...)
     ):
    # try:
        image = read_file_as_image(await file.read())
        img_batch = np.expand_dims(image, 0)  
        predictions = MODEL.predict(img_batch)
        predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
        confidence = float(np.max(predictions[0]))
        return {
            "class": predicted_class,
            "confidence": confidence
        }
  

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8010)
from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI()

model = YOLO("model/yolov8n.pt") # auto-downloads

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

    results = model(img)

    image_area = img.shape[0] * img.shape[1]
    severity = 0

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            area = (x2 - x1) * (y2 - y1)
            severity += (area / image_area) * 100

    severity = min(int(severity), 100)

    level = (
        "Low" if severity < 30 else
        "Medium" if severity < 60 else
        "High"
    )

    return {
        "severity_score": severity,
        "severity_level": level
    }

from fastapi import FastAPI, UploadFile, File, HTTPException
from ultralytics import YOLO
import cv2
import numpy as np

app = FastAPI()

# ✅ Load YOUR trained pothole model
model = YOLO("model/best.pt")

@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    image_bytes = await file.read()

    img = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

    if img is None:
        raise HTTPException(status_code=400, detail="Invalid image file")

    results = model(img, conf=0.4)

    image_area = img.shape[0] * img.shape[1]
    severity = 0
    boxes_data = []

    for r in results:
        for box in r.boxes:
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            conf = float(box.conf[0])

            area = (x2 - x1) * (y2 - y1)
            severity += (area / image_area) * 100

            boxes_data.append({
                "x1": int(x1),
                "y1": int(y1),
                "x2": int(x2),
                "y2": int(y2),
                "confidence": round(conf, 2)
            })

    severity = min(int(severity), 100)

    level = (
        "Low" if severity < 30 else
        "Medium" if severity < 60 else
        "High"
    )

    return {
        "severity_score": severity,
        "severity_level": level,
        "potholes_detected": len(boxes_data),
        "boxes": boxes_data
    }

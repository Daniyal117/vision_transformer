# app.py

from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from celery_worker import run_inference
from inference import load_model  # import startup loader

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # match your frontend host port,  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Startup event: load model once
# -----------------------------
@app.on_event("startup")
def startup_event():
    load_model()  # downloads from Google Drive if missing & loads model into memory


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # Send job to Celery queue (async inference)
    task = run_inference.delay(image_bytes)

    return {"task_id": task.id}


@app.get("/result/{task_id}")
def get_result(task_id: str):
    task = run_inference.AsyncResult(task_id)

    if task.state == "PENDING":
        return {"status": "processing"}

    elif task.state == "SUCCESS":
        result = task.result  # e.g., "live" or "fake"
        prediction = {
            "label": "Real" if result.lower() == "live" else "Spoof",
            "confidence": 0.99  # optional placeholder
        }
        return {"status": "done", "prediction": prediction}

    else:
        return {"status": "failed"}

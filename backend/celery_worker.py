import os
from celery import Celery
from inference import predict_bytes

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

app = Celery(
    "ml_worker",
    broker=redis_url,
    backend=redis_url
)

@app.task
def run_inference(image_bytes):
    return predict_bytes(image_bytes)

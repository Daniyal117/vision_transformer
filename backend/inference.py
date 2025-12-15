# inference.py

from transformers import ViTForImageClassification, AutoImageProcessor
from PIL import Image
import torch
import io
import os
import gdown

MODEL_FOLDER = "content/final-vit-model"
GOOGLE_DRIVE_FOLDER_URL = "https://drive.google.com/drive/folders/1rCpBT7TZr1kK_ZypIH8m24l4x1wbpatQ?usp=sharing"

model = None
processor = None


def download_model_if_missing():
    """Download Google Drive folder only if it's not already present."""
    if not os.path.exists(MODEL_FOLDER) or len(os.listdir(MODEL_FOLDER)) == 0:
        print("📥 Downloading model from Google Drive...")
        os.makedirs(MODEL_FOLDER, exist_ok=True)
        gdown.download_folder(GOOGLE_DRIVE_FOLDER_URL, output=MODEL_FOLDER, quiet=False)
        print("✅ Model downloaded successfully.")
    else:
        print("🚀 Model already available. Skipping download.")


def load_model():
    global model, processor

    if model is None:
        download_model_if_missing()

        print("🔄 Loading model into memory...")
        model = ViTForImageClassification.from_pretrained(MODEL_FOLDER)
        processor = AutoImageProcessor.from_pretrained(MODEL_FOLDER)
        model.eval()
        print("✅ Model loaded.")

    return model, processor


def predict_bytes(image_bytes: bytes):
    model, processor = load_model()

    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    pred_id = outputs.logits.argmax(-1).item()
    return model.config.id2label[pred_id]

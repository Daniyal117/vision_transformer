# 🛡️ Deep Visionary 

**Vision Transformer • FastAPI • Celery • Redis • React • Docker**

A full-stack, production-ready **DeepFake image detection system** powered by a **Vision Transformer (ViT)** model.
The application supports **asynchronous inference**, **real-time frontend polling**, and **fully dockerized deployment**.

---

## 🚀 Features

* 🔍 Vision Transformer (ViT) based DeepFake detection
* ⚡ FastAPI backend with async request handling
* 🧵 Celery + Redis for background inference
* 🌐 React (Vite) frontend
* 🐳 Fully Dockerized (Backend, Worker, Redis, Frontend)
* 📡 Async API (`/predict` → `/result/{task_id}`)
* 🔐 Proper CORS & Docker networking
* 📦 Model persistence using Docker volumes

---

## 🏗️ Architecture

```text
Frontend (React)
     |
     | HTTP
     v
FastAPI Backend
     |
     | Async Task
     v
Celery Worker
     |
     | Inference
     v
Vision Transformer Model
     |
     v
Redis (Broker & Results)
```

---

## 🔌 API Endpoints

### ➤ Predict Image

```http
POST /predict
```

**Request**

* `multipart/form-data`
* Field: `file`

**Response**

```json
{
  "task_id": "abc123"
}
```

---

### ➤ Get Prediction Result

```http
GET /result/{task_id}
```

**Processing**

```json
{ "status": "processing" }
```

**Success**

```json
{
  "status": "done",
  "prediction": {
    "label": "Real",
    "confidence": 0.99
  }
}
```

**Failure**

```json
{ "status": "failed" }
```

---

## 🐳 Docker Setup

### Prerequisites

* Docker
* Docker Compose

---

### Build & Run

```bash
docker-compose up --build
```

---

### Access Services

| Service  | URL                                            |
| -------- | ---------------------------------------------- |
| Frontend | [http://localhost:3000](http://localhost:3000) |
| Backend  | [http://localhost:8000](http://localhost:8000) |
| Redis    | redis://localhost:6379                         |

---

## 🌍 Docker Networking (Important)

* ❌ `localhost` does NOT work between containers
* ✅ Containers communicate via **service names**

Frontend uses:

```ts
VITE_API_URL=http://backend:8000
```

---

## 🔐 CORS Configuration

Backend allows frontend access:

```python
allow_origins=["http://localhost:3000"]
```

---

## 📦 Model Handling

* Model files are NOT committed to GitHub
* Loaded at startup or from Docker volume

```yaml
volumes:
  - model-data:/app/content/final-vit-model
```

---

## 🧠 Why Celery?

* Prevents blocking API requests
* Handles heavy ML inference
* Enables scalable async processing
* Perfect for production ML systems

---

## 🛠️ Tech Stack

**Backend**

* FastAPI
* Celery
* Redis
* PyTorch / Transformers

**Frontend**

* React
* Vite
* Tailwind

**DevOps**

* Docker
* Docker Compose

---

## 🚀 Deployment Ready

Can be deployed on:

* AWS (EC2 / ECS)
* Google Cloud (GCE / Cloud Run)
* Azure (VM / Containers)

Next steps:

* Cloud deployment
* CI/CD with GitHub Actions

---

## 👨‍💻 Author

**Muhammad Daniyal Ijaz**
AI / ML Engineer
FastAPI • Vision Transformers • Docker • Cloud

---

## ⭐ Support

If you find this project useful:

* ⭐ Star the repository
* 🍴 Fork it
* 🚀 Deploy it

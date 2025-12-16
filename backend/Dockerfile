FROM pytorch/pytorch:2.1.2-cpu

WORKDIR /app

# Install only minimal OS deps
RUN apt-get update && apt-get install -y \
    wget unzip git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Torch already exists — pip will skip it
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gdown

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

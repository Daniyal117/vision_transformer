FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    wget unzip git build-essential \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip
RUN pip install --upgrade pip

# Install CPU-only PyTorch FIRST (correct version)
RUN pip install --no-cache-dir torch==2.9.0+cpu -f https://download.pytorch.org/whl/cpu

# Install remaining dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]

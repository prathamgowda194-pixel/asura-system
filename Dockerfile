FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV PORT=8501
ENV GEMINI_API_KEY=AQ.Ab8RN6LQTcBVg27285xhxo4j7NrFIsXGY9tKv96nGlh6e6rlDQ

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy single-file app.py
COPY app.py ./

EXPOSE 8501

# Streamlit cloud entrypoint with dynamic port binding
CMD ["sh", "-c", "streamlit run app.py --server.port=${PORT:-8501} --server.address=0.0.0.0 --server.enableCORS=false --server.enableXsrfProtection=false"]

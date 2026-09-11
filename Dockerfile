# ==============================================================================
# STAGE 1: Build React Frontend Glassmorphic Dashboard
# ==============================================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY index.html vite.config.js tailwind.config.js postcss.config.js ./
COPY src/ ./src/
RUN npm run build

# ==============================================================================
# STAGE 2: Python 3.11 Runtime for CrewAI Orchestrator & API Server
# ==============================================================================
FROM python:3.11-slim AS runner

# System dependencies for high-performance networking
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python requirements
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY asura_core.py ./

# Copy compiled frontend from Stage 1 into /app/dist
COPY --from=frontend-builder /app/dist ./dist

# Set production environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000
ENV ASURA_LLM_MODEL=gemini-1.5-pro

EXPOSE 8000

# Start server hosting both the static glass dashboard and live agent telemetry
CMD ["python", "asura_core.py", "--server"]

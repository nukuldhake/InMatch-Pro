#!/bin/bash
cd backend
echo "Starting InMatch Pro API..."
echo "PORT: ${PORT:-8000}"
echo "Environment: ${ENVIRONMENT:-production}"
python -m uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}

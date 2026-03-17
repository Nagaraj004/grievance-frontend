#!/bin/bash
echo "🚀 Starting Tamil Nadu Grievance Portal Backend..."
echo ""

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "📦 Installing dependencies..."
pip install -r requirements.txt -q

echo "🗄️  Running database migrations..."
alembic upgrade head

echo "✅ Starting FastAPI server on http://localhost:8000"
echo "📖 Swagger UI: http://localhost:8000/docs"
echo ""
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

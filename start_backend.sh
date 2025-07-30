#!/bin/bash
# Backend Startup Script
echo "Starting Drvyn Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies if needed
if [ ! -f "requirements.txt" ]; then
    echo "Requirements file not found. Please run the setup script first."
    exit 1
fi

pip install -r requirements.txt

# Start the Flask app
echo "Starting Flask server on http://localhost:8000"
python app.py

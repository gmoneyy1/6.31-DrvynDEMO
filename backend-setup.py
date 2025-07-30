#!/usr/bin/env python3
"""
Backend Setup Script for Drvyn Dashboard
This script helps set up the Flask backend with all required dependencies.
"""

import os
import subprocess
import sys

def create_requirements_file():
    """Create requirements.txt with all necessary dependencies."""
    requirements = """Flask==2.3.3
requests==2.31.0
beautifulsoup4==4.12.2
python-dotenv==1.0.0
openai==1.3.0
pywebpush==1.14.1
Flask-SQLAlchemy==3.0.5
Flask-Login==0.6.3
Flask-WTF==1.1.1
Werkzeug==2.3.7
python-jose==3.3.0
pytz==2023.3
cohere==4.37
"""
    
    with open('requirements.txt', 'w') as f:
        f.write(requirements)
    print("✅ Created requirements.txt")

def create_env_file():
    """Create .env file with default configuration."""
    env_content = """FLASK_SECRET_KEY=your-secret-key-here-change-this-in-production
DATABASE_URL=sqlite:///drvyn.db
COHERE_API_KEY=your-cohere-api-key-here
AI_PROVIDER=cohere
"""
    
    with open('.env', 'w') as f:
        f.write(env_content)
    print("✅ Created .env file")
    print("⚠️  Please update the .env file with your actual API keys")

def create_backend_directory():
    """Create backend directory and move app.py there."""
    if not os.path.exists('backend'):
        os.makedirs('backend')
        print("✅ Created backend directory")

def install_dependencies():
    """Install Python dependencies."""
    try:
        subprocess.run([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Installed Python dependencies")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies. Please run manually:")
        print("pip install -r requirements.txt")

def create_startup_script():
    """Create a startup script for the backend."""
    startup_script = """#!/bin/bash
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
"""
    
    with open('start_backend.sh', 'w') as f:
        f.write(startup_script)
    
    # Make it executable
    os.chmod('start_backend.sh', 0o755)
    print("✅ Created start_backend.sh script")

def main():
    """Main setup function."""
    print("🚀 Setting up Drvyn Backend...")
    print()
    
    # Create backend directory
    create_backend_directory()
    
    # Create requirements file
    create_requirements_file()
    
    # Create .env file
    create_env_file()
    
    # Install dependencies
    install_dependencies()
    
    # Create startup script
    create_startup_script()
    
    print()
    print("🎉 Backend setup complete!")
    print()
    print("Next steps:")
    print("1. Update .env file with your API keys")
    print("2. Run the backend: ./start_backend.sh")
    print("3. Or manually: python app.py")
    print("4. Backend will be available at http://localhost:8000")
    print()
    print("Frontend integration:")
    print("- The frontend is configured to connect to http://localhost:8000")
    print("- Make sure CORS is properly configured if needed")
    print("- Test the connection by visiting http://localhost:8000")

if __name__ == "__main__":
    main() 
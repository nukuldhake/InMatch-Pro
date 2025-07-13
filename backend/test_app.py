#!/usr/bin/env python3
"""
Simple test to verify the FastAPI app can start
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from app.main import app
    print("✅ FastAPI app imported successfully")
    print(f"✅ App title: {app.title}")
    print(f"✅ App version: {app.version}")
    
    # Test if we can create the app
    import uvicorn
    print("✅ Uvicorn imported successfully")
    
    print("\n🚀 App should be ready to start!")
    
except Exception as e:
    print(f"❌ Error importing app: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)

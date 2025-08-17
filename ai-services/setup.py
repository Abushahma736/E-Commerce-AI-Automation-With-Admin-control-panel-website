#!/usr/bin/env python3
"""
Setup script for AI Voice Assistant
"""

import os
import sys
import subprocess

def install_requirements():
    """Install required Python packages"""
    print("📦 Installing required packages...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✅ All packages installed successfully!")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing packages: {e}")
        return False

def setup_api_key():
    """Help user set up Gemini API key"""
    print("\n🔑 Gemini API Key Setup")
    print("=" * 30)
    
    current_key = os.getenv('GEMINI_API_KEY')
    if current_key:
        print(f"✅ API key already set: {current_key[:10]}...")
        return True
    
    print("❌ GEMINI_API_KEY environment variable not found!")
    print("\n📋 To get your Gemini API key:")
    print("1. Go to https://makersuite.google.com/app/apikey")
    print("2. Create a new API key")
    print("3. Copy the key")
    print("\n💡 To set the API key temporarily:")
    print("   Windows: set GEMINI_API_KEY=your_api_key_here")
    print("   Linux/Mac: export GEMINI_API_KEY=your_api_key_here")
    
    print("\n💡 To set permanently (Windows):")
    print("   setx GEMINI_API_KEY your_api_key_here")
    
    return False

def check_microphone():
    """Check if microphone is available"""
    print("\n🎤 Checking microphone...")
    try:
        import speech_recognition as sr
        r = sr.Recognizer()
        mics = sr.Microphone.list_microphone_names()
        if mics:
            print(f"✅ Found {len(mics)} microphone(s)")
            print("📋 Available microphones:")
            for i, mic in enumerate(mics):
                print(f"   {i}: {mic}")
        else:
            print("❌ No microphones found!")
        return len(mics) > 0
    except Exception as e:
        print(f"❌ Error checking microphones: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 AI Voice Assistant Setup")
    print("=" * 40)
    
    # Check Python version
    if sys.version_info < (3, 7):
        print("❌ Python 3.7 or higher is required!")
        sys.exit(1)
    
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor} detected")
    
    # Install requirements
    if not install_requirements():
        print("❌ Setup failed at package installation!")
        sys.exit(1)
    
    # Check microphone
    check_microphone()
    
    # Setup API key
    api_key_set = setup_api_key()
    
    print("\n" + "=" * 40)
    print("🎉 Setup Summary:")
    print("✅ Python packages installed")
    print("✅ Microphone check completed")
    if api_key_set:
        print("✅ API key configured")
    else:
        print("⚠️  API key needs to be set")
    
    print("\n🚀 To run the voice assistant:")
    print("   python voice_assistant.py")
    
    if not api_key_set:
        print("\n⚠️  Don't forget to set your GEMINI_API_KEY first!")

if __name__ == "__main__":
    main()

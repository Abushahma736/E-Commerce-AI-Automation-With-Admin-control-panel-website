#!/usr/bin/env python3
"""
Test script for AI Voice Assistant
"""

import os
import sys
from voice_assistant import VoiceAssistant

def test_tts():
    """Test text-to-speech functionality"""
    print("🔊 Testing Text-to-Speech...")
    try:
        assistant = VoiceAssistant()
        test_messages = [
            "Hello! This is a test of text to speech.",
            "नमस्ते! यह text to speech का test है।",
            "Testing Hindi and English mixed conversation."
        ]
        
        for msg in test_messages:
            print(f"Speaking: {msg}")
            assistant.speak(msg)
            input("Press Enter to continue to next message...")
        
        print("✅ Text-to-Speech test completed!")
        return True
        
    except Exception as e:
        print(f"❌ TTS Error: {e}")
        return False

def test_api():
    """Test Gemini API connectivity"""
    print("🧠 Testing Gemini API...")
    
    if not os.getenv('GEMINI_API_KEY'):
        print("❌ GEMINI_API_KEY not set!")
        return False
    
    try:
        assistant = VoiceAssistant()
        test_input = "Hello, how are you?"
        
        print(f"Testing API with: {test_input}")
        response = assistant.call_gemini_api(test_input)
        print(f"API Response: {response}")
        
        if response and "error" not in response.lower():
            print("✅ API test successful!")
            return True
        else:
            print("❌ API returned error response")
            return False
            
    except Exception as e:
        print(f"❌ API Error: {e}")
        return False

def test_speech_recognition():
    """Test speech recognition"""
    print("🎤 Testing Speech Recognition...")
    print("This will test if your microphone works with speech recognition.")
    
    try:
        assistant = VoiceAssistant()
        print("Please say something (you have 10 seconds)...")
        
        result = assistant.listen()
        if result:
            print(f"✅ Speech Recognition successful: '{result}'")
            return True
        else:
            print("❌ No speech detected or recognition failed")
            return False
            
    except Exception as e:
        print(f"❌ Speech Recognition Error: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 AI Voice Assistant Test Suite")
    print("=" * 40)
    
    tests = [
        ("Text-to-Speech", test_tts),
        ("Gemini API", test_api),
        ("Speech Recognition", test_speech_recognition),
    ]
    
    results = {}
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} test...")
        try:
            results[test_name] = test_func()
        except KeyboardInterrupt:
            print("\n⏹️ Test interrupted by user")
            results[test_name] = False
        print("-" * 40)
    
    # Summary
    print("\n🏁 Test Results Summary:")
    print("=" * 30)
    
    passed = 0
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:<20}: {status}")
        if result:
            passed += 1
    
    total = len(results)
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Your voice assistant is ready to use!")
        print("\n🚀 To run the assistant:")
        print("   python voice_assistant.py")
    else:
        print("⚠️  Some tests failed. Please check the errors above.")
        if not results.get("Gemini API", True):
            print("💡 Don't forget to set your GEMINI_API_KEY!")

if __name__ == "__main__":
    main()

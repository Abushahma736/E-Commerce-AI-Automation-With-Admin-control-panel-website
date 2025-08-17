#!/usr/bin/env python3
"""
AI Voice Assistant using Gemini API
Supports conversation on any topic with speech-to-text and text-to-speech
"""

import os
import json
import time
import threading
import requests
import speech_recognition as sr
try:
    import pyaudio
    PYAUDIO_AVAILABLE = True
except ImportError:
    PYAUDIO_AVAILABLE = False
import pyttsx3
from typing import List, Dict, Optional

class VoiceAssistant:
    def __init__(self):
        # Initialize speech recognition
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        
        # Initialize text-to-speech
        self.tts_engine = pyttsx3.init()
        self.setup_tts()
        
        # Gemini API configuration
        self.api_key = os.getenv('GEMINI_API_KEY')
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
        
        # Conversation history
        self.conversation_history: List[Dict] = []
        self.max_history = 10  # Keep last 10 exchanges
        
        # Status flags
        self.is_listening = False
        self.is_speaking = False
        
    def setup_tts(self):
        """Configure text-to-speech engine"""
        voices = self.tts_engine.getProperty('voices')
        if voices:
            # Try to set a female voice if available
            for voice in voices:
                if 'female' in voice.name.lower() or 'zira' in voice.name.lower():
                    self.tts_engine.setProperty('voice', voice.id)
                    break
        
        # Set speech rate and volume
        self.tts_engine.setProperty('rate', 200)  # Speed of speech
        self.tts_engine.setProperty('volume', 0.9)  # Volume level (0.0 to 1.0)
    
    def speak(self, text: str):
        """Convert text to speech"""
        if not text.strip():
            return
        
        self.is_speaking = True
        print(f"🤖 Assistant: {text}")
        
        try:
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
        except Exception as e:
            print(f"Error in text-to-speech: {e}")
        finally:
            self.is_speaking = False
    
    def listen(self) -> Optional[str]:
        """Listen for speech and convert to text"""
        if self.is_speaking:
            return None
            
        try:
            print("🎤 Listening...")
            with self.microphone as source:
                # Adjust for ambient noise
                self.recognizer.adjust_for_ambient_noise(source, duration=0.5)
                # Listen for audio
                audio = self.recognizer.listen(source, timeout=5, phrase_time_limit=10)
            
            print("🔄 Processing speech...")
            # Convert speech to text
            text = self.recognizer.recognize_google(audio, language='hi-IN,en-IN')
            print(f"👤 You: {text}")
            return text
            
        except sr.WaitTimeoutError:
            return None
        except sr.UnknownValueError:
            print("❌ Could not understand audio")
            return None
        except sr.RequestError as e:
            print(f"❌ Speech recognition error: {e}")
            return None
    
    def call_gemini_api(self, user_input: str) -> str:
        """Make API call to Gemini AI"""
        if not self.api_key:
            return "कृपया GEMINI_API_KEY environment variable set करें।"
        
        # Prepare conversation context
        context = self.build_context()
        
        # Prepare the prompt with context
        full_prompt = f"""आप एक helpful AI assistant हैं। User के साथ natural conversation करें। 
        आप Hindi और English दोनों भाषाओं में जवाब दे सकते हैं।
        
        Previous conversation context:
        {context}
        
        Current user message: {user_input}
        
        कृपया एक natural और helpful response दें।"""
        
        payload = {
            "contents": [{
                "parts": [{
                    "text": full_prompt
                }]
            }],
            "generationConfig": {
                "temperature": 0.7,
                "topK": 40,
                "topP": 0.95,
                "maxOutputTokens": 1024,
            }
        }
        
        headers = {
            "Content-Type": "application/json",
        }
        
        try:
            response = requests.post(
                f"{self.api_url}?key={self.api_key}",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                if 'candidates' in result and result['candidates']:
                    return result['candidates'][0]['content']['parts'][0]['text']
                else:
                    return "माफ करें, मुझे कोई response नहीं मिला।"
            else:
                return f"API Error: {response.status_code} - {response.text}"
                
        except requests.RequestException as e:
            return f"Network error: {str(e)}"
        except Exception as e:
            return f"Error: {str(e)}"
    
    def build_context(self) -> str:
        """Build conversation context from history"""
        if not self.conversation_history:
            return "No previous conversation."
        
        context_parts = []
        for exchange in self.conversation_history[-5:]:  # Last 5 exchanges
            context_parts.append(f"User: {exchange['user']}")
            context_parts.append(f"Assistant: {exchange['assistant']}")
        
        return "\n".join(context_parts)
    
    def add_to_history(self, user_input: str, assistant_response: str):
        """Add exchange to conversation history"""
        self.conversation_history.append({
            'user': user_input,
            'assistant': assistant_response,
            'timestamp': time.time()
        })
        
        # Keep only recent history
        if len(self.conversation_history) > self.max_history:
            self.conversation_history = self.conversation_history[-self.max_history:]
    
    def run(self):
        """Main application loop"""
        print("🚀 AI Voice Assistant शुरू हो रहा है...")
        print("📋 Commands:")
        print("   - 'exit' या 'quit' कहें बंद करने के लिए")
        print("   - 'clear history' कहें conversation history साफ़ करने के लिए")
        print("=" * 50)
        
        # Welcome message
        welcome_msg = "नमस्ते! मैं आपका AI voice assistant हूं। आप मुझसे किसी भी topic पर बात कर सकते हैं। कैसे मदद कर सकता हूं?"
        self.speak(welcome_msg)
        
        while True:
            try:
                # Listen for user input
                user_input = self.listen()
                
                if user_input is None:
                    continue
                
                # Check for exit commands
                if user_input.lower() in ['exit', 'quit', 'बंद करो', 'बंद कर दो']:
                    farewell = "धन्यवाद! फिर मिलेंगे!"
                    self.speak(farewell)
                    break
                
                # Check for clear history command
                if 'clear history' in user_input.lower() or 'हिस्ट्री साफ़' in user_input.lower():
                    self.conversation_history.clear()
                    response = "Conversation history साफ़ कर दी गई है।"
                    self.speak(response)
                    continue
                
                # Get response from Gemini API
                print("🧠 AI से response मांगा जा रहा है...")
                response = self.call_gemini_api(user_input)
                
                # Add to history
                self.add_to_history(user_input, response)
                
                # Speak the response
                self.speak(response)
                
            except KeyboardInterrupt:
                print("\n👋 Goodbye!")
                break
            except Exception as e:
                error_msg = f"कुछ गलत हुआ: {str(e)}"
                print(f"❌ {error_msg}")
                self.speak("माफ करें, कुछ technical problem हुई है।")

def main():
    """Main function"""
    # Check if API key is set
    if not os.getenv('GEMINI_API_KEY'):
        print("❌ GEMINI_API_KEY environment variable नहीं मिला!")
        print("💡 कृपया अपनी API key set करें:")
        print("   set GEMINI_API_KEY=your_api_key_here")
        return
    
    # Create and run the voice assistant
    assistant = VoiceAssistant()
    assistant.run()

if __name__ == "__main__":
    main()

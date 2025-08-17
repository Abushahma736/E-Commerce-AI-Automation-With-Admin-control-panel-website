# 🚀 Quick Start Guide - AI Voice Assistant

## 5-Minute Setup

### Step 1: Install Dependencies
```bash
pip install SpeechRecognition pyttsx3 requests
```

### Step 2: Get Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key

### Step 3: Set API Key
```bash
# Windows (temporary)
set GEMINI_API_KEY=your_api_key_here

# Windows (permanent)
setx GEMINI_API_KEY your_api_key_here
```

### Step 4: Test Everything
```bash
python test_assistant.py
```

### Step 5: Run Assistant
```bash
python voice_assistant.py
```

## 🎤 Usage Tips

### Voice Commands
- **Start conversation**: Just speak naturally
- **Exit**: Say "exit", "quit", or "बंद करो"
- **Clear history**: Say "clear history"

### Example Conversations
```
"Hello, how are you?"
"मुझे Python सिखाना है"
"Tell me a joke"
"What's the capital of India?"
"क्या आप हिंदी बोल सकते हैं?"
```

## ⚠️ Troubleshooting

### Common Issues

**No microphone detected:**
- Check Windows privacy settings
- Allow microphone access to apps
- Test microphone in other applications first

**Speech not recognized:**
- Speak clearly and at normal pace
- Reduce background noise
- Try different microphone positions

**API errors:**
- Verify API key is set correctly
- Check internet connection
- Ensure Gemini API quota isn't exceeded

**TTS not working:**
- Check Windows volume settings
- Try restarting the application
- Verify no other applications are using audio

## 🎯 Best Practices

1. **Environment**: Use in quiet room for best results
2. **Microphone**: Position 6-12 inches from mouth
3. **Speech**: Speak clearly at normal pace
4. **Language**: You can mix Hindi and English
5. **Topics**: Ask about anything - AI can discuss any topic!

## 🔧 Customization

Edit `voice_assistant.py` to customize:
- Speech rate: Change `rate` value in `setup_tts()`
- Voice type: Modify voice selection logic
- API parameters: Adjust temperature, max tokens
- Languages: Add more language codes

---

**Ready to chat with AI? Have fun! 🎉**

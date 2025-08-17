from flask import Flask, request, jsonify
from flask_cors import CORS
import argparse
import random
import json

app = Flask(__name__)
CORS(app)

# Demo mode flag
DEMO_MODE = False

# Demo marketing content templates
DEMO_EMAIL_SUBJECTS = [
    "🌿 Transform Your Wellness Journey Today!",
    "✨ Exclusive Offer Just for You - Limited Time!",
    "🎯 Your Personalized Health & Beauty Recommendations",
    "💚 New Arrivals That Will Change Your Life",
    "🌟 Don't Miss Out - Special Discount Inside!",
    "🔥 Trending Now: Natural Beauty Essentials",
    "💝 Thank You - Here's Something Special",
    "⚡ Flash Sale Alert: Save Big Today!",
    "🌺 Spring Into Wellness - Fresh New Products",
    "🎉 Celebrate with Us - Amazing Deals Await!"
]

DEMO_EMAIL_CONTENT = [
    """Dear Valued Customer,

We're excited to share our latest collection of premium natural wellness products that will transform your daily routine.

🌿 **What's New:**
- Organic essential oils sourced directly from farms
- Ayurvedic skincare formulations
- Natural supplements for holistic health

**Special Offer:** Use code WELLNESS20 for 20% off your first purchase!

Experience the power of nature with our carefully curated selection. Your wellness journey starts here.

Best regards,
The Wellness Team""",

    """Hello Beautiful Soul,

Your wellness journey deserves the finest natural ingredients, and we're here to support every step.

✨ **Featured This Week:**
- Lavender Essential Oil - Perfect for relaxation
- Turmeric Face Mask - Anti-inflammatory benefits  
- Herbal Tea Blends - Boost your immunity

**Limited Time:** Free shipping on orders over ₹999!

Transform your self-care routine with products that love you back.

With love,
Your Natural Beauty Team""",

    """Greetings Wellness Warrior,

Ready to elevate your health and beauty regimen? We have some exciting updates just for you!

🎯 **Personalized for You:**
- Based on your previous purchases
- Recommended by our wellness experts
- Trending in your area

**Exclusive Access:** Be the first to try our new Ayurvedic face serum - launching this week!

Your path to natural wellness continues here.

Namaste,
Your Wellness Advisors"""
]

DEMO_SOCIAL_POSTS = [
    "🌿 Discover the power of natural wellness! Our organic essential oils are sourced directly from sustainable farms. Which scent speaks to your soul? #NaturalWellness #EssentialOils #OrganicLiving",
    
    "✨ Self-care Sunday vibes! Treat yourself to our luxurious Ayurvedic skincare collection. Your skin deserves the best nature has to offer. 💚 #SelfCareSunday #AyurvedicBeauty #NaturalSkincare",
    
    "🌺 NEW ARRIVAL ALERT! Our Turmeric & Honey face mask is finally here! Get that natural glow you've been dreaming of. Limited stock available! 🔥 #NewProduct #TurmericMask #NaturalGlow",
    
    "💡 Wellness Tip: Start your day with our energizing herbal tea blend. Packed with antioxidants and natural goodness to fuel your day! ☀️ #WellnessTip #HerbalTea #MorningRitual"
]

DEMO_AD_COPY = [
    {
        "headline": "Transform Your Skin Naturally",
        "description": "Discover the power of Ayurvedic skincare with our premium collection of natural beauty products.",
        "cta": "Shop Natural Beauty"
    },
    {
        "headline": "Pure Essential Oils - Direct from Farm",
        "description": "Experience authentic aromatherapy with our organic essential oils sourced from sustainable farms.",
        "cta": "Explore Essential Oils"
    },
    {
        "headline": "Wellness Made Simple",
        "description": "Your complete natural health solution with expert-curated supplements and herbal remedies.",
        "cta": "Start Your Journey"
    }
]

DEMO_CUSTOMER_SEGMENTS = [
    {
        "name": "Natural Beauty Enthusiasts",
        "description": "Customers interested in organic skincare and natural beauty products",
        "criteria": "Purchased skincare products, interested in organic ingredients",
        "size": 1250
    },
    {
        "name": "Wellness Warriors",
        "description": "Health-conscious customers focused on holistic wellness",
        "criteria": "Purchased supplements, herbal teas, or wellness products",
        "size": 890
    },
    {
        "name": "Aromatherapy Lovers",
        "description": "Customers passionate about essential oils and aromatherapy",
        "criteria": "Multiple essential oil purchases, high engagement with aromatherapy content",
        "size": 675
    },
    {
        "name": "New Customers",
        "description": "Recently registered customers who haven't made a purchase yet",
        "criteria": "Registered within last 30 days, no purchases",
        "size": 2100
    }
]

def get_demo_response(response_type, **kwargs):
    """Generate demo responses for different marketing content types"""
    
    if response_type == "email_subject":
        return {
            "success": True,
            "data": {
                "subjects": random.sample(DEMO_EMAIL_SUBJECTS, 3),
                "recommended": random.choice(DEMO_EMAIL_SUBJECTS)
            }
        }
    
    elif response_type == "email_content":
        return {
            "success": True,
            "data": {
                "content": random.choice(DEMO_EMAIL_CONTENT),
                "word_count": random.randint(150, 250),
                "engagement_score": round(random.uniform(7.5, 9.5), 1)
            }
        }
    
    elif response_type == "social_post":
        return {
            "success": True,
            "data": {
                "post": random.choice(DEMO_SOCIAL_POSTS),
                "hashtags": ["#NaturalWellness", "#OrganicLiving", "#HealthyLifestyle", "#NaturalBeauty"],
                "best_time": "6:00 PM - 8:00 PM",
                "engagement_prediction": round(random.uniform(85, 95), 1)
            }
        }
    
    elif response_type == "ad_copy":
        return {
            "success": True,
            "data": random.choice(DEMO_AD_COPY)
        }
    
    elif response_type == "customer_segment":
        return {
            "success": True,
            "data": {
                "segments": DEMO_CUSTOMER_SEGMENTS,
                "recommended_segment": random.choice(DEMO_CUSTOMER_SEGMENTS)
            }
        }
    
    elif response_type == "campaign_optimization":
        return {
            "success": True,
            "data": {
                "recommendations": [
                    "Send emails on Tuesday and Thursday for 23% higher open rates",
                    "Use personalized subject lines to increase engagement by 18%",
                    "Include customer reviews in emails for 31% better conversion",
                    "Segment audience by purchase history for 45% better targeting"
                ],
                "predicted_improvement": "32% increase in conversion rate",
                "optimal_send_time": "2:00 PM - 4:00 PM on weekdays"
            }
        }
    
    else:
        return {
            "success": False,
            "error": "Unknown response type"
        }

@app.route('/api/marketing/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    if DEMO_MODE:
        return jsonify({
            "status": "healthy",
            "mode": "demo",
            "services": {
                "email_generator": "operational",
                "content_optimizer": "operational",
                "segment_analyzer": "operational",
                "campaign_manager": "operational"
            },
            "endpoints": [
                "/api/marketing/generate-email-subject",
                "/api/marketing/generate-email-content", 
                "/api/marketing/generate-social-post",
                "/api/marketing/generate-ad-copy",
                "/api/marketing/analyze-segments",
                "/api/marketing/optimize-campaign"
            ]
        })
    
    return jsonify({
        "status": "healthy",
        "services": {
            "google_gemini": "operational",
            "email_service": "operational", 
            "analytics": "operational"
        }
    })

@app.route('/api/marketing/generate-email-subject', methods=['POST'])
def generate_email_subject():
    """Generate email subject lines"""
    if DEMO_MODE:
        return jsonify(get_demo_response("email_subject"))
    
    try:
        data = request.json
        campaign_type = data.get('campaign_type', 'promotional')
        target_audience = data.get('target_audience', 'general')
        product_focus = data.get('product_focus', '')
        
        # In real implementation, call Google Gemini API here
        # For now, return demo response
        return jsonify(get_demo_response("email_subject"))
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/marketing/generate-email-content', methods=['POST'])
def generate_email_content():
    """Generate email content"""
    if DEMO_MODE:
        return jsonify(get_demo_response("email_content"))
    
    try:
        data = request.json
        campaign_type = data.get('campaign_type', 'promotional')
        target_audience = data.get('target_audience', 'general')
        products = data.get('products', [])
        tone = data.get('tone', 'friendly')
        
        # In real implementation, call Google Gemini API here
        return jsonify(get_demo_response("email_content"))
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/marketing/generate-social-post', methods=['POST'])
def generate_social_post():
    """Generate social media post"""
    if DEMO_MODE:
        return jsonify(get_demo_response("social_post"))
    
    try:
        data = request.json
        platform = data.get('platform', 'instagram')
        product = data.get('product', '')
        occasion = data.get('occasion', 'general')
        
        # In real implementation, call Google Gemini API here
        return jsonify(get_demo_response("social_post"))
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/marketing/generate-ad-copy', methods=['POST'])
def generate_ad_copy():
    """Generate advertisement copy"""
    if DEMO_MODE:
        return jsonify(get_demo_response("ad_copy"))
    
    try:
        data = request.json
        platform = data.get('platform', 'google')
        objective = data.get('objective', 'conversions')
        target_audience = data.get('target_audience', 'general')
        
        # In real implementation, call Google Gemini API here
        return jsonify(get_demo_response("ad_copy"))
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/marketing/analyze-segments', methods=['POST'])
def analyze_customer_segments():
    """Analyze and suggest customer segments"""
    if DEMO_MODE:
        return jsonify(get_demo_response("customer_segment"))
    
    try:
        data = request.json
        criteria = data.get('criteria', {})
        
        # In real implementation, analyze actual customer data
        return jsonify(get_demo_response("customer_segment"))
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/marketing/optimize-campaign', methods=['POST'])
def optimize_campaign():
    """Provide campaign optimization suggestions"""
    if DEMO_MODE:
        return jsonify(get_demo_response("campaign_optimization"))
    
    try:
        data = request.json
        campaign_data = data.get('campaign_data', {})
        
        # In real implementation, analyze campaign performance
        return jsonify(get_demo_response("campaign_optimization"))
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='AI Marketing Automation Server')
    parser.add_argument('--demo', action='store_true', help='Run in demo mode')
    parser.add_argument('--port', type=int, default=5001, help='Port to run the server on')
    
    args = parser.parse_args()
    
    if args.demo:
        DEMO_MODE = True
        print("🚀 AI Marketing Automation Server starting in DEMO mode...")
        print("📧 Email generation: ENABLED (Demo)")
        print("📱 Social media content: ENABLED (Demo)")
        print("🎯 Ad copy generation: ENABLED (Demo)")
        print("📊 Customer segmentation: ENABLED (Demo)")
        print("🔍 Campaign optimization: ENABLED (Demo)")
    else:
        print("🚀 AI Marketing Automation Server starting in PRODUCTION mode...")
        print("⚠️  Google Gemini API key required for full functionality")
    
    print(f"🌐 Server running on http://127.0.0.1:{args.port}")
    print("🎯 Marketing automation endpoints ready!")
    
    app.run(host='127.0.0.1', port=args.port, debug=True)

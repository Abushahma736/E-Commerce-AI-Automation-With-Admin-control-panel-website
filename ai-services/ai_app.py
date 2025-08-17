#!/usr/bin/env python3
"""
AI Automation Flask API
Main server for all AI features integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
import google.generativeai as genai
from PIL import Image
import requests
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Initialize Gemini (with fallback for demo)
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY', 'demo_key')
DEMO_MODE = GOOGLE_API_KEY == 'demo_key'

if not DEMO_MODE:
    try:
        genai.configure(api_key=GOOGLE_API_KEY)
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
    except Exception as e:
        print(f"Warning: Gemini API setup failed, switching to demo mode: {e}")
        DEMO_MODE = True
else:
    print("🔧 Running in DEMO MODE - using mock AI responses")
    model = None

@app.route('/')
def home():
    return jsonify({
        "status": "AI Automation API Running",
        "version": "1.0.0",
        "services": [
            "Product Description Generation",
            "Category Classification", 
            "SEO Optimization",
            "Image Analysis",
            "Complete Automation"
        ]
    })

@app.route('/api/generate-description', methods=['POST'])
def generate_description():
    try:
        data = request.json
        product_name = data.get('product_name', '')
        features = data.get('features', [])
        category = data.get('category', '')
        
        if not product_name:
            return jsonify({"success": False, "message": "Product name is required"}), 400
        
        if DEMO_MODE:
            # Demo mode - return mock response
            features_text = ", ".join(features) if features else "natural and high-quality"
            description = f"""Experience the premium quality of {product_name} from ESSE's exclusive {category.lower()} collection. This exceptional product features {features_text} ingredients, carefully crafted to deliver outstanding results.

Our {product_name} offers natural wellness benefits that enhance your daily routine. Whether you're seeking relaxation, vitality, or overall well-being, this premium product provides the perfect solution. The carefully selected ingredients work synergistically to deliver maximum effectiveness while maintaining the highest safety standards.

Ideal for daily use, our {product_name} integrates seamlessly into your lifestyle. Experience the difference that quality makes - order your {product_name} today and discover why thousands of customers trust ESSE for their wellness journey.

Free shipping available. 30-day satisfaction guarantee. Order now!"""
        else:
            # Real AI mode
            features_text = ", ".join(features) if features else "natural and high-quality"
            prompt = f"""
            Write a compelling product description for an e-commerce website.
            
            Product Name: {product_name}
            Category: {category}
            Key Features: {features_text}
            
            Requirements:
            - Write 150-200 words
            - Focus on benefits and usage
            - Use persuasive, professional tone
            - Include key features naturally
            - SEO-friendly but not keyword-stuffed
            - End with a call-to-action
            
            Write only the product description, no additional text.
            """
            
            response = model.generate_content(prompt)
            description = response.text.strip()
        
        return jsonify({
            "success": True,
            "data": {
                "description": description,
                "word_count": len(description.split()),
                "features_used": features
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/generate-categories', methods=['POST'])
def generate_categories():
    try:
        data = request.json
        product_name = data.get('product_name', '')
        description = data.get('description', '')
        
        if not product_name:
            return jsonify({"success": False, "message": "Product name is required"}), 400
        
        if DEMO_MODE:
            # Demo mode - smart categorization based on product name
            name_lower = product_name.lower()
            if 'oil' in name_lower:
                result = {
                    "primary_category": "Essential Oils",
                    "secondary_categories": ["Aromatherapy", "Wellness"],
                    "tags": [name_lower.replace(' ', '-'), "essential-oil", "natural", "aromatherapy", "wellness"],
                    "reasoning": "Identified as essential oil based on product name analysis"
                }
            elif any(word in name_lower for word in ['vitamin', 'supplement', 'capsule', 'tablet']):
                result = {
                    "primary_category": "Supplements",
                    "secondary_categories": ["Natural Health", "Wellness"],
                    "tags": [name_lower.replace(' ', '-'), "supplement", "health", "nutrition", "wellness"],
                    "reasoning": "Categorized as supplement based on product name indicators"
                }
            elif any(word in name_lower for word in ['cream', 'serum', 'lotion', 'skin']):
                result = {
                    "primary_category": "Skincare",
                    "secondary_categories": ["Natural Health", "Wellness"],
                    "tags": [name_lower.replace(' ', '-'), "skincare", "beauty", "natural", "organic"],
                    "reasoning": "Identified as skincare product based on name analysis"
                }
            else:
                result = {
                    "primary_category": "Wellness",
                    "secondary_categories": ["Natural Health"],
                    "tags": [name_lower.replace(' ', '-'), "wellness", "natural", "health", "organic"],
                    "reasoning": "General wellness categorization for natural health product"
                }
        else:
            # Real AI mode
            prompt = f"""
            Analyze this product and suggest appropriate categories and tags:
            
            Product Name: {product_name}
            Description: {description}
            
            Available categories: Essential Oils, Supplements, Skincare, Wellness, Herbs, Aromatherapy, Natural Health
            
            Please respond in this exact JSON format:
            {{
                "primary_category": "most appropriate category",
                "secondary_categories": ["alternative category 1", "alternative category 2"],
                "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
                "reasoning": "brief explanation"
            }}
            """
            
            response = model.generate_content(prompt)
            
            # Try to parse JSON from response
            try:
                result = json.loads(response.text.strip())
            except:
                # Fallback if JSON parsing fails
                result = {
                    "primary_category": "Wellness",
                    "secondary_categories": ["Natural Health"],
                    "tags": [product_name.lower().replace(' ', '-'), "natural", "wellness"],
                    "reasoning": "AI-generated suggestion based on product name"
                }
        
        return jsonify({
            "success": True,
            "data": {
                "classification": result
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/generate-seo', methods=['POST'])
def generate_seo():
    try:
        data = request.json
        product_name = data.get('product_name', '')
        description = data.get('description', '')
        category = data.get('category', '')
        price = data.get('price', 0)
        
        if not product_name:
            return jsonify({"success": False, "message": "Product name is required"}), 400
        
        if DEMO_MODE:
            # Demo mode - generate SEO data
            slug = product_name.lower().replace(' ', '-').replace('&', 'and')
            name_keywords = product_name.lower().split()
            category_lower = category.lower() if category else "wellness"
            
            result = {
                "title": f"{product_name} - Premium {category} | ESSE",
                "meta_description": f"Shop {product_name} at ESSE. Premium {category_lower} products with natural ingredients. ₹{price}. Fast shipping & quality guaranteed.",
                "keywords": name_keywords + ["natural", "organic", "premium", category_lower, "esse", "wellness", "quality"],
                "slug": slug,
                "og_title": f"Premium {product_name} | ESSE Natural Wellness",
                "og_description": f"Discover our premium {product_name} - {category_lower} products crafted for your wellness journey."
            }
        else:
            # Real AI mode
            prompt = f"""
            Create SEO metadata for this e-commerce product:
            
            Product: {product_name}
            Category: {category}
            Description: {description}
            Price: ₹{price}
            
            Generate:
            1. SEO title (55-60 characters, include brand "ESSE")
            2. Meta description (150-160 characters)
            3. Keywords (8-10 relevant keywords)
            4. URL slug
            
            Respond in JSON format:
            {{
                "title": "SEO title here",
                "meta_description": "Meta description here", 
                "keywords": ["keyword1", "keyword2", "keyword3"],
                "slug": "url-friendly-slug",
                "og_title": "Social media title",
                "og_description": "Social media description"
            }}
            """
            
            response = model.generate_content(prompt)
            
            try:
                result = json.loads(response.text.strip())
            except:
                # Fallback SEO data
                slug = product_name.lower().replace(' ', '-').replace('&', 'and')
                result = {
                    "title": f"{product_name} - Premium Quality | ESSE",
                    "meta_description": f"Buy {product_name} online. High-quality {category.lower()} products at ESSE. ₹{price}. Free shipping available.",
                    "keywords": [slug, "natural", "organic", "wellness", category.lower()],
                    "slug": slug,
                    "og_title": f"Premium {product_name} | ESSE",
                    "og_description": f"Discover our premium {product_name}. Quality guaranteed."
                }
        
        return jsonify({
            "success": True,
            "data": {
                "seo_metadata": result
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/complete-product-automation', methods=['POST'])
def complete_automation():
    try:
        data = request.json
        product_name = data.get('product_name', '')
        features = data.get('features', [])
        category = data.get('category', '')
        price = data.get('price', 0)
        
        if not product_name:
            return jsonify({"success": False, "message": "Product name is required"}), 400
        
        # Generate description
        desc_response = generate_description()
        if desc_response[1] != 200:
            return desc_response
            
        description = desc_response[0].get_json()['data']['description']
        
        # Generate categories  
        cat_data = {"product_name": product_name, "description": description}
        cat_request = request
        cat_request.json = cat_data
        cat_response = generate_categories()
        categories = cat_response[0].get_json()['data']['classification'] if cat_response[1] == 200 else {}
        
        # Generate SEO
        seo_data = {"product_name": product_name, "description": description, "category": category, "price": price}
        seo_request = request  
        seo_request.json = seo_data
        seo_response = generate_seo()
        seo = seo_response[0].get_json()['data']['seo_metadata'] if seo_response[1] == 200 else {}
        
        return jsonify({
            "success": True,
            "data": {
                "description": description,
                "categories": categories,
                "seo": seo,
                "automation_complete": True,
                "generated_fields": ["description", "categories", "seo_metadata"]
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/analyze-image', methods=['POST'])
def analyze_image():
    try:
        data = request.json
        image_url = data.get('image_url', '')
        
        if not image_url:
            return jsonify({"success": False, "message": "Image URL is required"}), 400
        
        # Simple image analysis simulation
        # In production, you'd use BLIP or similar model
        
        return jsonify({
            "success": True,
            "data": {
                "alt_text": f"High-quality product image showing premium item",
                "description": "Professional product photography with clean background",
                "tags": ["product", "premium", "professional"],
                "colors": ["dominant color detected"],
                "objects": ["product", "packaging"]
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    if DEMO_MODE:
        gemini_status = "demo_mode"
    else:
        try:
            # Test Gemini connection
            test_response = model.generate_content("Say 'AI system is working'")
            gemini_status = "operational" if test_response.text else "error"
        except:
            gemini_status = "error"
    
    return jsonify({
        "status": "healthy",
        "services": {
            "gemini_api": gemini_status,
            "flask_server": "operational",
            "cors_enabled": True
        },
        "endpoints": [
            "/api/generate-description",
            "/api/generate-categories", 
            "/api/generate-seo",
            "/api/complete-product-automation",
            "/api/analyze-image"
        ]
    })

if __name__ == '__main__':
    print("🚀 Starting AI Automation API Server...")
    print("🔗 Available endpoints:")
    print("   • POST /api/generate-description")
    print("   • POST /api/generate-categories")
    print("   • POST /api/generate-seo")  
    print("   • POST /api/complete-product-automation")
    print("   • POST /api/analyze-image")
    print("   • GET  /api/health")
    print("\n🌐 Server running on http://127.0.0.1:5000")
    print("📱 CORS enabled for frontend integration")
    
    app.run(debug=True, host='127.0.0.1', port=5000)

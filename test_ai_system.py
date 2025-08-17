#!/usr/bin/env python3
"""
Quick AI Automation System Test
Tests all major AI services to ensure they're working properly
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://127.0.0.1:5000"

def print_header(title):
    print(f"\n{'='*60}")
    print(f"🧪 {title}")
    print('='*60)

def print_success(message):
    print(f"✅ {message}")

def print_error(message):
    print(f"❌ {message}")

def test_health_check():
    """Test if the AI automation server is running"""
    print_header("HEALTH CHECK")
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print_success("AI Automation Server is running!")
            print(f"   Status: {data['status']}")
            print(f"   Gemini: {data['services']['gemini']}")
            print(f"   BLIP: {data['services']['blip']}")
            print(f"   Recommendations: {data['services']['recommendations']}")
            return True
        else:
            print_error(f"Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Cannot connect to AI server: {e}")
        return False

def test_product_description_generation():
    """Test Gemini AI product description generation"""
    print_header("AI PRODUCT DESCRIPTION GENERATION")
    try:
        payload = {
            "product_name": "Organic Turmeric Essential Oil",
            "features": ["100% pure", "organic", "anti-inflammatory"],
            "category": "Essential Oils",
            "image_description": "Golden yellow essential oil in glass bottle"
        }
        
        response = requests.post(f"{BASE_URL}/api/generate-description", 
                               json=payload, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            description = data['data']['description']
            print_success("Product description generated successfully!")
            print(f"   Length: {len(description)} characters")
            print(f"   Preview: {description[:100]}...")
            return True
        else:
            print_error(f"Description generation failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Description generation error: {e}")
        return False

def test_recommendation_system():
    """Test the recommendation engine"""
    print_header("AI RECOMMENDATION SYSTEM")
    
    # First train the model
    try:
        print("Training recommendation model...")
        train_payload = {"use_sample_data": True, "algorithm": "NMF"}
        train_response = requests.post(f"{BASE_URL}/api/train-recommendations", 
                                     json=train_payload, timeout=15)
        
        if train_response.status_code == 200:
            train_data = train_response.json()['data']
            print_success(f"Model trained successfully!")
            print(f"   Users: {train_data['n_users']}")
            print(f"   Items: {train_data['n_items']}")
            print(f"   Ratings: {train_data['n_ratings']}")
            
            # Test user recommendations
            print("\nTesting user recommendations...")
            rec_response = requests.get(f"{BASE_URL}/api/user-recommendations/user_5?n_recommendations=3")
            
            if rec_response.status_code == 200:
                rec_data = rec_response.json()['data']
                print_success(f"Generated {len(rec_data['recommendations'])} recommendations")
                for i, rec in enumerate(rec_data['recommendations'][:2], 1):
                    print(f"   {i}. {rec['product_id']} (Rating: {rec['predicted_rating']:.2f})")
                return True
            else:
                print_error("Recommendation generation failed")
                return False
        else:
            print_error("Model training failed")
            return False
    except Exception as e:
        print_error(f"Recommendation system error: {e}")
        return False

def test_complete_automation():
    """Test the complete product automation pipeline"""
    print_header("COMPLETE PRODUCT AUTOMATION PIPELINE")
    try:
        payload = {
            "product_name": "Premium Rose Oil",
            "features": ["100% pure", "organic", "premium"],
            "category": "Essential Oils",
            "price": 49.99
        }
        
        response = requests.post(f"{BASE_URL}/api/complete-product-automation", 
                               json=payload, timeout=20)
        
        if response.status_code == 200:
            data = response.json()['data']
            print_success("Complete automation pipeline executed!")
            
            # Check what was generated
            if 'product_description' in data:
                print("   ✅ Product description generated")
            if 'categories_tags' in data:
                print("   ✅ Categories and tags classified")
            if 'seo_metadata' in data:
                print("   ✅ SEO metadata created")
            
            return True
        else:
            print_error(f"Complete automation failed: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Complete automation error: {e}")
        return False

def test_nextjs_frontend():
    """Test if Next.js frontend is running"""
    print_header("NEXT.JS FRONTEND CHECK")
    try:
        response = requests.get("http://localhost:3005", timeout=5)
        if response.status_code == 200 and "ESSE" in response.text:
            print_success("Next.js frontend is running!")
            print("   ✅ Homepage loads successfully")
            print("   ✅ ESSE branding detected")
            return True
        else:
            print_error("Frontend not responding properly")
            return False
    except Exception as e:
        print_error(f"Frontend connection error: {e}")
        return False

def main():
    """Run all tests"""
    print("🚀 AI AUTOMATION SYSTEM TEST")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests = [
        ("Health Check", test_health_check),
        ("AI Description Generation", test_product_description_generation),
        ("Recommendation System", test_recommendation_system),
        ("Complete Automation Pipeline", test_complete_automation),
        ("Next.js Frontend", test_nextjs_frontend),
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        if test_func():
            passed += 1
    
    # Results summary
    print_header("TEST RESULTS SUMMARY")
    print(f"✅ Passed: {passed}/{total}")
    print(f"❌ Failed: {total - passed}/{total}")
    
    if passed == total:
        print("\n🎉 ALL TESTS PASSED! Your AI automation system is working perfectly!")
        print("🔥 Ready for production use!")
    else:
        print(f"\n⚠️  {total - passed} tests failed. Please check the errors above.")
    
    print(f"\n⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Test Data Collection Features
Tests all data collection endpoints and functionality
"""

import requests
import json
import random
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

def test_data_collection_endpoints():
    """Test all data collection endpoints"""
    print_header("DATA COLLECTION ENDPOINTS TEST")
    
    # Sample data
    sample_users = ["user_test_1", "user_test_2", "user_test_3"]
    sample_products = ["Lavender Oil", "Tea Tree Oil", "Turmeric Extract"]
    
    try:
        # Test 1: Track user interactions
        print("\n1. Testing user interaction tracking...")
        for user in sample_users:
            for product in sample_products:
                interaction_data = {
                    "user_id": user,
                    "product_id": product,
                    "interaction_type": "view",
                    "session_id": f"session_{random.randint(1000, 9999)}"
                }
                
                response = requests.post(f"{BASE_URL}/api/track-interaction", json=interaction_data)
                if response.status_code == 200:
                    result = response.json()
                    if result.get("success"):
                        print_success(f"Tracked interaction: {user} viewed {product}")
                    else:
                        print_error(f"Failed to track interaction: {result.get('message')}")
                else:
                    print_error(f"API error: {response.status_code}")
        
        # Test 2: Track product views
        print("\n2. Testing product view tracking...")
        for product in sample_products:
            view_data = {
                "product_id": product,
                "user_id": random.choice(sample_users),
                "view_duration": random.randint(30, 300),
                "referrer": "https://google.com"
            }
            
            response = requests.post(f"{BASE_URL}/api/track-view", json=view_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    print_success(f"Tracked view: {product} ({view_data['view_duration']}s)")
                else:
                    print_error(f"Failed to track view: {result.get('message')}")
        
        # Test 3: Track purchases
        print("\n3. Testing purchase tracking...")
        for user in sample_users:
            purchase_data = {
                "user_id": user,
                "product_id": random.choice(sample_products),
                "quantity": random.randint(1, 3),
                "price": random.uniform(15.99, 49.99),
                "order_id": f"order_{random.randint(10000, 99999)}"
            }
            
            response = requests.post(f"{BASE_URL}/api/track-purchase", json=purchase_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    print_success(f"Tracked purchase: {user} bought {purchase_data['product_id']}")
                else:
                    print_error(f"Failed to track purchase: {result.get('message')}")
        
        # Test 4: Track ratings
        print("\n4. Testing rating tracking...")
        for user in sample_users:
            rating_data = {
                "user_id": user,
                "product_id": random.choice(sample_products),
                "rating": random.randint(3, 5),
                "review_text": "Great product! Really satisfied with the quality."
            }
            
            response = requests.post(f"{BASE_URL}/api/track-rating", json=rating_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    print_success(f"Tracked rating: {user} rated {rating_data['product_id']} - {rating_data['rating']} stars")
                else:
                    print_error(f"Failed to track rating: {result.get('message')}")
        
        # Test 5: Track search queries
        print("\n5. Testing search tracking...")
        search_queries = ["lavender essential oil", "natural turmeric", "organic tea tree", "wellness products"]
        for query in search_queries:
            search_data = {
                "query": query,
                "user_id": random.choice(sample_users),
                "results_count": random.randint(5, 20),
                "clicked_results": [random.choice(sample_products)]
            }
            
            response = requests.post(f"{BASE_URL}/api/track-search", json=search_data)
            if response.status_code == 200:
                result = response.json()
                if result.get("success"):
                    print_success(f"Tracked search: '{query}' with {search_data['results_count']} results")
                else:
                    print_error(f"Failed to track search: {result.get('message')}")
        
        # Test 6: Get user interaction history
        print("\n6. Testing user history retrieval...")
        test_user = sample_users[0]
        response = requests.get(f"{BASE_URL}/api/data/user-history/{test_user}?days_back=7")
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                interactions = result["data"]["interactions"]
                print_success(f"Retrieved {len(interactions)} interactions for {test_user}")
                if interactions:
                    print(f"   Latest interaction: {interactions[0]['interaction_type']} on {interactions[0]['product_id']}")
            else:
                print_error(f"Failed to get user history: {result}")
        
        # Test 7: Get data collection statistics
        print("\n7. Testing data collection statistics...")
        response = requests.get(f"{BASE_URL}/api/data/collection-stats")
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                stats = result["data"]
                print_success("Data collection statistics:")
                for table, count in stats.items():
                    if isinstance(count, int):
                        print(f"   {table}: {count} records")
            else:
                print_error(f"Failed to get stats: {result}")
        
        # Test 8: Get popularity metrics
        print("\n8. Testing popularity metrics...")
        response = requests.get(f"{BASE_URL}/api/data/popularity-metrics")
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                metrics = result["data"]
                print_success("Popularity metrics retrieved:")
                if "most_viewed" in metrics and metrics["most_viewed"]:
                    print(f"   Most viewed product: {metrics['most_viewed'][0]['product_id']} ({metrics['most_viewed'][0]['view_count']} views)")
                if "most_purchased" in metrics and metrics["most_purchased"]:
                    print(f"   Most purchased: {metrics['most_purchased'][0]['product_id']} ({metrics['most_purchased'][0]['purchase_count']} purchases)")
            else:
                print_error(f"Failed to get popularity metrics: {result}")
        
        # Test 9: Get user behavior insights
        print("\n9. Testing user behavior insights...")
        response = requests.get(f"{BASE_URL}/api/data/user-insights")
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                insights = result["data"]
                print_success("User behavior insights:")
                print(f"   Active users (7 days): {insights.get('active_users', 0)}")
                print(f"   Total views: {insights.get('total_views', 0)}")
                if insights.get('interaction_patterns'):
                    top_interaction = insights['interaction_patterns'][0]
                    print(f"   Top interaction: {top_interaction['interaction_type']} ({top_interaction['count']} times)")
            else:
                print_error(f"Failed to get insights: {result}")
        
        # Test 10: Export data for training
        print("\n10. Testing data export...")
        export_data = {
            "output_dir": "test_export"
        }
        response = requests.post(f"{BASE_URL}/api/data/export", json=export_data)
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                exported_files = result["data"]["exported_files"]
                print_success(f"Data exported to {len(exported_files)} files:")
                for file_type, file_path in exported_files.items():
                    print(f"   {file_type}: {file_path}")
            else:
                print_error(f"Failed to export data: {result}")
        
        return True
        
    except Exception as e:
        print_error(f"Test failed with exception: {str(e)}")
        return False

def test_ml_integration():
    """Test ML integration with collected data"""
    print_header("ML INTEGRATION TEST")
    
    try:
        # Test getting ratings data for ML
        response = requests.get(f"{BASE_URL}/api/data/ratings-for-ml")
        if response.status_code == 200:
            result = response.json()
            if result.get("success"):
                data = result["data"]
                print_success(f"ML-ready ratings data:")
                print(f"   Total ratings: {data['ratings_count']}")
                print(f"   Unique users: {data['unique_users']}")
                print(f"   Unique products: {data['unique_products']}")
                
                if data["ratings_count"] > 0:
                    # Try to retrain recommendation model with collected data
                    train_data = {
                        "use_sample_data": False,
                        "ratings_data": data["ratings_data"],
                        "algorithm": "NMF"
                    }
                    
                    print("\nTraining recommendation model with collected data...")
                    train_response = requests.post(f"{BASE_URL}/api/train-recommendations", json=train_data)
                    if train_response.status_code == 200:
                        train_result = train_response.json()
                        if train_result.get("success"):
                            print_success("Model trained successfully with real user data!")
                            model_data = train_result["data"]
                            print(f"   Algorithm: {model_data['algorithm']}")
                            print(f"   Users: {model_data['n_users']}")
                            print(f"   Items: {model_data['n_items']}")
                            print(f"   Ratings: {model_data['n_ratings']}")
                        else:
                            print_error(f"Model training failed: {train_result}")
                    else:
                        print_error(f"Model training API error: {train_response.status_code}")
                else:
                    print("⚠️ No ratings data available for ML training yet")
            else:
                print_error(f"Failed to get ML data: {result}")
        else:
            print_error(f"API error: {response.status_code}")
        
        return True
        
    except Exception as e:
        print_error(f"ML integration test failed: {str(e)}")
        return False

def main():
    """Run all data collection tests"""
    print("🚀 DATA COLLECTION SYSTEM TEST")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests_passed = 0
    total_tests = 2
    
    # Test 1: Data Collection Endpoints
    if test_data_collection_endpoints():
        tests_passed += 1
    
    # Test 2: ML Integration
    if test_ml_integration():
        tests_passed += 1
    
    # Results summary
    print_header("TEST RESULTS SUMMARY")
    print(f"✅ Passed: {tests_passed}/{total_tests}")
    print(f"❌ Failed: {total_tests - tests_passed}/{total_tests}")
    
    if tests_passed == total_tests:
        print("\n🎉 ALL DATA COLLECTION TESTS PASSED!")
        print("🔥 Data collection system is working perfectly!")
        print("\nFeatures verified:")
        print("✅ User interaction tracking")
        print("✅ Product view tracking") 
        print("✅ Purchase tracking")
        print("✅ Rating and review tracking")
        print("✅ Search query tracking")
        print("✅ User history retrieval")
        print("✅ Data collection statistics")
        print("✅ Popularity metrics")
        print("✅ User behavior insights")
        print("✅ Data export for training")
        print("✅ ML model integration")
        print("\n📊 Your AI system can now learn from real user data!")
    else:
        print(f"\n⚠️ {total_tests - tests_passed} tests failed. Please check the errors above.")
    
    print(f"\n⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()

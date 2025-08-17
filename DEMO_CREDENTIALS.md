# 🔐 Demo Credentials for Testing Authentication

## Test Login Credentials

Use these credentials to test the authentication system:

### 🔐 Admin Accounts (Full Access)
**Primary Admin:**
- **Email**: `admin@esse.com`
- **Password**: `admin123`
- **Role**: Admin (Full Dashboard Access)

**Secondary Admin:**
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Admin

**Super Admin:**
- **Email**: `superadmin@esse.com`
- **Password**: `super123`
- **Role**: Admin

### 👤 Customer Accounts
**Demo User:**
- **Email**: `demo@example.com`
- **Password**: `demo123`
- **Role**: Customer

**Test User:**
- **Email**: `test@example.com`
- **Password**: `test123`
- **Role**: Customer

### How to Test:
1. Go to `/auth` page
2. Click "Login" tab
3. Enter the demo email and password above
4. Click "Sign In"
5. You should be redirected to your account dashboard

## For User Registration:
You can also create new accounts by:
1. Clicking "Sign Up" tab
2. Filling in the registration form with:
   - Full Name
   - Email address
   - Mobile number (10-digit Indian number)
   - Password (minimum 6 characters)
3. Confirming password
4. Account will be created and automatically logged in

## Notes:
- The demo system works with or without MongoDB connection
- If MongoDB is not available, it uses fallback authentication
- User sessions are maintained securely with JWT tokens
- All passwords are properly hashed with BCrypt

## Features Working:
✅ Email/Password Authentication
✅ User Registration
✅ Session Management
✅ Account Dashboard
✅ Secure Logout
✅ Database Fallback

Happy Testing! 🎉

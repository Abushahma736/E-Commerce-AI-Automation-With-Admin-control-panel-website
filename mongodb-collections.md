# MongoDB Collections Used in the Project

Based on the search results, here are all the MongoDB collections currently in use in the project:

## Core Collections

### 1. **users** 
- Used for storing user authentication data
- Contains fields: email, password, passwordHash, name, role, _id
- Used in: authentication routes, user management

### 2. **sessions**
- Used for storing user session data
- Contains fields: token, userId, user object, createdAt, expiresAt
- Used in: authentication system for session management

### 3. **products**
- Used for storing product information
- Contains fields: id, title, price, onSale, category, image, images, popularity, createdAt, _id
- Used in: product management, catalog display

### 4. **categories**
- Used for storing product categories
- Contains fields: slug, name, description, image, isActive, productCount, createdAt, updatedAt, _id
- Used in: category management, product organization

## Collection Usage Summary

- **Authentication System**: users, sessions
- **E-commerce**: products, categories
- **Total Collections**: 4 main collections

## Notes

- All collections include MongoDB's default `_id` field
- The application has fallback mechanisms to local file storage when MongoDB is not available
- Collections follow standard MongoDB document structure with additional application-specific fields
- User roles are stored in the users collection (admin/customer)
- Session management is handled through the sessions collection with expiration times

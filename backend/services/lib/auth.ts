import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import bcrypt from "bcryptjs"
import { getDb } from "./mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 Authorization attempt:', {
          email: credentials?.email,
          hasPassword: !!credentials?.password
        })

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials')
          throw new Error('Email and password are required')
        }

        try {
          const db = await getDb()
          if (!db) {
            // Fallback to hardcoded users if MongoDB is not available
            console.log('⚠️ MongoDB not available, using fallback users')
            const fallbackUsers = [
              { id: "1", email: "demo@example.com", password: "demo123", name: "Demo User", role: "customer" },
              { id: "2", email: "test@example.com", password: "test123", name: "Test User", role: "customer" },
              { id: "3", email: "user@example.com", password: "user123", name: "Sample User", role: "customer" },
              { id: "4", email: "customer@esse.com", password: "customer123", name: "ESSE Customer", role: "customer" },
              { id: "5", email: "admin@hack.com", password: "admin123", name: "Admin User", role: "admin" },
              { id: "6", email: "admin@example.com", password: "admin123", name: "Admin", role: "admin" },
              { id: "7", email: "admin@esse.com", password: "admin123", name: "ESSE Admin", role: "admin" },
              { id: "8", email: "superadmin@esse.com", password: "super123", name: "Super Admin", role: "admin" }
            ]
            
            const user = fallbackUsers.find(u => 
              u.email.toLowerCase() === credentials.email.toLowerCase() && 
              u.password === credentials.password
            )
            
            if (user) {
              console.log('✅ Fallback user authenticated:', user.email)
              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role || 'customer',
              }
            }
            console.log('❌ Invalid fallback credentials')
            return null
          }

          // Try to find user in MongoDB
          const usersCollection = db.collection('users')
          const user = await usersCollection.findOne({ 
            email: credentials.email.toLowerCase() 
          })

          if (!user) {
            console.log('❌ User not found in database')
            return null
          }

          // Check password - handle both password and passwordHash fields
          let isValidPassword = false
          const storedPassword = user.password || user.passwordHash
          
          if (storedPassword) {
            // Check if password is hashed (bcrypt format starts with $2)
            if (storedPassword.startsWith('$2')) {
              // Hashed password
              isValidPassword = await bcrypt.compare(credentials.password, storedPassword)
              console.log('🔐 Checking hashed password for:', user.email, 'Valid:', isValidPassword)
            } else {
              // Plain text password (for testing/demo)
              isValidPassword = storedPassword === credentials.password
              console.log('🔐 Checking plain text password for:', user.email, 'Valid:', isValidPassword)
            }
          } else {
            console.log('❌ No password found for user:', user.email)
          }

          if (!isValidPassword) {
            console.log('❌ Invalid password')
            return null
          }

          console.log('✅ User authenticated from MongoDB:', user.email)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || user.email.split('@')[0],
            role: user.role || 'customer',
          }

        } catch (error) {
          console.error('❌ Authentication error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('🎯 JWT callback:', { hasUser: !!user, tokenId: token.id })
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.role = user.role || 'customer'
      }
      return token
    },
    async session({ session, token }) {
      console.log('🎯 Session callback:', { 
        hasToken: !!token, 
        hasUser: !!session.user,
        tokenRole: token.role,
        tokenEmail: token.email
      })
      
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.role = token.role as string || 'customer'
        
        console.log('🎯 Session user role set to:', session.user.role)
      }
      return session
    },
    async signIn({ user }) {
      console.log('🎯 SignIn callback:', user?.email)
      return !!user
    },
    async redirect({ url, baseUrl }) {
      console.log('🎯 Redirect callback:', { url, baseUrl })
      
      // Always redirect to home page for simplicity
      if (!url) {
        return '/'
      }
      
      // Handle different URL formats safely
      try {
        // If it's already a relative URL starting with "/", use it directly
        if (typeof url === 'string' && url.startsWith('/') && !url.includes('://')) {
          // Special case: redirect account page to home
          if (url === '/account' || url.endsWith('/account')) {
            return '/'
          }
          return url
        }
        
        // If it's an absolute URL, parse it and extract the path
        if (typeof url === 'string' && url.includes('://')) {
          const urlObj = new URL(url)
          // Only allow same origin redirects
          if (urlObj.origin === baseUrl) {
            // Special case: redirect account page to home
            if (urlObj.pathname === '/account') {
              return '/'
            }
            return urlObj.pathname + urlObj.search + urlObj.hash
          }
        }
        
        // Default to home page
        return '/'
      } catch (error) {
        console.error('🎯 Redirect URL parsing error:', error)
        // On any error, redirect to home page
        return '/'
      }
    }
  },
  pages: {
    signIn: '/auth',
    error: '/auth'
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

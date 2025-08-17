import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      mobile?: string
      username?: string
      loginMethod?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    mobile?: string
    username?: string
    loginMethod?: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string
    mobile?: string
    username?: string
    loginMethod?: string
    role?: string
  }
}

// Basic type definitions
export interface Product {
  id: number
  name: string
  price: number
  description?: string
  category?: string
  category_id?: string
  stock_quantity: number
  image?: string
  slug?: string
}

export interface User {
  id: string
  name: string
  email: string
  role?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  image?: string
  type?: 'B2B' | 'B2C'
}

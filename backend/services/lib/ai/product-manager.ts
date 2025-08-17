import { deepSeekAPI } from './deepseek'
import { Product } from '@/types'

export interface ProductEnhancement {
  id: string
  productId: string
  enhancementType: 'description' | 'seo' | 'images' | 'keywords'
  originalData: any
  enhancedData: any
  aiConfidence: number
  createdAt: Date
  isApproved: boolean
  isApplied: boolean
}

export interface SEOEnhancement {
  title: string
  metaDescription: string
  h1Heading: string
  productFeatures: string
  faqSection: string
  schemaMarkup: string
  keywords: string[]
}

export interface ProductDescription {
  title: string
  metaDescription: string
  description: string
  benefits: string[]
  usage: string
  keywords: string[]
}

export interface ImageEnhancement {
  originalUrl: string
  enhancedUrl: string
  optimizations: string[]
  tags: string[]
  altText: string
  compressionRatio: number
}

export class AIProductManager {
  private static instance: AIProductManager
  private enhancements: Map<string, ProductEnhancement[]> = new Map()
  private processingQueue: Set<string> = new Set()

  static getInstance(): AIProductManager {
    if (!AIProductManager.instance) {
      AIProductManager.instance = new AIProductManager()
    }
    return AIProductManager.instance
  }

  // Generate enhanced product description using AI
  async generateProductDescription(product: Product): Promise<ProductDescription | null> {
    try {
      if (this.processingQueue.has(product.id.toString())) {
        return null // Already processing
      }

      this.processingQueue.add(product.id.toString())

      const enhanced = await deepSeekAPI.generateProductDescription(product)
      
      if (enhanced) {
        const enhancement: ProductEnhancement = {
          id: `desc_${product.id}_${Date.now()}`,
          productId: product.id.toString(),
          enhancementType: 'description',
          originalData: {
            name: product.name,
            description: product.description,
          },
          enhancedData: enhanced,
          aiConfidence: 0.85,
          createdAt: new Date(),
          isApproved: false,
          isApplied: false
        }

        this.addEnhancement(product.id.toString(), enhancement)
        return enhanced
      }

      return null
    } catch (error) {
      console.error('Product description generation failed:', error)
      return null
    } finally {
      this.processingQueue.delete(product.id.toString())
    }
  }

  // Generate SEO-optimized content
  async generateSEOContent(product: Product, targetKeywords: string[] = []): Promise<SEOEnhancement | null> {
    try {
      const keywords = targetKeywords.length > 0 ? targetKeywords : 
        this.generateDefaultKeywords(product)

      const seoContent = await deepSeekAPI.generateSEOContent(product, keywords)

      if (seoContent) {
        const enhancement: ProductEnhancement = {
          id: `seo_${product.id}_${Date.now()}`,
          productId: product.id.toString(),
          enhancementType: 'seo',
          originalData: {
            name: product.name,
            description: product.description,
          },
          enhancedData: seoContent,
          aiConfidence: 0.80,
          createdAt: new Date(),
          isApproved: false,
          isApplied: false
        }

        this.addEnhancement(product.id.toString(), enhancement)
        return seoContent
      }

      return null
    } catch (error) {
      console.error('SEO content generation failed:', error)
      return null
    }
  }

  // Bulk enhance multiple products
  async bulkEnhanceProducts(products: Product[], enhancementTypes: string[] = ['description']): Promise<any> {
    const results = {
      success: [],
      failed: [],
      total: products.length
    }

    for (const product of products) {
      try {
        const enhancements = []

        if (enhancementTypes.includes('description')) {
          const desc = await this.generateProductDescription(product)
          if (desc) {
            enhancements.push({ type: 'description', data: desc })
          }
        }

        if (enhancementTypes.includes('seo')) {
          const seo = await this.generateSEOContent(product)
          if (seo) {
            enhancements.push({ type: 'seo', data: seo })
          }
        }

        if (enhancementTypes.includes('keywords')) {
          const keywords = await this.generateKeywords(product)
          if (keywords) {
            enhancements.push({ type: 'keywords', data: keywords })
          }
        }

        results.success.push({
          productId: product.id,
          productName: product.name,
          enhancements
        })

        // Add small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000))

      } catch (error) {
        results.failed.push({
          productId: product.id,
          productName: product.name,
          error: error.message
        })
      }
    }

    return results
  }

  // Generate relevant keywords for a product
  async generateKeywords(product: Product): Promise<string[] | null> {
    try {
      const messages = [
        {
          role: "system",
          content: "You are an SEO keyword expert specializing in natural wellness and e-commerce products. Generate relevant, high-traffic keywords."
        },
        {
          role: "user", 
          content: `Generate SEO keywords for: ${product.name}
          
          Category: ${product.category || 'Natural Wellness'}
          Description: ${product.description || 'No description'}
          Price: ₹${product.price}
          
          Provide 15-20 relevant keywords including:
          - Primary keywords (high volume, competitive)
          - Long-tail keywords (specific, less competitive)  
          - Local keywords (India-specific)
          - Intent-based keywords (buy, best, benefits, etc.)
          
          Return as a simple array of keywords, no explanations.`
        }
      ]

      const response = await deepSeekAPI.chat(messages, { temperature: 0.5, max_tokens: 500 })
      
      try {
        const keywords = JSON.parse(response)
        return Array.isArray(keywords) ? keywords : keywords.keywords || []
      } catch {
        // If not JSON, try to extract keywords from text
        return response.split(',').map((k: string) => k.trim()).filter((k: string) => k.length > 2)
      }
    } catch (error) {
      console.error('Keyword generation failed:', error)
      return null
    }
  }

  // Generate default keywords based on product data
  private generateDefaultKeywords(product: Product): string[] {
    const keywords = []
    
    // Base product name keywords
    const nameWords = product.name.toLowerCase().split(' ')
    keywords.push(...nameWords.filter(word => word.length > 3))
    
    // Category-based keywords
    if (product.category) {
      keywords.push(product.category.toLowerCase())
    }
    
    // Common e-commerce keywords
    keywords.push('natural', 'organic', 'wellness', 'health', 'buy online', 'india')
    
    // Brand/company keywords
    keywords.push('esse naturals', 'natural products')
    
    return [...new Set(keywords)] // Remove duplicates
  }

  // Simulate image enhancement (placeholder for future implementation)
  async enhanceProductImages(product: Product): Promise<ImageEnhancement[]> {
    // This would integrate with image processing APIs in a real implementation
    const imageUrl = product.image || '/images/default-product.jpg'
    
    const enhancement: ImageEnhancement = {
      originalUrl: imageUrl,
      enhancedUrl: imageUrl, // Would be different in real implementation
      optimizations: [
        'Background removed',
        'Size optimized for web',
        'Brightness/contrast adjusted',
        'Compressed for faster loading'
      ],
      tags: [
        product.name.toLowerCase(),
        'natural product',
        'wellness',
        'organic'
      ],
      altText: `${product.name} - Natural wellness product by ESSE Naturals`,
      compressionRatio: 0.15 // 85% compression
    }

    const productEnhancement: ProductEnhancement = {
      id: `img_${product.id}_${Date.now()}`,
      productId: product.id.toString(),
      enhancementType: 'images',
      originalData: { image: product.image },
      enhancedData: [enhancement],
      aiConfidence: 0.75,
      createdAt: new Date(),
      isApproved: false,
      isApplied: false
    }

    this.addEnhancement(product.id.toString(), productEnhancement)
    return [enhancement]
  }

  // Add enhancement to storage
  private addEnhancement(productId: string, enhancement: ProductEnhancement) {
    const productEnhancements = this.enhancements.get(productId) || []
    productEnhancements.push(enhancement)
    this.enhancements.set(productId, productEnhancements)
  }

  // Get all enhancements for a product
  getProductEnhancements(productId: string): ProductEnhancement[] {
    return this.enhancements.get(productId) || []
  }

  // Get pending enhancements (not approved/applied)
  getPendingEnhancements(): ProductEnhancement[] {
    const pending: ProductEnhancement[] = []
    
    this.enhancements.forEach(productEnhancements => {
      const productPending = productEnhancements.filter(e => !e.isApproved)
      pending.push(...productPending)
    })
    
    return pending.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  // Approve an enhancement
  approveEnhancement(enhancementId: string) {
    this.enhancements.forEach(productEnhancements => {
      const enhancement = productEnhancements.find(e => e.id === enhancementId)
      if (enhancement) {
        enhancement.isApproved = true
      }
    })
  }

  // Apply an approved enhancement
  applyEnhancement(enhancementId: string) {
    this.enhancements.forEach(productEnhancements => {
      const enhancement = productEnhancements.find(e => e.id === enhancementId)
      if (enhancement && enhancement.isApproved) {
        enhancement.isApplied = true
      }
    })
  }

  // Get enhancement statistics
  getEnhancementStats() {
    const allEnhancements: ProductEnhancement[] = []
    this.enhancements.forEach(productEnhancements => {
      allEnhancements.push(...productEnhancements)
    })

    return {
      total: allEnhancements.length,
      pending: allEnhancements.filter(e => !e.isApproved).length,
      approved: allEnhancements.filter(e => e.isApproved && !e.isApplied).length,
      applied: allEnhancements.filter(e => e.isApplied).length,
      byType: {
        description: allEnhancements.filter(e => e.enhancementType === 'description').length,
        seo: allEnhancements.filter(e => e.enhancementType === 'seo').length,
        images: allEnhancements.filter(e => e.enhancementType === 'images').length,
        keywords: allEnhancements.filter(e => e.enhancementType === 'keywords').length,
      },
      avgConfidence: allEnhancements.reduce((sum, e) => sum + e.aiConfidence, 0) / allEnhancements.length || 0
    }
  }

  // Generate content optimization report
  generateOptimizationReport(products: Product[]) {
    const report = {
      summary: {
        totalProducts: products.length,
        needsDescription: 0,
        needsSEO: 0,
        needsImages: 0,
        wellOptimized: 0
      },
      recommendations: [],
      priorities: []
    }

    products.forEach(product => {
      let score = 0
      let issues = []
      let recommendations = []

      // Check description quality
      if (!product.description || product.description.length < 100) {
        issues.push('Short or missing description')
        recommendations.push('Generate AI-powered product description')
        report.summary.needsDescription++
      } else {
        score += 25
      }

      // Check title/name optimization
      if (!product.name || product.name.length < 20 || product.name.length > 60) {
        issues.push('Title needs SEO optimization')
        recommendations.push('Optimize product title for SEO')
        report.summary.needsSEO++
      } else {
        score += 25
      }

      // Check image availability
      if (!product.image || product.image === '/images/default-product.jpg') {
        issues.push('Missing or default product image')
        recommendations.push('Add high-quality product images')
        report.summary.needsImages++
      } else {
        score += 25
      }

      // Check stock levels for content priority
      if (product.stock_quantity > 10) {
        score += 25
      }

      if (score >= 75) {
        report.summary.wellOptimized++
      }

      if (issues.length > 0) {
        report.recommendations.push({
          productId: product.id,
          productName: product.name,
          score,
          issues,
          recommendations,
          priority: score < 50 ? 'high' : score < 75 ? 'medium' : 'low'
        })
      }
    })

    // Sort by priority and score
    report.recommendations.sort((a, b) => {
      const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 }
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return a.score - b.score
    })

    // Get high-priority items
    report.priorities = report.recommendations.filter(r => r.priority === 'high').slice(0, 10)

    return report
  }

  // Clear all data (for testing/reset)
  clearAllData() {
    this.enhancements.clear()
    this.processingQueue.clear()
  }
}

// Singleton instance
export const aiProductManager = AIProductManager.getInstance()

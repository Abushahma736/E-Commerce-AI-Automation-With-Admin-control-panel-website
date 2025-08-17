"use client"
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Calendar, Clock, Tag, Share, BookOpen, User, ArrowRight } from 'lucide-react'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  category: string
  author: string
  authorBio: string
  authorImage: string
  readTime: string
  publishedAt: string
  tags: string[]
  featured: boolean
  status: string
}

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchArticle(params.id as string)
      fetchRelatedArticles()
    }
  }, [params.id])

  const fetchArticle = async (id: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/articles/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setArticle(data.article)
      } else {
        setError(data.error || 'Article not found')
      }
    } catch (err) {
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedArticles = async () => {
    try {
      const response = await fetch('/api/articles?limit=3&featured=true')
      const data = await response.json()
      
      if (response.ok) {
        setRelatedArticles(data.articles || [])
      }
    } catch (err) {
      console.error('Failed to load related articles:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleShare = async () => {
    if (navigator.share && article) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  // Convert markdown-style content to HTML (basic implementation)
  const formatContent = (content: string) => {
    return content
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-serif font-bold text-brand-navy mb-6 mt-8">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-serif font-bold text-brand-navy mb-4 mt-6">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-serif font-semibold text-brand-navy mb-3 mt-4">$1</h3>')
      .replace(/^\* (.*$)/gm, '<li class="mb-2">$1</li>')
      .replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-brand-navy">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed text-gray-700">')
      .replace(/^(?!<h|<li|<\/p>)(.*$)/gm, '<p class="mb-4 leading-relaxed text-gray-700">$1</p>')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-4 border-brand-green border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The article you\'re looking for doesn\'t exist.'}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Link href="/blog">
              <Button>View All Articles</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src={article.image} 
            alt={article.title} 
            fill 
            className="object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy via-brand-navy/80 to-brand-navy/60"></div>
        </div>
        
        <Container>
          <div className="relative max-w-4xl">
            {/* Back Button */}
            <div className="mb-6">
              <Button 
                variant="outline" 
                onClick={() => router.back()}
                className="border-white/30 text-white hover:bg-white/10"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Articles
              </Button>
            </div>

            {/* Category & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="px-4 py-2 bg-brand-green text-white text-sm font-medium rounded-full">
                {article.category}
              </span>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl">
              {article.excerpt}
            </p>

            {/* Author & Share */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{article.authorImage}</div>
                <div>
                  <h3 className="font-semibold text-lg">{article.author}</h3>
                  <p className="text-white/70 text-sm">{article.authorBio}</p>
                </div>
              </div>
              
              <Button 
                onClick={handleShare}
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Share className="mr-2 h-4 w-4" />
                Share Article
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Article Content */}
      <Container>
        <div className="py-16">
          <div className="max-w-4xl mx-auto">
            {/* Featured Image */}
            <div className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl">
              <Image 
                src={article.image} 
                alt={article.title} 
                fill 
                className="object-cover" 
              />
            </div>

            {/* Article Content */}
            <article className="prose prose-lg max-w-none">
              <div 
                className="article-content"
                dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
              />
            </article>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-brand-navy mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-3">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-brand-green/10 text-brand-green text-sm font-medium rounded-full hover:bg-brand-green/20 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gradient-to-r from-brand-green/5 to-brand-light/5 rounded-2xl border border-brand-green/10">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{article.authorImage}</div>
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-semibold text-brand-navy mb-2">
                    About {article.author}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {article.authorBio}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="py-16 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-4">
                Related Articles
              </h2>
              <p className="text-gray-600">
                Continue your wellness journey with these expert tips
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.filter(a => a.id !== article.id).slice(0, 3).map((relatedArticle) => (
                <article key={relatedArticle.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-slate-100">
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={relatedArticle.image} 
                      alt={relatedArticle.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-brand-green text-white text-xs font-medium rounded-full">
                        {relatedArticle.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{relatedArticle.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="font-serif text-lg font-semibold text-brand-navy mb-3 group-hover:text-brand-green transition-colors leading-tight">
                      {relatedArticle.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {relatedArticle.excerpt.substring(0, 100)}...
                    </p>
                    
                    <Link href={`/blog/${relatedArticle.id}`}>
                      <Button variant="outline" size="sm" className="group">
                        Read Article
                        <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog">
                <Button size="lg">
                  <BookOpen className="mr-2 h-5 w-5" />
                  View All Articles
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-3xl font-serif font-bold mb-4">
              Enjoyed This Article?
            </h3>
            <p className="text-xl text-white/90 mb-8">
              Subscribe to our newsletter for more wellness tips and natural health insights
            </p>
            
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-brand-light"
              />
              <Button className="bg-brand-green hover:bg-brand-green/90">
                Subscribe
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

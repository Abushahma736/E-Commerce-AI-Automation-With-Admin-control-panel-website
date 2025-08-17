import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    
    if (!db) {
      // Fallback articles if MongoDB is not available
      const fallbackArticles = [
        {
          id: "1",
          title: "10 Benefits of Turmeric for Daily Wellness",
          excerpt: "Discover how this golden spice can boost your immunity, reduce inflammation, and improve overall health.",
          content: `# 10 Benefits of Turmeric for Daily Wellness

Turmeric has been used for centuries as both a culinary spice and medicinal herb. This golden root contains curcumin, the active compound responsible for most of its health benefits.

## 1. Anti-inflammatory Properties
Turmeric contains curcumin, which has powerful anti-inflammatory effects that can help reduce chronic inflammation in the body.

## 2. Boosts Immunity
Regular consumption of turmeric can strengthen your immune system and help fight off infections.

## 3. Improves Digestion
Turmeric stimulates bile production, which helps break down fats and improves overall digestion.

## 4. Natural Pain Relief
The anti-inflammatory properties of turmeric make it an effective natural pain reliever.

## 5. Promotes Heart Health
Curcumin can improve the function of the endothelium, the lining of blood vessels.

## 6. Brain Health Benefits
Turmeric may increase brain-derived neurotrophic factor (BDNF), which promotes brain health.

## 7. Antioxidant Power
Turmeric is a powerful antioxidant that can neutralize free radicals and boost the body's antioxidant enzymes.

## 8. Skin Health
Applied topically or consumed, turmeric can help maintain healthy, glowing skin.

## 9. May Help Prevent Cancer
Some studies suggest that curcumin may help prevent and treat various types of cancer.

## 10. Natural Mood Booster
Turmeric may help boost levels of serotonin and dopamine, improving mood and reducing symptoms of depression.

## How to Include Turmeric in Your Daily Routine

- Add a pinch to your morning tea or golden milk
- Include in cooking curries and soups  
- Take as a supplement (consult your healthcare provider)
- Use in face masks for skin benefits

Remember to consume turmeric with black pepper to increase absorption!`,
          image: "/images/turmeric.jpg",
          category: "Natural Remedies",
          author: "Dr. Priya Sharma",
          authorBio: "Ayurvedic practitioner with 15+ years of experience",
          authorImage: "👩‍⚕️",
          readTime: "5 min read",
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          tags: ["turmeric", "immunity", "natural remedies", "anti-inflammatory"],
          featured: true,
          status: "published"
        },
        {
          id: "2", 
          title: "Essential Oils for Better Sleep & Relaxation",
          excerpt: "Learn which essential oils can help you achieve deeper, more restful sleep naturally.",
          content: `# Essential Oils for Better Sleep & Relaxation

Getting quality sleep is essential for overall health and wellbeing. Essential oils can be a natural and effective way to improve sleep quality and promote relaxation.

## Top Essential Oils for Sleep

### 1. Lavender Oil
Lavender is the most well-known sleep-promoting essential oil. Research shows it can:
- Reduce heart rate and blood pressure
- Increase deep sleep phases
- Improve overall sleep quality

### 2. Chamomile Oil
Roman chamomile has sedative properties that can:
- Calm the nervous system
- Reduce anxiety and stress
- Promote peaceful sleep

### 3. Bergamot Oil
This citrus oil has unique calming properties:
- Reduces cortisol levels
- Lowers blood pressure
- Creates a peaceful atmosphere

### 4. Sandalwood Oil
Known for its woody, calming scent:
- Promotes deep meditation
- Reduces mental chatter
- Enhances relaxation

### 5. Ylang Ylang Oil
This tropical flower oil:
- Reduces stress hormones
- Promotes emotional balance
- Creates a romantic, peaceful atmosphere

## How to Use Essential Oils for Sleep

### Diffusion
- Add 5-10 drops to an essential oil diffuser
- Run for 30-60 minutes before bedtime
- Turn off before sleeping

### Pillow Spray
- Mix 10 drops with 2 oz of water in a spray bottle
- Spray lightly on pillows and bedding
- Allow to dry before use

### Bath Ritual
- Add 5-8 drops to a warm bath
- Mix with carrier oil or Epsom salts
- Soak for 15-20 minutes before bed

### Topical Application
- Dilute with carrier oil (coconut, jojoba)
- Apply to pulse points, feet, or wrists
- Always do a patch test first

## Sleep Blend Recipe

**Peaceful Dreams Blend:**
- 4 drops Lavender
- 2 drops Chamomile
- 2 drops Bergamot
- 1 drop Sandalwood

Mix in diffuser or dilute in 1 oz carrier oil for topical use.

## Safety Tips

- Always dilute before topical application
- Avoid citrus oils if you'll be in sunlight
- Pregnant women should consult healthcare providers
- Keep oils away from children and pets
- Buy high-quality, pure essential oils

Sweet dreams! 🌙`,
          image: "/images/essential.jpg",
          category: "Essential Oils",
          author: "Sarah Johnson",
          authorBio: "Certified aromatherapist and wellness coach",
          authorImage: "🧘‍♀️",
          readTime: "4 min read",
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
          tags: ["essential oils", "sleep", "relaxation", "aromatherapy"],
          featured: true,
          status: "published"
        },
        {
          id: "3",
          title: "Complete Guide to Organic Skincare",
          excerpt: "Transform your skincare routine with natural, chemical-free products that nourish your skin.",
          content: `# Complete Guide to Organic Skincare

Your skin is your body's largest organ, and what you put on it matters. Organic skincare offers a natural, effective way to maintain healthy, glowing skin without harsh chemicals.

## Why Choose Organic Skincare?

### Benefits of Natural Ingredients
- No harmful chemicals or synthetic fragrances
- Gentle on sensitive skin
- Rich in vitamins and antioxidants
- Environmentally sustainable
- Often more cost-effective long-term

### Common Toxic Ingredients to Avoid
- Parabens (preservatives linked to hormone disruption)
- Sulfates (harsh detergents that strip natural oils)
- Phthalates (plasticizers that may disrupt hormones)
- Synthetic fragrances (can cause allergic reactions)
- Formaldehyde-releasing preservatives

## Essential Organic Ingredients

### 1. Aloe Vera
- Soothes inflammation and irritation
- Provides deep hydration
- Promotes healing of minor cuts and burns
- Suitable for all skin types

### 2. Jojoba Oil
- Mimics skin's natural sebum
- Non-comedogenic (won't clog pores)
- Rich in vitamin E and antioxidants
- Perfect for oil cleansing method

### 3. Rose Hip Oil
- High in vitamin C and vitamin A
- Promotes collagen production
- Reduces appearance of scars and fine lines
- Excellent for mature or damaged skin

### 4. Tea Tree Oil
- Natural antibacterial and antifungal
- Effective for acne-prone skin
- Reduces inflammation
- Always dilute before use

### 5. Honey
- Natural humectant (attracts moisture)
- Antibacterial properties
- Gentle exfoliation
- Suitable for sensitive skin

## Building Your Organic Skincare Routine

### Morning Routine
1. **Gentle Cleanser** - Remove overnight buildup
2. **Toner** - Balance pH and prep skin
3. **Serum** - Target specific concerns
4. **Moisturizer** - Hydrate and protect
5. **Sunscreen** - Essential UV protection

### Evening Routine
1. **Oil Cleanser** - Remove makeup and pollutants
2. **Gentle Cleanser** - Deep clean pores
3. **Exfoliate** - 2-3 times per week
4. **Treatment** - Serums or oils
5. **Night Moisturizer** - Rich, nourishing cream

## DIY Organic Skincare Recipes

### Honey Oat Face Mask
**Ingredients:**
- 2 tbsp raw honey
- 1 tbsp ground oats
- 1 tsp jojoba oil

**Instructions:**
1. Mix ingredients in a bowl
2. Apply to clean face
3. Leave for 15-20 minutes
4. Rinse with warm water

### Green Tea Toner
**Ingredients:**
- 1 cup green tea (cooled)
- 1 tbsp apple cider vinegar
- 5 drops tea tree oil

**Instructions:**
1. Brew strong green tea and let cool
2. Add vinegar and essential oil
3. Store in refrigerator for up to 1 week
4. Apply with cotton pad after cleansing

### Vitamin C Serum
**Ingredients:**
- 1 tbsp rose hip oil
- 1 tsp vitamin E oil
- 5 drops lavender essential oil

**Instructions:**
1. Mix oils in dark glass bottle
2. Apply 2-3 drops to face and neck
3. Use in evening routine
4. Store in cool, dark place

## Transitioning to Organic Skincare

### Start Slowly
- Replace one product at a time
- Patch test new ingredients
- Give your skin 4-6 weeks to adjust
- Keep a skincare diary

### Reading Labels
- Look for certified organic seals
- Check ingredient lists carefully
- Avoid "greenwashing" - natural-sounding but synthetic ingredients
- Choose products with minimal, recognizable ingredients

## Common Skin Concerns and Natural Solutions

### Acne
- Tea tree oil (diluted)
- Clay masks
- Gentle exfoliation with oats
- Jojoba oil for moisture

### Dry Skin
- Hyaluronic acid
- Coconut or argan oil
- Honey masks
- Gentle, cream-based cleansers

### Aging Skin
- Rose hip oil
- Vitamin C serums
- Retinol alternatives (bakuchiol)
- Regular exfoliation

### Sensitive Skin
- Chamomile
- Calendula
- Oat-based products
- Fragrance-free formulas

Remember: Consistency is key! Give your skin time to adjust to new products and routines. Natural skincare is a journey, not a destination. 🌿✨`,
          image: "/images/plant1.jpg",
          category: "Organic Living",
          author: "Dr. Meera Patel",
          authorBio: "Dermatologist specializing in natural skincare",
          authorImage: "👩‍⚕️",
          readTime: "6 min read",
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
          tags: ["skincare", "organic", "natural", "beauty"],
          featured: true,
          status: "published"
        }
      ]

      return NextResponse.json({ 
        articles: fallbackArticles,
        total: fallbackArticles.length,
        source: 'fallback'
      })
    }

    // Get articles from MongoDB
    const articlesCollection = db.collection('articles')
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const status = searchParams.get('status') || 'published'
    
    // Build query
    const query: any = { status }
    if (category) query.category = category
    if (featured === 'true') query.featured = true
    
    // Get articles with pagination
    const skip = (page - 1) * limit
    const articles = await articlesCollection
      .find(query)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()
    
    const total = await articlesCollection.countDocuments(query)
    
    // Convert MongoDB _id to string
    const formattedArticles = articles.map(article => ({
      ...article,
      id: article._id.toString(),
      _id: undefined
    }))
    
    return NextResponse.json({ 
      articles: formattedArticles,
      total,
      page,
      limit,
      source: 'mongodb'
    })

  } catch (error) {
    console.error('Articles API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 Creating new article...')
    
    const body = await request.json()
    console.log('📋 Article data received:', { 
      title: body.title, 
      category: body.category, 
      status: body.status 
    })
    
    const {
      title,
      excerpt,
      content,
      image,
      category,
      author,
      authorBio,
      authorImage,
      readTime,
      tags,
      featured = false,
      status = 'draft'
    } = body

    // Validate required fields
    if (!title || !content || !category) {
      console.log('❌ Validation failed: missing required fields')
      return NextResponse.json(
        { error: 'Title, content, and category are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Connecting to database...')
    const db = await getDb()
    if (!db) {
      console.log('❌ Database not available')
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    console.log('📊 Database connected, accessing articles collection')
    const articlesCollection = db.collection('articles')
    
    const newArticle = {
      title,
      excerpt: excerpt || content.substring(0, 200) + '...',
      content,
      image: image || '/images/hero.jpg',
      category,
      author: author || 'Admin',
      authorBio: authorBio || 'Content Administrator',
      authorImage: authorImage || '👤',
      readTime: readTime || '5 min read',
      publishedAt: status === 'published' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: Array.isArray(tags) ? tags : [],
      featured: Boolean(featured),
      status
      // Note: Don't include 'id' field - let MongoDB handle _id
    }

    console.log('💾 Inserting article into database...')
    const result = await articlesCollection.insertOne(newArticle)
    console.log('✅ Article created successfully with ID:', result.insertedId.toString())
    
    return NextResponse.json({
      success: true,
      id: result.insertedId.toString(),
      message: 'Article created successfully',
      article: {
        id: result.insertedId.toString(),
        title,
        category,
        status,
        createdAt: newArticle.createdAt
      }
    })

  } catch (error: any) {
    console.error('❌ Create article error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { 
        error: 'Failed to create article',
        details: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

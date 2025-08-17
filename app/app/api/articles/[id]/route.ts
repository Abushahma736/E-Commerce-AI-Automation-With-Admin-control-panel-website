import { NextRequest, NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const db = await getDb()
    
    if (!db) {
      // Fallback articles for demo
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
          publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
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

## How to Use Essential Oils for Sleep

### Diffusion
- Add 5-10 drops to an essential oil diffuser
- Run for 30-60 minutes before bedtime
- Turn off before sleeping

### Pillow Spray
- Mix 10 drops with 2 oz of water in a spray bottle
- Spray lightly on pillows and bedding
- Allow to dry before use

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
          publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
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

## Building Your Organic Skincare Routine

### Morning Routine
1. **Gentle Cleanser** - Remove overnight buildup
2. **Toner** - Balance pH and prep skin
3. **Serum** - Target specific concerns
4. **Moisturizer** - Hydrate and protect
5. **Sunscreen** - Essential UV protection

Remember: Consistency is key! Give your skin time to adjust to new products and routines. Natural skincare is a journey, not a destination. 🌿✨`,
          image: "/images/plant1.jpg",
          category: "Organic Living",
          author: "Dr. Meera Patel",
          authorBio: "Dermatologist specializing in natural skincare",
          authorImage: "👩‍⚕️",
          readTime: "6 min read",
          publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          tags: ["skincare", "organic", "natural", "beauty"],
          featured: true,
          status: "published"
        }
      ]
      
      const article = fallbackArticles.find(a => a.id === id)
      if (!article) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }
      
      return NextResponse.json({ article, source: 'fallback' })
    }

    const articlesCollection = db.collection('articles')
    
    // Try to find by ObjectId first, then by custom id
    let article
    try {
      if (ObjectId.isValid(id)) {
        article = await articlesCollection.findOne({ _id: new ObjectId(id) })
      }
      if (!article) {
        article = await articlesCollection.findOne({ id: id })
      }
    } catch (error) {
      // If ObjectId fails, try with string id
      article = await articlesCollection.findOne({ id: id })
    }
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    // Convert MongoDB _id to string
    const formattedArticle = {
      ...article,
      id: article._id ? article._id.toString() : article.id,
      _id: undefined
    }

    return NextResponse.json({ article: formattedArticle, source: 'mongodb' })

  } catch (error) {
    console.error('Get article error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    const db = await getDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const articlesCollection = db.collection('articles')
    
    const updateData = {
      ...body,
      updatedAt: new Date()
    }
    
    // If status is being changed to published, set publishedAt
    if (body.status === 'published' && body.status !== 'published') {
      updateData.publishedAt = new Date()
    }

    let result
    try {
      if (ObjectId.isValid(id)) {
        result = await articlesCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        )
      } else {
        result = await articlesCollection.updateOne(
          { id: id },
          { $set: updateData }
        )
      }
    } catch (error) {
      result = await articlesCollection.updateOne(
        { id: id },
        { $set: updateData }
      )
    }
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Article updated successfully'
    })

  } catch (error) {
    console.error('Update article error:', error)
    return NextResponse.json(
      { error: 'Failed to update article' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    const db = await getDb()
    if (!db) {
      return NextResponse.json(
        { error: 'Database not available' },
        { status: 503 }
      )
    }

    const articlesCollection = db.collection('articles')
    
    let result
    try {
      if (ObjectId.isValid(id)) {
        result = await articlesCollection.deleteOne({ _id: new ObjectId(id) })
      } else {
        result = await articlesCollection.deleteOne({ id: id })
      }
    } catch (error) {
      result = await articlesCollection.deleteOne({ id: id })
    }
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    })

  } catch (error) {
    console.error('Delete article error:', error)
    return NextResponse.json(
      { error: 'Failed to delete article' },
      { status: 500 }
    )
  }
}

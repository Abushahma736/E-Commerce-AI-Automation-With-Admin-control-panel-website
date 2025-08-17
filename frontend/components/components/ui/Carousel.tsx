"use client"
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export function Carousel({ images }: { images: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap())
    emblaApi.on('select', onSelect)
    const interval = setInterval(() => emblaApi.scrollNext(), 3500)
    return () => {
      emblaApi.off('select', onSelect)
      clearInterval(interval)
    }
  }, [emblaApi])

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg" ref={emblaRef}>
      <div className="flex">
        {images.map((src, idx) => (
          <div key={src} className="relative min-w-0 flex-[0_0_100%] h-64 sm:h-80 md:h-96 lg:h-[500px]">
            <Image 
              src={src} 
              alt={`Slide ${idx + 1}`} 
              fill 
              className="object-cover" 
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            />
            {/* Overlay for better text visibility if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          </div>
        ))}
      </div>
      
      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center gap-2">
        {images.map((_, i) => (
          <button 
            key={i} 
            aria-label={`Go to slide ${i + 1}`} 
            onClick={() => emblaApi?.scrollTo(i)} 
            className={`h-3 w-3 rounded-full transition-all duration-300 shadow-lg ${
              selected === i 
                ? 'bg-brand-green scale-110' 
                : 'bg-white/70 hover:bg-white/90'
            }`} 
          />
        ))}
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-300 opacity-0 hover:opacity-100 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}



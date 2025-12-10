'use client'

import { useState } from 'react'
import Image from 'next/image'
import Section from '@/components/ui/Section'
import { galleryImages } from '@/lib/content'
import { X } from 'lucide-react'

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'temple' | 'festivals' | 'devotees' | 'school'>(
    'all'
  )

  const filteredImages =
    filter === 'all'
      ? galleryImages
      : galleryImages.filter((img) => img.category === filter)

  return (
    <>
      <Section background="maroon" className="text-center">
        <h1 className="heading-1 text-white mb-4">Gallery</h1>
        <p className="text-xl text-gray-100 max-w-3xl mx-auto">
          Explore moments from our temple, festivals, and community events
        </p>
      </Section>

      <Section background="white">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {(['all', 'temple', 'festivals', 'devotees', 'school'] as const).map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === category
                ? 'bg-temple-maroon text-white'
                : 'bg-temple-off-white text-gray-700 hover:bg-temple-earth-tan'
                }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => setSelectedImage(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm p-3 bg-gradient-to-t from-black/60 to-transparent w-full">
                    {image.alt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No images found in this category.</p>
          </div>
        )}
      </Section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={() => setSelectedImage(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-5xl max-h-[80vh] w-full h-full">
            <Image
              src={selectedImage}
              alt="Gallery image"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </>
  )
}


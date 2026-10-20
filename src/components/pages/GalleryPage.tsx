import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronLeft, ChevronRight, MapPin, Tag, ZoomIn } from 'lucide-react';
import { getGalleryImages } from '../../services/storage';
import { GalleryImage } from '../../types/index';

interface GalleryPageProps {
  onNavigate: (page: string) => void;
  initialCategory?: string;
  externalActiveImage?: GalleryImage | null;
  onCloseExternalLightbox?: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({
  onNavigate,
  initialCategory = 'All',
  externalActiveImage,
  onCloseExternalLightbox,
}) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    setImages(getGalleryImages());
  }, []);

  useEffect(() => {
    if (externalActiveImage) {
      const idx = images.findIndex((img) => img.id === externalActiveImage.id);
      if (idx !== -1) {
        setActiveImageIndex(idx);
      }
    }
  }, [externalActiveImage, images]);

  const categories = ['All', 'Weddings', 'Corporate', 'Galas', 'Private'];

  const filteredImages =
    selectedCategory === 'All'
      ? images
      : images.filter((img) => img.category.toLowerCase() === selectedCategory.toLowerCase());

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setActiveImageIndex(index);
  };

  const closeLightbox = () => {
    setActiveImageIndex(null);
    if (onCloseExternalLightbox) onCloseExternalLightbox();
  };

  const nextImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! + 1) % filteredImages.length);
  };

  const prevImage = () => {
    if (activeImageIndex === null) return;
    setActiveImageIndex((prev) => (prev! === 0 ? filteredImages.length - 1 : prev! - 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeImageIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, filteredImages.length]);

  const currentLightboxImg = activeImageIndex !== null ? filteredImages[activeImageIndex] : null;

  return (
    <div className="pt-24 pb-20 bg-[#FAF7F2] text-[#1C1B1A] min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
          Visual Symphony
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#1C1B1A]">
          The Haute Gallery
        </h1>
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-600 font-light">
          A curated archive of transcendent ceremonies, gala dinners, and private salon celebrations.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setActiveImageIndex(null);
              }}
              className={`px-5 py-2 rounded-full text-xs uppercase tracking-wider font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#1C1B1A] text-[#FAF7F2] shadow-md border border-[#C9A227]/40'
                  : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((img, index) => (
            <div
              key={img.id}
              onClick={() => openLightbox(index)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white border border-neutral-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="w-full aspect-[4/3] overflow-hidden relative bg-neutral-900">
                <img
                  src={img.url}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                />

                {/* Hover overlay with zoom hint */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <p className="text-xs text-neutral-200 line-clamp-2 font-light">
                    {img.caption}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[#C9A227] font-medium">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>View in Lightbox</span>
                  </div>
                </div>
              </div>

              {/* Card Footer with Details */}
              <div className="p-4 bg-white flex flex-col justify-between border-t border-neutral-100">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#A37F14] font-semibold mb-1">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3 text-[#C9A227]" />
                    {img.category}
                  </span>
                  <span className="flex items-center gap-1 text-neutral-500 font-normal">
                    <MapPin className="w-3 h-3 text-[#C9A227]" />
                    {img.location}
                  </span>
                </div>
                <h3 className="font-serif text-base font-medium text-neutral-900 line-clamp-1 group-hover:text-[#C9A227] transition-colors">
                  {img.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            <p>No gallery images found in this category.</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {currentLightboxImg && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Lightbox"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 focus:outline-none"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 focus:outline-none"
            aria-label="Next Image"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* Image Container with Caption */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl max-h-[90vh] flex flex-col items-center justify-center relative"
          >
            <div className="max-h-[75vh] overflow-hidden rounded-xl shadow-2xl border border-white/10">
              <img
                src={currentLightboxImg.url}
                alt={currentLightboxImg.title}
                className="max-h-[75vh] w-auto max-w-full object-contain"
              />
            </div>

            {/* Lightbox Details Bar */}
            <div className="mt-4 text-center text-white space-y-1 max-w-2xl px-4">
              <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-wider text-[#C9A227] font-medium">
                <span>{currentLightboxImg.category}</span>
                <span>•</span>
                <span>{currentLightboxImg.location}</span>
                <span>•</span>
                <span>
                  {activeImageIndex! + 1} of {filteredImages.length}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-light text-white">
                {currentLightboxImg.title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300 font-light">
                {currentLightboxImg.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

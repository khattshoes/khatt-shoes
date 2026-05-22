"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";

type ProductImage = {
  image_url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
};

type ProductGalleryProps = {
  images: ProductImage[];
  fallbackAlt: string;
};

export function ProductGallery({ images, fallbackAlt }: ProductGalleryProps) {
  const sortedImages = useMemo(() => {
    return [...images].sort((a, b) => {
      if (a.is_primary) return -1;
      if (b.is_primary) return 1;
      return a.sort_order - b.sort_order;
    });
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const activeImage = sortedImages[activeIndex];

  const goPrev = () => {
    setActiveIndex((current) =>
      current === 0 ? sortedImages.length - 1 : current - 1
    );
  };

  const goNext = () => {
    setActiveIndex((current) =>
      current === sortedImages.length - 1 ? 0 : current + 1
    );
  };

  if (!sortedImages.length) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/10 bg-[#151515]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(214,194,168,0.22),rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.72))]" />
        <div className="absolute inset-x-20 bottom-16 h-20 rounded-full bg-[#D6C2A8]/20 blur-xl" />
        <div className="absolute left-1/2 top-1/2 h-16 w-64 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-full border border-[#D6C2A8]/25 bg-black/25" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#111]">
          <img
            src={activeImage.image_url}
            alt={activeImage.alt_text || fallbackAlt}
            className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10 opacity-80" />

          {sortedImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur transition hover:bg-[#D6C2A8] hover:text-black"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur transition hover:bg-[#D6C2A8] hover:text-black"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setIsZoomOpen(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm text-white backdrop-blur transition hover:bg-[#D6C2A8] hover:text-black"
          >
            <Maximize2 size={16} />
            Zoom
          </button>

          <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs text-white/80 backdrop-blur">
            {activeIndex + 1} / {sortedImages.length}
          </div>
        </div>

        {sortedImages.length > 1 ? (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {sortedImages.map((image, index) => (
              <button
                key={`${image.image_url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`overflow-hidden rounded-2xl border bg-[#111] transition ${
                  activeIndex === index
                    ? "border-[#D6C2A8]"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <img
                  src={image.image_url}
                  alt={image.alt_text || fallbackAlt}
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {isZoomOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5">
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close zoom"
          >
            <X size={20} />
          </button>

          {sortedImages.length > 1 ? (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>

              <button
                type="button"
                onClick={goNext}
                className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          ) : null}

          <img
            src={activeImage.image_url}
            alt={activeImage.alt_text || fallbackAlt}
            className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain"
          />
        </div>
      ) : null}
    </>
  );
}
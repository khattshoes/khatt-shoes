"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
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

function isSafeImageSrc(src?: string | null) {
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("https://");
}

export function ProductGallery({ images, fallbackAlt }: ProductGalleryProps) {
  const sortedImages = useMemo(() => {
    return [...images]
      .filter((image) => isSafeImageSrc(image.image_url))
      .sort((a, b) => {
        if (a.is_primary) return -1;
        if (b.is_primary) return 1;
        return a.sort_order - b.sort_order;
      });
  }, [images]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const activeImage = sortedImages[activeIndex];

const goPrev = useCallback(() => {
  setActiveIndex((current) =>
    current === 0 ? sortedImages.length - 1 : current - 1
  );
}, [sortedImages.length]);

const goNext = useCallback(() => {
  setActiveIndex((current) =>
    current === sortedImages.length - 1 ? 0 : current + 1
  );
}, [sortedImages.length]);

  useEffect(() => {
    if (!isZoomOpen) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsZoomOpen(false);
      if (event.key === "ArrowLeft" && sortedImages.length > 1) goPrev();
      if (event.key === "ArrowRight" && sortedImages.length > 1) goNext();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isZoomOpen, sortedImages.length, goPrev, goNext]);

  if (!sortedImages.length || !activeImage) {
    return (
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#15130F] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(216,189,138,0.22),rgba(255,255,255,0.04)_40%,rgba(0,0,0,0.76))]" />
        <div className="absolute inset-x-20 bottom-16 h-20 rounded-full bg-[#D8BD8A]/20 blur-xl" />
        <div className="absolute left-1/2 top-1/2 h-16 w-64 -translate-x-1/2 -translate-y-1/2 -rotate-6 rounded-full border border-[#D8BD8A]/25 bg-black/25" />
        <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/52">
          KHATT
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="group relative overflow-hidden rounded-[2.3rem] border border-white/10 bg-[#11100D] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={activeImage.image_url}
              alt={activeImage.alt_text || fallbackAlt}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.035] group-hover:opacity-100"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-transparent to-black/14" />

            <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/38 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/62 backdrop-blur-md">
              KHATT
            </div>

            {sortedImages.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={goPrev}
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur transition hover:bg-[#D8BD8A] hover:text-black"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={20} />
                </button>

                <button
                  type="button"
                  onClick={goNext}
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white backdrop-blur transition hover:bg-[#D8BD8A] hover:text-black"
                  aria-label="Next image"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            ) : null}

            <div className="absolute bottom-4 left-4 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-xs text-white/78 backdrop-blur-md">
              {activeIndex + 1} / {sortedImages.length}
            </div>

            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-[#D8BD8A] hover:text-black"
            >
              <Maximize2 size={16} />
              Böyüt
            </button>
          </div>
        </div>

        {sortedImages.length > 1 ? (
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
            {sortedImages.map((image, index) => {
              const active = activeIndex === index;

              return (
                <button
                  key={`${image.image_url}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Select image ${index + 1}`}
                  className={
                    active
                      ? "relative overflow-hidden rounded-2xl border border-[#D8BD8A] bg-[#11100D] p-1 shadow-[0_0_0_1px_rgba(216,189,138,0.2)]"
                      : "relative overflow-hidden rounded-2xl border border-white/10 bg-[#11100D] p-1 transition hover:border-white/30"
                  }
                >
                  <div className="relative aspect-square overflow-hidden rounded-[0.85rem]">
                    <Image
                      src={image.image_url}
                      alt={image.alt_text || fallbackAlt}
                      fill
                      sizes="120px"
                      className={
                        active
                          ? "object-cover opacity-100"
                          : "object-cover opacity-62 transition hover:opacity-90"
                      }
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {isZoomOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/92 p-5 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
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

          <div className="relative h-[86vh] w-[92vw] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#11100D]">
            <Image
              src={activeImage.image_url}
              alt={activeImage.alt_text || fallbackAlt}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
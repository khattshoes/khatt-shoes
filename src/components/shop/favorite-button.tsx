"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  productId: string;
  label: string;
};

const FAVORITES_KEY = "khatt_favorites";

function getFavorites(): string[] {
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function FavoriteButton({ productId, label }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(getFavorites().includes(productId));
  }, [productId]);

  const toggleFavorite = () => {
    const favorites = getFavorites();

    const nextFavorites = favorites.includes(productId)
      ? favorites.filter((id) => id !== productId)
      : [...favorites, productId];

    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
    setIsFavorite(nextFavorites.includes(productId));
  };

  return (
    <button
      type="button"
      onClick={toggleFavorite}
      className={`flex items-center justify-center gap-2 rounded-full border px-6 py-4 text-sm font-medium transition ${
        isFavorite
          ? "border-[#D6C2A8] bg-[#D6C2A8] text-black"
          : "border-white/10 text-white/70 hover:border-[#D6C2A8]/50 hover:text-[#D6C2A8]"
      }`}
    >
      <Heart size={17} fill={isFavorite ? "currentColor" : "none"} />
      {label}
    </button>
  );
}
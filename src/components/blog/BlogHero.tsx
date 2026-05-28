'use client';
import Image from 'next/image';
import { useState } from 'react';

interface BlogHeroProps {
  heroSrc: string;
  heroAlt: string;
  gradient: string;
  emoji: string;
  category: string;
}

export default function BlogHero({ heroSrc, heroAlt, gradient, emoji, category }: BlogHeroProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = heroSrc && !imgFailed;

  return (
    <div className="mb-8 -mx-4 md:mx-0">
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden shadow-lg">
        {showImage ? (
          <Image
            src={heroSrc}
            alt={heroAlt}
            fill
            sizes="(max-width: 768px) 100vw, 864px"
            className="object-cover"
            priority
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div
            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <span
              className="text-7xl md:text-9xl select-none"
              role="img"
              aria-label={category}
            >
              {emoji}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

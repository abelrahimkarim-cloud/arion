'use client';

import Image from 'next/image';

const blurDataURL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlZWVlIi8+PC9zdmc+';

interface ProductHeroImageProps {
  src: string;
  alt: string;
}

export default function ProductHeroImage({ src, alt }: ProductHeroImageProps) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          placeholder="blur"
          blurDataURL={blurDataURL}
          sizes="(max-width: 1024px) 100vw, 1200px"
        />
      </div>
    </div>
  );
}

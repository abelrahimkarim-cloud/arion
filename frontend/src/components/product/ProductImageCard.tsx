'use client';

import Image from 'next/image';

const blurDataURL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlZWVlIi8+PC9zdmc+';

interface ProductImageCardProps {
  src: string;
  alt: string;
}

export default function ProductImageCard({ src, alt }: ProductImageCardProps) {
  return (
    <div className="overflow-hidden rounded-[1.75rem] bg-slate-100 shadow-lg shadow-slate-200/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          className="h-full w-full object-cover"
          placeholder="blur"
          blurDataURL={blurDataURL}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
    </div>
  );
}

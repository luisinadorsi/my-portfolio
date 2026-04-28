'use client';
import { useState } from 'react';
import Image from 'next/image';

interface ProjectImageProps {
  src: string;
  alt: string;
  fallbackBg: string;
}

export default function ProjectImage({ src, alt, fallbackBg }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        backgroundColor: fallbackBg,
      }}
    >
      {!failed && (
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

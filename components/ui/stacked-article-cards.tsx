'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ArticleCardItem {
  url: string;
  title: string;
  subTitle: string;
  img: string;
}

interface StackedArticleCardsProps {
  items: ArticleCardItem[];
  className?: string;
}

export function StackedArticleCards({ items, className }: StackedArticleCardsProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item, i) => (
        <motion.a
          key={item.url}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 px-5 py-4 rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-[#2d6b5a]"
          style={{
            backgroundColor: '#fdf8f5',
            border: '1px solid rgba(45,107,90,0.2)',
          }}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{
            delay: i * 0.08,
            duration: 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -3,
            boxShadow: '0 8px 28px rgba(45,107,90,0.13)',
          }}
        >
          {/* Thumbnail */}
          <img
            src={item.img}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          />

          {/* Text */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <span
              className="text-xl leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: '#2d6b5a' }}
            >
              {item.title}
            </span>
            <span
              className="text-sm leading-snug"
              style={{ color: 'rgba(42,36,32,0.65)' }}
            >
              {item.subTitle}
            </span>
          </div>

          {/* Arrow */}
          <span
            aria-hidden="true"
            className="ml-auto text-base flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            style={{ color: 'rgba(45,107,90,0.4)' }}
          >
            →
          </span>
        </motion.a>
      ))}
    </div>
  );
}

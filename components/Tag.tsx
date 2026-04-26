type TagProps = {
  children: React.ReactNode;
  variant?: 'default' | 'outline';
};

export default function Tag({ children, variant = 'default' }: TagProps) {
  if (variant === 'outline') {
    return (
      <span className="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full border border-[var(--color-heading)]/40 text-[var(--color-heading)]">
        {children}
      </span>
    );
  }
  return (
    <span className="inline-block text-xs font-medium tracking-widest uppercase px-3 py-1 rounded-full bg-[var(--color-heading)]/10 text-[var(--color-heading)]">
      {children}
    </span>
  );
}

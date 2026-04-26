type Meta = {
  role: string;
  timeline: string;
  tools: string;
  team: string;
};

type ProjectMetaProps = {
  meta: Meta;
};

const metaFields: { key: keyof Meta; label: string }[] = [
  { key: 'role',     label: 'Role' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'tools',    label: 'Tools' },
  { key: 'team',     label: 'Team' },
];

export default function ProjectMeta({ meta }: ProjectMetaProps) {
  return (
    <section className="py-12 border-b border-[var(--color-text)]/10">
      <div className="container">
        <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metaFields.map(({ key, label }) => (
            <div key={key}>
              <dt className="text-xs uppercase tracking-widest text-[var(--color-text)]/50 mb-2">
                {label}
              </dt>
              <dd className="text-sm text-[var(--color-text)] leading-relaxed">
                {meta[key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

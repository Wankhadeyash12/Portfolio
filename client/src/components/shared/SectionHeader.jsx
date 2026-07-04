export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-12 md:mb-16">
      <p className="text-accent text-sm font-semibold tracking-[0.2em] uppercase mb-3">Portfolio</p>
      <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold gradient-heading gradient-border">
        {title}
      </h2>
      {subtitle && <p className="text-muted mt-4 max-w-2xl">{subtitle}</p>}
    </div>
  );
}

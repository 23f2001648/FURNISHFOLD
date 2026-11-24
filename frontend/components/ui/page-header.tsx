export function PageHeader({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="border-b border-line bg-cream/60">
      <div className="container-ff py-12 md:py-16">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
        {text && <p className="mt-3 max-w-xl text-muted">{text}</p>}
      </div>
    </div>
  );
}

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  intro?: string;
  inverse?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  intro,
  inverse = false,
}: SectionHeadingProps) {
  return (
    <div className={`section-heading${inverse ? " section-heading-inverse" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <div className="section-heading-row">
        <h2>{title}</h2>
        {intro ? <p>{intro}</p> : null}
      </div>
    </div>
  );
}

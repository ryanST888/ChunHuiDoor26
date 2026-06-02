interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  inverse?: boolean;
}

export function SectionHeading({ eyebrow, title, description, align = "left", inverse = false }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className={`eyebrow ${inverse ? "text-gold" : ""}`}>{eyebrow}</p>
      <h2 className={`mt-4 font-serif text-3xl font-semibold sm:text-4xl lg:text-5xl ${inverse ? "text-white" : "text-ink"}`}>
        {title}
      </h2>
      {description ? (
        <p className={`mt-5 text-base leading-8 ${inverse ? "text-white/68" : "text-ink/62"}`}>{description}</p>
      ) : null}
    </div>
  );
}

import type { IntroSection as IntroSectionType } from "@/types/sections";

interface IntroSectionProps {
  section: IntroSectionType;
}

/** Render body text: split on double newlines → paragraphs; leading "- " lines → bullet list */
function BodyContent({ body }: { body: string }) {
  const blocks = body.split(/\n\n+/).filter(Boolean);

  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        const lines = block.split("\n");
        const isList = lines.every((l) => l.trimStart().startsWith("- "));

        if (isList) {
          return (
            <ul key={i} className="space-y-3 pl-0 list-none">
              {lines
                .filter((l) => l.trimStart().startsWith("- "))
                .map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-stone-600 text-lg leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-[11px]" />
                    <span>{item.replace(/^-\s*/, "")}</span>
                  </li>
                ))}
            </ul>
          );
        }

        return (
          <p key={i} className="text-stone-600 leading-relaxed text-lg">
            {block.replace(/\n/g, " ")}
          </p>
        );
      })}
    </div>
  );
}

export function IntroSection({ section }: IntroSectionProps) {
  return (
    <section className="py-20 lg:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-8">
            {section.heading}
          </h2>
          <BodyContent body={section.body} />
        </div>
      </div>
    </section>
  );
}

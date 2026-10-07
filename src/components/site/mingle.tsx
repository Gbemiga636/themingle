import { Reveal } from "@/components/site/reveal";
import type { PublicSite } from "@/types/domain";

export function Mingle({ site }: { site: PublicSite }) {
  const block = site.content.mingle;
  return (
    <section>
      <div className="section mingle">
        <div className="mingle-grid">
          <Reveal>
            <p className="eyebrow">{block.eyebrow}</p>
            <h2 className="display">{block.title}</h2>
          </Reveal>
          <ol>
            {block.lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>
      </div>
      <div className="reveal-band">
        <Reveal>
          <p>{block.reveal}</p>
          <p className="core-line">Learn. Connect. Play. Grow.</p>
        </Reveal>
      </div>
    </section>
  );
}

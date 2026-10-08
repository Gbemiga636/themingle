import { Reveal } from "@/components/site/reveal";
import { SafeImage } from "@/components/site/safe-image";
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
        <figure className="room-board">
          <SafeImage
            src="/room.jpeg"
            alt="The Mingle room: main hall, entrance, photo backdrop, stage, seating, mingle tables, game zone, connection wall, and food and drinks"
            width={1600}
            height={1600}
            sizes="100vw"
          />
        </figure>
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

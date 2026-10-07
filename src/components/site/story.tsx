import { SafeImage } from "@/components/site/safe-image";
import { Reveal } from "@/components/site/reveal";
import { resolveImage } from "@/config/assets";
import type { PublicSite } from "@/types/domain";

export function Story({ site }: { site: PublicSite }) {
  const about = site.content.about;
  const image = resolveImage(about.image);
  const secondary = resolveImage(about.secondaryImage);
  const [first, second] = about.title.split("\n");
  return (
    <section className="section story" id="about">
      <Reveal>
        <p className="eyebrow">{about.eyebrow}</p>
        <h2 className="display story-title">
          {first}
          <br />
          <em>{second}</em>
        </h2>
      </Reveal>
      <div className="story-grid">
        <Reveal>
          <p className="lede">{about.body}</p>
          <p className="story-note">Learn. Connect. Play. Grow. And maybe find love.</p>
        </Reveal>
        <div className="story-frame">
          <SafeImage src={image.src} alt={image.alt || "Guests of The Mingle"} width={1400} height={1700} sizes="(max-width: 900px) 100vw, 50vw" />
          <figure className="story-float">
            <SafeImage src={secondary.src} alt={secondary.alt || "Friends together"} width={700} height={900} sizes="230px" />
          </figure>
        </div>
      </div>
    </section>
  );
}

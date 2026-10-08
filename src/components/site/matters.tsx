import type { PublicSite } from "@/types/domain";

const topics = [
  { mark: "❤️", title: "Understanding love, relationships & marriage" },
  { mark: "🗣️", title: "Communication, compatibility & choosing the right partner" },
  { mark: "🚫", title: "Drug, alcohol and negative peer influence" },
  { mark: "🧠", title: "Making healthy and responsible life choices" },
  { mark: "💍", title: "Preparing yourself emotionally and mentally for marriage" },
];

export function Matters({ site }: { site: PublicSite }) {
  const ages = `${site.event.ageMin}–${site.event.ageMax}`;
  return (
    <section className="section matters manifesto" id="matters">
      <p className="eyebrow">The conversation</p>
      <h2 className="manifesto-ask">
        <span aria-hidden="true">💫</span> Are you ready to mingle? <span aria-hidden="true">💫</span>
      </h2>
      <p className="manifesto-spark">Something exciting is coming! 🎉❤️</p>
      <div className="manifesto-copy">
        <p>
          The Mingle is a special event created for young adults ages {ages}, because we believe that before you say “I do,” you need to understand what marriage, love, friendship, commitment, and responsibility truly mean.
        </p>
        <p>
          Today, we see many young people rushing into marriage and rushing out of it, simply because they were never prepared for what marriage really requires. The Mingle is here to change that narrative.
        </p>
        <p className="manifesto-lead">We will have meaningful conversations and practical sessions on:</p>
      </div>
      <ol className="manifesto-topics">
        {topics.map((topic, index) => (
          <li key={topic.title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>
              <i aria-hidden="true">{topic.mark}</i> {topic.title}
            </strong>
          </li>
        ))}
      </ol>
      <div className="manifesto-close">
        <p className="manifesto-wink">And of course… it’s called THE MINGLE for a reason! 😉</p>
        <p>
          Come meet new people, interact, have fun, build friendships, and who knows? You might just meet someone special. ❤️
        </p>
        <p className="manifesto-more">
          This is more than a party.
          <em>It’s a place to learn, connect, grow and possibly find love.</em>
        </p>
        <p className="manifesto-toast">So, are you ready to mingle? 🥂✨</p>
        <p className="manifesto-ages">
          Ages {ages} <span>|</span> Come ready to learn. Come ready to connect. Come ready to have fun!
        </p>
      </div>
    </section>
  );
}

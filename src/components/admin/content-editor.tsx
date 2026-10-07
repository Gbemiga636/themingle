"use client";

import { useState } from "react";
import { saveContent } from "@/server/actions";
import type { SiteContent } from "@/types/domain";

export function ContentEditor({ initial }: { initial: SiteContent }) {
  const [content, setContent] = useState(initial);
  const [note, setNote] = useState("");

  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="form">
      <section className="panel">
        <h2>Hero</h2>
        <label>Eyebrow<input value={content.hero.eyebrow} onChange={(event) => patch("hero", { ...content.hero, eyebrow: event.target.value })} /></label>
        <label>Headline<textarea rows={3} value={content.hero.headline} onChange={(event) => patch("hero", { ...content.hero, headline: event.target.value })} /></label>
        <label>Kicker<input value={content.hero.kicker} onChange={(event) => patch("hero", { ...content.hero, kicker: event.target.value })} /></label>
        <label>Description<textarea rows={4} value={content.hero.description} onChange={(event) => patch("hero", { ...content.hero, description: event.target.value })} /></label>
        <label>Primary button<input value={content.hero.primaryCta} onChange={(event) => patch("hero", { ...content.hero, primaryCta: event.target.value })} /></label>
        <label>Secondary button<input value={content.hero.secondaryCta} onChange={(event) => patch("hero", { ...content.hero, secondaryCta: event.target.value })} /></label>
        <label>Image (asset:hero or a URL)<input value={content.hero.image} onChange={(event) => patch("hero", { ...content.hero, image: event.target.value })} /></label>
        <label>Hero video URL<input value={content.hero.video} onChange={(event) => patch("hero", { ...content.hero, video: event.target.value })} placeholder="Optional" /></label>
      </section>
      <section className="panel">
        <h2>About</h2>
        <label>Eyebrow<input value={content.about.eyebrow} onChange={(event) => patch("about", { ...content.about, eyebrow: event.target.value })} /></label>
        <label>Title<textarea rows={2} value={content.about.title} onChange={(event) => patch("about", { ...content.about, title: event.target.value })} /></label>
        <label>Body<textarea rows={5} value={content.about.body} onChange={(event) => patch("about", { ...content.about, body: event.target.value })} /></label>
        <label>Image<input value={content.about.image} onChange={(event) => patch("about", { ...content.about, image: event.target.value })} /></label>
        <label>Secondary image<input value={content.about.secondaryImage} onChange={(event) => patch("about", { ...content.about, secondaryImage: event.target.value })} /></label>
      </section>
      <section className="panel">
        <h2>The conversation</h2>
        <label>Title<textarea rows={2} value={content.matters.title} onChange={(event) => patch("matters", { ...content.matters, title: event.target.value })} /></label>
        <label>Intro<textarea rows={4} value={content.matters.intro} onChange={(event) => patch("matters", { ...content.matters, intro: event.target.value })} /></label>
        {content.matters.words.map((word, index) => (
          <label key={word.word}>
            {word.word}
            <textarea rows={2} value={word.copy} onChange={(event) => {
              const words = content.matters.words.map((item, itemIndex) => itemIndex === index ? { ...item, copy: event.target.value } : item);
              patch("matters", { ...content.matters, words });
            }} />
          </label>
        ))}
      </section>
      <section className="panel">
        <h2>Experience</h2>
        {content.experiences.map((item, index) => (
          <div key={item.id} style={{ borderTop: "1px solid rgba(12,11,10,0.12)", paddingTop: "0.8rem" }}>
            <label>Title<input value={item.title} onChange={(event) => {
              const experiences = content.experiences.map((entry, entryIndex) => entryIndex === index ? { ...entry, title: event.target.value } : entry);
              patch("experiences", experiences);
            }} /></label>
            <label>Summary<input value={item.summary} onChange={(event) => {
              const experiences = content.experiences.map((entry, entryIndex) => entryIndex === index ? { ...entry, summary: event.target.value } : entry);
              patch("experiences", experiences);
            }} /></label>
            <label>Body<textarea rows={3} value={item.body} onChange={(event) => {
              const experiences = content.experiences.map((entry, entryIndex) => entryIndex === index ? { ...entry, body: event.target.value } : entry);
              patch("experiences", experiences);
            }} /></label>
            <label>Image<input value={item.image} onChange={(event) => {
              const experiences = content.experiences.map((entry, entryIndex) => entryIndex === index ? { ...entry, image: event.target.value } : entry);
              patch("experiences", experiences);
            }} /></label>
          </div>
        ))}
      </section>
      <section className="panel">
        <h2>Not a lecture</h2>
        <label>Title<textarea rows={2} value={content.play.title} onChange={(event) => patch("play", { ...content.play, title: event.target.value })} /></label>
        <label>Words, separated by commas<textarea rows={2} value={content.play.words.join(", ")} onChange={(event) => patch("play", { ...content.play, words: event.target.value.split(",").map((word) => word.trim()).filter(Boolean) })} /></label>
      </section>
      <section className="panel">
        <h2>You mingle</h2>
        <label>Title<input value={content.mingle.title} onChange={(event) => patch("mingle", { ...content.mingle, title: event.target.value })} /></label>
        <label>Lines, one per line<textarea rows={5} value={content.mingle.lines.join("\n")} onChange={(event) => patch("mingle", { ...content.mingle, lines: event.target.value.split("\n").filter(Boolean) })} /></label>
        <label>Reveal<textarea rows={2} value={content.mingle.reveal} onChange={(event) => patch("mingle", { ...content.mingle, reveal: event.target.value })} /></label>
      </section>
      <section className="panel">
        <h2>Closing</h2>
        <label>Title<textarea rows={2} value={content.finale.title} onChange={(event) => patch("finale", { ...content.finale, title: event.target.value })} /></label>
        <label>Primary button<input value={content.finale.primaryCta} onChange={(event) => patch("finale", { ...content.finale, primaryCta: event.target.value })} /></label>
        <label>Secondary button<input value={content.finale.secondaryCta} onChange={(event) => patch("finale", { ...content.finale, secondaryCta: event.target.value })} /></label>
        <label>Image<input value={content.finale.image} onChange={(event) => patch("finale", { ...content.finale, image: event.target.value })} /></label>
      </section>
      <button
        className="btn-fill"
        style={{ color: "#0c0b0a" }}
        type="button"
        onClick={async () => {
          await saveContent(content);
          setNote("Saved.");
        }}
      >
        Save content
      </button>
      {note ? <p>{note}</p> : null}
    </div>
  );
}

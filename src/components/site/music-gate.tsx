"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { announcedDate } from "@/config/event";
import { songs, type Song } from "@/config/music";
import { DateSeal } from "@/components/site/date-seal";

const STORAGE = "mingle-entry";

type Choice = { mode: "quiet" } | { mode: "song"; id: string };

type YtPlayer = {
  loadVideoById: (id: string) => void;
  playVideo: () => void;
  pauseVideo: () => void;
  unMute: () => void;
  mute: () => void;
  setVolume: (volume: number) => void;
};

type YoutubeWindow = Window & {
  YT?: { Player: new (element: HTMLElement, options: Record<string, unknown>) => YtPlayer };
  onYouTubeIframeAPIReady?: () => void;
};

function readChoice(): Choice | null {
  try {
    const raw = sessionStorage.getItem(STORAGE);
    return raw ? (JSON.parse(raw) as Choice) : null;
  } catch {
    return null;
  }
}

function watchUrl(id: string) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1&rel=0&modestbranding=1&enablejsapi=1`;
}

export function MusicGate() {
  const pathname = usePathname();
  const dockRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const [ready, setReady] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [playing, setPlaying] = useState(false);
  const [picker, setPicker] = useState(false);
  const admin = pathname.startsWith("/admin");

  useEffect(() => {
    setChoice(readChoice());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || admin) return;
    const dock = dockRef.current;
    if (!dock || playerRef.current) return;
    let cancelled = false;
    const youtube = window as YoutubeWindow;
    const slot = document.createElement("div");
    dock.prepend(slot);
    const wait = window.setTimeout(() => setPlayerReady(true), 8000);

    const create = () => {
      if (cancelled || playerRef.current || !slot.isConnected || !youtube.YT?.Player) return;
      new youtube.YT.Player(slot, {
        width: "240",
        height: "136",
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1, origin: window.location.origin },
        events: {
          onReady: (event: { target: YtPlayer }) => {
            playerRef.current = event.target;
            setPlayerReady(true);
          },
        },
      });
    };

    if (youtube.YT?.Player) create();
    else {
      const previous = youtube.onYouTubeIframeAPIReady;
      youtube.onYouTubeIframeAPIReady = () => {
        previous?.();
        create();
      };
      if (!document.querySelector("script[data-mingle-yt]")) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.dataset.mingleYt = "true";
        document.body.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      window.clearTimeout(wait);
      if (!playerRef.current) slot.remove();
    };
  }, [ready, admin]);

  useEffect(() => {
    if (!admin) return;
    playerRef.current?.pauseVideo();
    playerRef.current?.mute();
  }, [admin]);

  const song = choice?.mode === "song" ? songs.find((item) => item.id === choice.id) : undefined;

  function play(nextSong: Song, restart = false) {
    const next: Choice = { mode: "song", id: nextSong.id };
    sessionStorage.setItem(STORAGE, JSON.stringify(next));
    setChoice(next);
    setPlaying(true);
    setPicker(false);
    const player = playerRef.current;
    if (player) {
      player.unMute();
      player.setVolume(100);
      if (restart || choice?.mode !== "song" || choice.id !== nextSong.id) player.loadVideoById(nextSong.youtubeId);
      player.playVideo();
      return;
    }
    const dock = dockRef.current;
    if (!dock) return;
    const existing = dock.querySelector("iframe");
    if (existing) {
      existing.src = watchUrl(nextSong.youtubeId);
      return;
    }
    const iframe = document.createElement("iframe");
    iframe.src = watchUrl(nextSong.youtubeId);
    iframe.title = `${nextSong.title} by ${nextSong.artist}`;
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.referrerPolicy = "origin";
    dock.prepend(iframe);
  }

  function chooseQuiet() {
    sessionStorage.setItem(STORAGE, JSON.stringify({ mode: "quiet" } satisfies Choice));
    setChoice({ mode: "quiet" });
    setPlaying(false);
    setPicker(false);
    playerRef.current?.pauseVideo();
    playerRef.current?.mute();
  }

  function stopMusic() {
    setPlaying(false);
    playerRef.current?.pauseVideo();
    playerRef.current?.mute();
  }

  if (!ready) return null;

  return (
    <>
      {!admin && !choice ? (
        <div className="enter-gate" role="dialog" aria-labelledby="enter-title">
          <DateSeal date={announcedDate} placement="gate" />
          <div>
            <p className="eyebrow">The door</p>
            <h1 id="enter-title" className="display">
              How do you
              <br />
              want to enter?
            </h1>
            <p className="enter-copy">
              {playerReady ? (
                "Pick a song and it stays in the background. Or come in quietly."
              ) : (
                <span className="warming">
                  <span className="spin" aria-hidden="true" /> The music is warming up.
                </span>
              )}
            </p>
            <div className="enter-songs">
              {songs.map((item) => (
                <button key={item.id} type="button" disabled={!playerReady} onClick={() => play(item, true)}>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.artist}</small>
                  </span>
                </button>
              ))}
            </div>
            <button className="enter-quiet" type="button" onClick={chooseQuiet}>
              No music
            </button>
          </div>
        </div>
      ) : null}

      <div ref={dockRef} className="music-dock" hidden={admin} aria-hidden="true" />

      {!admin && song ? (
        <div className="soundbar">
          {picker ? (
            <div className="sound-list" role="menu" aria-label="Choose a song">
              {songs.map((item) => (
                <button key={item.id} type="button" role="menuitem" aria-current={item.id === song.id} onClick={() => play(item, true)}>
                  <strong>{item.title}</strong>
                  <small>{item.artist}</small>
                </button>
              ))}
            </div>
          ) : null}
          <button type="button" onClick={() => (playing ? stopMusic() : play(song))} aria-label={playing ? "Pause music" : "Play music"}>
            {playing ? "Pause" : "Play"}
          </button>
          <p>
            <strong>{song.title}</strong>
            <small>{song.artist}</small>
          </p>
          <button type="button" onClick={() => setPicker((open) => !open)} aria-expanded={picker}>
            Songs
          </button>
        </div>
      ) : null}

      {!admin && choice?.mode === "quiet" ? (
        <div className="soundbar is-quiet">
          {picker ? (
            <div className="sound-list" role="menu" aria-label="Choose a song">
              {songs.map((item) => (
                <button key={item.id} type="button" role="menuitem" disabled={!playerReady} onClick={() => play(item, true)}>
                  <strong>{item.title}</strong>
                  <small>{item.artist}</small>
                </button>
              ))}
              {!playerReady ? (
                <p className="warming">
                  <span className="spin" aria-hidden="true" /> Warming up
                </p>
              ) : null}
            </div>
          ) : null}
          <button type="button" onClick={() => setPicker((open) => !open)} aria-expanded={picker}>
            {picker && !playerReady ? <span className="spin" aria-hidden="true" /> : null}
            Choose a song
          </button>
        </div>
      ) : null}
    </>
  );
}

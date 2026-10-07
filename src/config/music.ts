export type Song = {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
};

/** Official YouTube uploads. Playback stays on YouTube. Nothing is downloaded or stored. */
export const songs: Song[] = [
  { id: "need-you", title: "Need You", artist: "Fireboy DML", youtubeId: "6RuVVTPolj8" },
  { id: "love-dont-cost", title: "Love Don't Cost A Dime", artist: "Magixx", youtubeId: "jlJytyVmXVQ" },
  { id: "again", title: "Again", artist: "Wande Coal", youtubeId: "67J_MwJIQOs" },
];

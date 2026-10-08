/**
 * Photographs of objects, not people.
 * Rings, flowers, letters, candles, and the table.
 * Swap any src here later.
 */
export type Asset = {
  src: string;
  alt: string;
  credit: string;
};

const unsplash = (id: string, alt: string) => ({
  src: `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1800&q=80`,
  alt,
  credit: "Unsplash",
});

export const assets = {
  hero: { src: "/hero.jpeg", alt: "Guests dressed in black, laughing together at The Mingle", credit: "The Mingle" },
  heroSecondary: unsplash("photo-1518895949257-7621c3c786d7", "A single red rose"),
  about: unsplash("photo-1520854221256-17451cc331bf", "A bouquet of white flowers"),
  aboutSecondary: unsplash("photo-1496062031456-07b8f162a322", "Red roses in close detail"),
  love: unsplash("photo-1455659817273-f96807779a8a", "A bouquet of red roses"),
  communication: unsplash("photo-1455390582262-044cdead277a", "A handwritten letter"),
  choices: unsplash("photo-1478146896981-b80fe463b330", "Candles burning on a cake"),
  marriage: unsplash("photo-1606800052052-a08af7148866", "Wedding rings"),
  connection: unsplash("photo-1469371670807-013ccf25f16a", "Flowers across a long table"),
  games: unsplash("photo-1518895949257-7621c3c786d7", "A rose laid on linen"),
  music: unsplash("photo-1483412033650-1015ddeb83d1", "A vinyl record"),
  food: unsplash("photo-1470337458703-46ad1756a187", "A cocktail on a dark bar"),
  finale: unsplash("photo-1490750967868-88aa4486c946", "A field of tulips"),
  galleryA: unsplash("photo-1520854221256-17451cc331bf", "White flowers gathered together"),
  galleryB: unsplash("photo-1515934751635-c81c6bc9a2d8", "A table laid for an evening"),
  galleryC: unsplash("photo-1455390582262-044cdead277a", "Ink on a letter"),
  galleryD: unsplash("photo-1606800052052-a08af7148866", "Rings"),
  galleryE: unsplash("photo-1514362545857-3bc16c4c7d1b", "Glasses waiting on a bar"),
  galleryF: unsplash("photo-1496062031456-07b8f162a322", "Roses"),
} satisfies Record<string, Asset>;

export type AssetKey = keyof typeof assets;

export function resolveImage(value: string): Asset {
  if (value.includes("photo-1522673607200")) return assets.love;
  if (value.startsWith("asset:")) {
    const key = value.slice(6) as AssetKey;
    return assets[key] ?? { src: "", alt: "", credit: "" };
  }
  return { src: value, alt: "", credit: "" };
}

import { addGalleryUrl, deleteGalleryItem, moveGalleryItem, uploadGallery } from "@/server/actions";
import { resolveImage } from "@/config/assets";
import { getStore } from "@/lib/store";
import { SafeImage } from "@/components/site/safe-image";

export default async function GalleryPage() {
  const gallery = [...(await getStore()).gallery].sort((a, b) => a.sort - b.sort);
  return (
    <div>
      <div className="admin-top"><h1>Gallery</h1></div>
      {gallery.length === 0 ? <div className="empty"><h2>Your memories will live here.</h2></div> : null}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.8rem" }}>
        {gallery.map((item) => {
          const image = resolveImage(item.src);
          return (
            <article className="panel" key={item.id}>
              <div style={{ position: "relative", height: 180 }}>
                <SafeImage src={image.src} alt={item.alt || image.alt} fill sizes="220px" style={{ objectFit: "cover" }} />
              </div>
              <p>{item.caption}</p>
              <p style={{ color: "#6d655c" }}>{item.credit}</p>
              <div className="row-actions">
                <form action={moveGalleryItem.bind(null, item.id, -1)}><button type="submit">Up</button></form>
                <form action={moveGalleryItem.bind(null, item.id, 1)}><button type="submit">Down</button></form>
                <form action={deleteGalleryItem.bind(null, item.id)}><button type="submit">Delete</button></form>
              </div>
            </article>
          );
        })}
      </div>
      <form className="panel form" action={addGalleryUrl} style={{ marginTop: "1rem" }}>
        <h2>Add by URL</h2>
        <label>Image URL<input name="src" required placeholder="https:// or asset:hero" /></label>
        <label>Alt text<input name="alt" /></label>
        <label>Caption<input name="caption" /></label>
        <label>Credit<input name="credit" /></label>
        <button type="submit">Add image</button>
      </form>
      <form className="panel form" action={uploadGallery} style={{ marginTop: "1rem" }}>
        <h2>Upload</h2>
        <p>Stored locally in this project until Supabase Storage is connected.</p>
        <label>File<input type="file" name="file" accept="image/*" required /></label>
        <label>Caption<input name="caption" /></label>
        <label>Alt text<input name="alt" /></label>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

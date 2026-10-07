import { ContentEditor } from "@/components/admin/content-editor";
import { deleteFaqItem, saveFaqItem } from "@/server/actions";
import { getStore } from "@/lib/store";

export default async function ContentPage() {
  const store = await getStore();
  const faqs = [...store.faqs].sort((a, b) => a.sort - b.sort);
  return (
    <div>
      <div className="admin-top"><h1>Content</h1></div>
      <ContentEditor initial={store.content} />
      <h2 style={{ marginTop: "2rem" }}>FAQ</h2>
      {faqs.map((faq) => (
        <form key={faq.id} className="panel form" action={saveFaqItem} style={{ marginBottom: "0.8rem" }}>
          <input type="hidden" name="id" value={faq.id} />
          <label>Question<input name="question" defaultValue={faq.question} /></label>
          <label>Answer<textarea name="answer" rows={3} defaultValue={faq.answer} /></label>
          <label>Order<input name="sort" type="number" defaultValue={faq.sort} /></label>
          <div className="row-actions">
            <button type="submit">Save</button>
            <button type="submit" formAction={deleteFaqItem.bind(null, faq.id)}>Delete</button>
          </div>
        </form>
      ))}
      <form className="panel form" action={saveFaqItem}>
        <h2>New question</h2>
        <label>Question<input name="question" /></label>
        <label>Answer<textarea name="answer" rows={3} /></label>
        <button type="submit">Add question</button>
      </form>
    </div>
  );
}

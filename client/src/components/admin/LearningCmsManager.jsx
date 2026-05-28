"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, Edit3, Save, Search, Star, Trash2, Upload } from "lucide-react";
import { AdminRouteShell } from "@/components/admin/AdminRouteShell";
import { apiFetch } from "@/services/api";

const templates = {
  labs: { title: "", slug: "", description: "", category: "Web Exploitation", difficulty: "beginner", tags: [], objectives: [], estimatedTime: 90, xpReward: 400, premium: false, price: 0, offerPrice: 0, featured: false, status: "published", visibility: "public" },
  rooms: { title: "", slug: "", storyline: "", categories: ["Web Exploitation"], difficulty: "beginner", tasks: [], hints: [], flags: [], walkthrough: "", points: 900, premium: false, price: 0, offerPrice: 0, featured: false, status: "published", visibility: "public" },
  courses: { title: "", slug: "", description: "", category: "Web Exploitation", modules: [], quizzes: [], assignments: [], resources: [], duration: 420, premium: true, price: 1999, offerPrice: 1399, certificateEnabled: true, featured: false, status: "published", visibility: "public" },
  workshops: { title: "", slug: "", description: "", schedule: "", timezone: "Asia/Kolkata", duration: 150, seats: 100, mentor: { name: "", title: "Senior Security Mentor", company: "UNI6CTF Academy" }, premium: true, price: 1499, offerPrice: 999, replayEnabled: true, certificateEnabled: true, featured: false, status: "published", visibility: "public" }
};

function prettyType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function parseList(value) {
  return String(value || "").split(",").map((item) => item.trim()).filter(Boolean);
}

function parseJsonList(value, fallback = []) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function PriceCell({ item }) {
  if (!item.premium) return <span className="text-emerald-300">Free</span>;
  return (
    <span>
      {item.offerPrice ? <span className="mr-2 text-cyber-red">Rs {item.offerPrice}</span> : null}
      <span className={item.offerPrice ? "text-white/40 line-through" : ""}>Rs {item.price || 0}</span>
      {item.offerPercentage ? <span className="ml-2 rounded-full bg-cyber-red/15 px-2 py-0.5 text-[10px] text-cyber-red">{item.offerPercentage}% off</span> : null}
    </span>
  );
}

export default function LearningCmsManager({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(templates[type]);
  const [message, setMessage] = useState("");

  const filtered = useMemo(() => items, [items]);
  const cmsTitle = `${prettyType(type)} CMS`;

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20", sort });
    if (query) params.set("search", query);
    if (status) params.set("status", status);
    const data = await apiFetch(`/learning/admin/${type}?${params.toString()}`);
    setItems(data.items || []);
    setLoading(false);
  }

  useEffect(() => {
    load().catch((err) => {
      setMessage(err.message || "Failed to load CMS data.");
      setLoading(false);
    });
  }, [type, page, sort]);

  function startEdit(item = null) {
    const next = item || templates[type];
    setEditing(item?._id || "new");
    setForm({ ...templates[type], ...next, tags: next.tags || [], objectives: next.objectives || [], categories: next.categories || [] });
  }

  async function saveItem(event) {
    event.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price || 0),
      offerPrice: Number(form.offerPrice || 0),
      estimatedTime: Number(form.estimatedTime || 0),
      duration: Number(form.duration || 0),
      seats: Number(form.seats || 0),
      xpReward: Number(form.xpReward || 0),
      points: Number(form.points || 0)
    };
    const path = editing === "new" ? `/learning/admin/${type}` : `/learning/admin/${type}/${editing}`;
    const method = editing === "new" ? "POST" : "PUT";
    await apiFetch(path, { method, body: JSON.stringify(payload) });
    setMessage("Saved successfully.");
    setEditing(null);
    await load();
  }

  async function removeItem(id) {
    await apiFetch(`/learning/admin/${type}/${id}`, { method: "DELETE" });
    setMessage("Deleted successfully.");
    await load();
  }

  async function bulk(action) {
    await apiFetch(`/learning/admin/${type}/bulk`, { method: "PATCH", body: JSON.stringify({ ids: selected, action }) });
    setSelected([]);
    setMessage(`Bulk ${action} complete.`);
    await load();
  }

  return (
    <AdminRouteShell title={cmsTitle}>
      <section className="rounded-2xl border border-white/10 bg-black/35 p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px_auto]">
          <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-3">
            <Search className="h-4 w-4 text-cyber-muted" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === "Enter" && load()} placeholder={`Search ${type}`} className="h-11 w-full bg-transparent text-sm outline-none" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-xl border border-white/10 bg-black px-3 text-sm">
            <option value="">All status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-white/10 bg-black px-3 text-sm">
            <option value="newest">Newest</option>
            <option value="trending">Trending</option>
          </select>
          <button onClick={() => startEdit()} className="rounded-xl bg-cyber-red px-4 py-2 text-xs font-black uppercase tracking-[0.1em]">Create</button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {["publish", "unpublish", "feature", "unfeature", "delete"].map((action) => (
            <button key={action} disabled={!selected.length} onClick={() => bulk(action)} className="rounded-lg border border-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[0.1em] text-white/75 disabled:opacity-40">{action}</button>
          ))}
        </div>
      </section>

      {message ? <p className="mt-3 rounded-xl border border-cyber-red/30 bg-cyber-red/10 px-4 py-3 text-sm text-cyber-red">{message}</p> : null}

      {editing ? (
        <form onSubmit={saveItem} className="mt-5 grid gap-4 rounded-2xl border border-white/10 bg-black/35 p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <input value={form.title || ""} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Title" className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" required />
            <input value={form.slug || ""} onChange={(event) => setForm({ ...form, slug: event.target.value })} placeholder="Slug" className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" />
          </div>
          <textarea value={form.description || form.storyline || ""} onChange={(event) => setForm(type === "rooms" ? { ...form, storyline: event.target.value } : { ...form, description: event.target.value })} placeholder="Markdown description or storyline" className="min-h-28 rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" />
          <div className="grid gap-3 md:grid-cols-4">
            <input value={form.category || (form.categories || []).join(", ")} onChange={(event) => type === "rooms" ? setForm({ ...form, categories: parseList(event.target.value) }) : setForm({ ...form, category: event.target.value })} placeholder="Category" className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" />
            <select value={form.difficulty || "beginner"} onChange={(event) => setForm({ ...form, difficulty: event.target.value })} className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm">
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <input value={(form.tags || []).join(", ")} onChange={(event) => setForm({ ...form, tags: parseList(event.target.value) })} placeholder="Tags" className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" />
            <input type="number" value={form.xpReward || form.points || 0} onChange={(event) => setForm({ ...form, xpReward: event.target.value, points: event.target.value })} placeholder="XP / Points" className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" />
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black px-3 py-3 text-sm"><input type="checkbox" checked={Boolean(form.premium)} onChange={(event) => setForm({ ...form, premium: event.target.checked })} /> Premium</label>
            <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-black px-3 py-3 text-sm"><input type="checkbox" checked={Boolean(form.featured)} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /> Featured</label>
            <input type="number" value={form.price || 0} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="Original price" className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" />
            <input type="number" value={form.offerPrice || 0} onChange={(event) => setForm({ ...form, offerPrice: event.target.value })} placeholder="Offer price" className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" />
            <select value={form.status || "published"} onChange={(event) => setForm({ ...form, status: event.target.value })} className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm">
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <textarea value={JSON.stringify(form.modules || form.tasks || [], null, 2)} onChange={(event) => setForm(type === "courses" ? { ...form, modules: parseJsonList(event.target.value, form.modules) } : type === "rooms" ? { ...form, tasks: parseJsonList(event.target.value, form.tasks) } : form)} className="min-h-36 rounded-xl border border-white/10 bg-black px-3 py-3 font-mono text-xs" />
            <textarea value={JSON.stringify(form.quizzes || form.flags || form.objectives || [], null, 2)} onChange={(event) => setForm(type === "courses" ? { ...form, quizzes: parseJsonList(event.target.value, form.quizzes) } : type === "rooms" ? { ...form, flags: parseJsonList(event.target.value, form.flags) } : { ...form, objectives: parseJsonList(event.target.value, form.objectives) })} className="min-h-36 rounded-xl border border-white/10 bg-black px-3 py-3 font-mono text-xs" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-white/10 px-4 py-2 text-xs font-black uppercase">Cancel</button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-cyber-red px-4 py-2 text-xs font-black uppercase"><Save className="h-4 w-4" /> Save</button>
          </div>
        </form>
      ) : null}

      <section className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/35">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.04] text-xs uppercase tracking-[0.12em] text-cyber-muted">
            <tr>
              <th className="p-3"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={(event) => setSelected(event.target.checked ? filtered.map((item) => item._id) : [])} /></th>
              <th className="p-3">Title</th>
              <th className="p-3">Access</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stats</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading ? <tr><td colSpan="6" className="p-6 text-center text-cyber-muted">Loading...</td></tr> : null}
            {!loading && filtered.map((item) => (
              <tr key={item._id} className="hover:bg-white/[0.03]">
                <td className="p-3"><input type="checkbox" checked={selected.includes(item._id)} onChange={(event) => setSelected(event.target.checked ? [...selected, item._id] : selected.filter((id) => id !== item._id))} /></td>
                <td className="p-3"><p className="font-bold text-white">{item.title}</p><p className="text-xs text-cyber-muted">{item.slug}</p></td>
                <td className="p-3">{item.premium ? "Premium" : "Free"} {item.featured ? <Star className="ml-2 inline h-4 w-4 text-cyber-red" /> : null}</td>
                <td className="p-3"><PriceCell item={item} /></td>
                <td className="p-3 text-cyber-muted">Views {item.analytics?.views || 0}</td>
                <td className="p-3">
                  <button onClick={() => startEdit(item)} className="mr-2 rounded-lg border border-white/10 p-2 text-cyber-red"><Edit3 className="h-4 w-4" /></button>
                  <button onClick={() => removeItem(item._id)} className="rounded-lg border border-white/10 p-2 text-cyber-red"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <div className="mt-4 flex justify-end gap-2">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded-lg border border-white/10 px-3 py-2 text-xs disabled:opacity-40">Prev</button>
        <button onClick={() => setPage(page + 1)} className="rounded-lg border border-white/10 px-3 py-2 text-xs">Next</button>
      </div>
    </AdminRouteShell>
  );
}

export function LearningAnalyticsAdmin() {
  const [data, setData] = useState(null);
  useEffect(() => {
    apiFetch("/learning/admin/analytics/overview").then(setData).catch(() => setData(null));
  }, []);
  return (
    <AdminRouteShell title="Learning Analytics">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {["labs", "rooms", "courses", "workshops"].map((key) => (
          <section key={key} className="rounded-2xl border border-white/10 bg-black/35 p-4">
            <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.12em] text-cyber-red"><BarChart3 className="h-4 w-4" /> Top {key}</p>
            <div className="mt-3 grid gap-2">
              {(data?.top?.[key] || []).slice(0, 5).map((item) => <p key={item._id} className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm">{item.title}</p>)}
            </div>
          </section>
        ))}
      </div>
    </AdminRouteShell>
  );
}

export function MediaLibraryAdmin() {
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState({ filename: "", originalName: "", mimeType: "image/webp", url: "", assetType: "thumbnail", contentType: "global" });
  useEffect(() => {
    apiFetch("/learning/admin/media").then((data) => setMedia(data.media || [])).catch(() => setMedia([]));
  }, []);
  async function save(event) {
    event.preventDefault();
    const data = await apiFetch("/learning/admin/media", { method: "POST", body: JSON.stringify(form) });
    setMedia([data.media, ...media]);
  }
  return (
    <AdminRouteShell title="Media Library">
      <form onSubmit={save} className="grid gap-3 rounded-2xl border border-white/10 bg-black/35 p-4 md:grid-cols-5">
        {["filename", "originalName", "mimeType", "url"].map((key) => <input key={key} value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} placeholder={key} className="rounded-xl border border-white/10 bg-black px-3 py-3 text-sm" required />)}
        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyber-red px-4 py-2 text-xs font-black uppercase"><Upload className="h-4 w-4" /> Add</button>
      </form>
      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {media.map((item) => <article key={item._id} className="rounded-xl border border-white/10 bg-black/35 p-3"><p className="font-bold">{item.originalName}</p><p className="text-xs text-cyber-muted">{item.mimeType}</p><p className="mt-2 truncate text-xs text-cyber-red">{item.url}</p></article>)}
      </div>
    </AdminRouteShell>
  );
}

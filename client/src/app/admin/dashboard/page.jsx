"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";

const sections = [
  "analytics",
  "homepage",
  "about",
  "sponsors",
  "ctfs",
  "challenges",
  "writeups",
  "team",
  "notifications",
  "media",
  "settings",
  "audit"
];

const emptyForms = {
  sponsor: { name: "", tier: "community", website: "", active: true, weight: 0 },
  ctf: { name: "", description: "", status: "draft", startsAt: "", endsAt: "" },
  challenge: { title: "", description: "", category: "Web", difficulty: "Easy", basePoints: 100, flag: "UNI6{}", status: "draft" },
  writeup: { title: "", excerpt: "", content: "", category: "Web", status: "draft" },
  team: { name: "", title: "", description: "", group: "core" },
  notification: { title: "", message: "", level: "info" }
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated, isAdmin } = useAuth();
  const [active, setActive] = useState("analytics");
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [homepage, setHomepage] = useState("");
  const [about, setAbout] = useState("");
  const [settings, setSettings] = useState("");
  const [auditLogs, setAuditLogs] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [ctfs, setCtfs] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [writeups, setWriteups] = useState([]);
  const [team, setTeam] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [media, setMedia] = useState([]);
  const [form, setForm] = useState(emptyForms);

  const token = useMemo(() => (typeof window !== "undefined" ? window.localStorage.getItem("uni6ctf_token") : null), []);
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  function updateForm(section, field, value) {
    setForm((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));
  }

  async function loadAll() {
    try {
      const [
        dashboardRes,
        homepageRes,
        aboutRes,
        sponsorsRes,
        ctfRes,
        challengeRes,
        writeupRes,
        teamRes,
        notificationsRes,
        mediaRes,
        settingsRes,
        auditRes
      ] = await Promise.all([
        apiFetch("/admin/dashboard", { headers: authHeaders }),
        apiFetch("/admin/homepage", { headers: authHeaders }),
        apiFetch("/admin/about", { headers: authHeaders }),
        apiFetch("/sponsors?active=true", { headers: authHeaders }),
        apiFetch("/ctfs?limit=100", { headers: authHeaders }),
        apiFetch("/challenges?limit=100", { headers: authHeaders }),
        apiFetch("/writeups?limit=100&status=draft", { headers: authHeaders }).catch(() => ({ writeups: [] })),
        apiFetch("/admin/team-members", { headers: authHeaders }),
        apiFetch("/admin/notifications", { headers: authHeaders }),
        apiFetch("/admin/media", { headers: authHeaders }),
        apiFetch("/admin/settings", { headers: authHeaders }),
        apiFetch("/admin/audit-logs", { headers: authHeaders })
      ]);

      setAnalytics(dashboardRes.analytics || null);
      setHomepage(JSON.stringify(homepageRes.settings || {}, null, 2));
      setAbout(JSON.stringify(aboutRes.settings || {}, null, 2));
      setSponsors(sponsorsRes.sponsors || []);
      setCtfs(ctfRes.ctfs || []);
      setChallenges(challengeRes.challenges || []);
      setWriteups(writeupRes.writeups || []);
      setTeam(teamRes.members || []);
      setNotifications(notificationsRes.notifications || []);
      setMedia(mediaRes.media || []);
      setSettings(JSON.stringify(settingsRes.settings || {}, null, 2));
      setAuditLogs(auditRes.logs || []);
    } catch (loadError) {
      setError(loadError.message || "Failed to load admin data.");
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/admin/login");
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }
    loadAll();
  }, [authLoading, isAuthenticated, isAdmin]);

  if (authLoading || !user) {
    return <main className="mx-auto max-w-7xl px-6 py-10 text-white">Loading...</main>;
  }

  async function saveJson(path, value) {
    try {
      const parsed = JSON.parse(value || "{}");
      await apiFetch(path, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify(parsed)
      });
      await loadAll();
    } catch (saveError) {
      setError(saveError.message || "Save failed");
    }
  }

  async function create(path, payload, sectionKey) {
    try {
      await apiFetch(path, { method: "POST", headers: authHeaders, body: JSON.stringify(payload) });
      setForm((current) => ({ ...current, [sectionKey]: emptyForms[sectionKey] }));
      await loadAll();
    } catch (createError) {
      setError(createError.message || "Create failed");
    }
  }

  async function remove(path) {
    try {
      await apiFetch(path, { method: "DELETE", headers: authHeaders });
      await loadAll();
    } catch (deleteError) {
      setError(deleteError.message || "Delete failed");
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 text-white">
      <h1 className="text-3xl font-black uppercase">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-cyber-muted">Manage platform content and operational data.</p>
      {error ? <p className="mt-4 text-sm text-cyber-red">{error}</p> : null}

      <div className="mt-6 flex flex-wrap gap-2">
        {sections.map((section) => (
          <button key={section} onClick={() => setActive(section)} className={`rounded-md px-4 py-2 text-xs font-bold uppercase ${active === section ? "bg-cyber-red" : "bg-white/10"}`}>
            {section}
          </button>
        ))}
      </div>

      {active === "analytics" && analytics ? <pre className="mt-6 overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(analytics, null, 2)}</pre> : null}
      {active === "homepage" ? <section className="mt-6"><textarea value={homepage} onChange={(e) => setHomepage(e.target.value)} className="min-h-[380px] w-full rounded-md border border-white/15 bg-black/40 p-4 text-sm" /><button onClick={() => saveJson("/admin/homepage", homepage)} className="mt-3 rounded-md bg-cyber-red px-4 py-2 text-xs font-bold uppercase">Save Homepage</button></section> : null}
      {active === "about" ? <section className="mt-6"><textarea value={about} onChange={(e) => setAbout(e.target.value)} className="min-h-[380px] w-full rounded-md border border-white/15 bg-black/40 p-4 text-sm" /><button onClick={() => saveJson("/admin/about", about)} className="mt-3 rounded-md bg-cyber-red px-4 py-2 text-xs font-bold uppercase">Save About</button></section> : null}
      {active === "settings" ? <section className="mt-6"><textarea value={settings} onChange={(e) => setSettings(e.target.value)} className="min-h-[380px] w-full rounded-md border border-white/15 bg-black/40 p-4 text-sm" /><button onClick={() => saveJson("/admin/settings", settings)} className="mt-3 rounded-md bg-cyber-red px-4 py-2 text-xs font-bold uppercase">Save Settings</button></section> : null}

      {active === "sponsors" ? (
        <section className="mt-6 grid gap-4">
          <div className="grid gap-2 md:grid-cols-4">
            <input value={form.sponsor.name} onChange={(e) => updateForm("sponsor", "name", e.target.value)} placeholder="Name" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
            <input value={form.sponsor.website} onChange={(e) => updateForm("sponsor", "website", e.target.value)} placeholder="Website" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
            <select value={form.sponsor.tier} onChange={(e) => updateForm("sponsor", "tier", e.target.value)} className="rounded border border-white/20 bg-black/40 px-3 py-2"><option value="community">community</option><option value="silver">silver</option><option value="gold">gold</option><option value="platinum">platinum</option></select>
            <button onClick={() => create("/sponsors", form.sponsor, "sponsor")} className="rounded bg-cyber-red px-3 py-2 text-xs font-bold uppercase">Create</button>
          </div>
          <pre className="overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(sponsors, null, 2)}</pre>
        </section>
      ) : null}

      {active === "ctfs" ? (
        <section className="mt-6 grid gap-4">
          <div className="grid gap-2 md:grid-cols-3">
            <input value={form.ctf.name} onChange={(e) => updateForm("ctf", "name", e.target.value)} placeholder="Event name" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
            <input value={form.ctf.startsAt} onChange={(e) => updateForm("ctf", "startsAt", e.target.value)} placeholder="Start ISO" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
            <input value={form.ctf.endsAt} onChange={(e) => updateForm("ctf", "endsAt", e.target.value)} placeholder="End ISO" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
          </div>
          <textarea value={form.ctf.description} onChange={(e) => updateForm("ctf", "description", e.target.value)} placeholder="Description" className="min-h-24 rounded border border-white/20 bg-black/40 px-3 py-2" />
          <button onClick={() => create("/ctfs", form.ctf, "ctf")} className="w-fit rounded bg-cyber-red px-3 py-2 text-xs font-bold uppercase">Create CTF</button>
          <pre className="overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(ctfs, null, 2)}</pre>
        </section>
      ) : null}

      {active === "challenges" ? (
        <section className="mt-6 grid gap-4">
          <div className="grid gap-2 md:grid-cols-4">
            <input value={form.challenge.title} onChange={(e) => updateForm("challenge", "title", e.target.value)} placeholder="Title" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
            <input value={form.challenge.basePoints} onChange={(e) => updateForm("challenge", "basePoints", Number(e.target.value || 0))} placeholder="Points" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
            <select value={form.challenge.category} onChange={(e) => updateForm("challenge", "category", e.target.value)} className="rounded border border-white/20 bg-black/40 px-3 py-2"><option>Web</option><option>Crypto</option><option>Forensics</option><option>Pwn</option><option>Reverse</option><option>Cloud</option><option>OSINT</option><option>Misc</option></select>
            <select value={form.challenge.difficulty} onChange={(e) => updateForm("challenge", "difficulty", e.target.value)} className="rounded border border-white/20 bg-black/40 px-3 py-2"><option>Easy</option><option>Medium</option><option>Hard</option><option>Insane</option></select>
          </div>
          <textarea value={form.challenge.description} onChange={(e) => updateForm("challenge", "description", e.target.value)} placeholder="Description" className="min-h-24 rounded border border-white/20 bg-black/40 px-3 py-2" />
          <input value={form.challenge.flag} onChange={(e) => updateForm("challenge", "flag", e.target.value)} placeholder="Flag" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
          <button onClick={() => create("/challenges", form.challenge, "challenge")} className="w-fit rounded bg-cyber-red px-3 py-2 text-xs font-bold uppercase">Create Challenge</button>
          <pre className="overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(challenges, null, 2)}</pre>
        </section>
      ) : null}

      {active === "writeups" ? (
        <section className="mt-6 grid gap-4">
          <input value={form.writeup.title} onChange={(e) => updateForm("writeup", "title", e.target.value)} placeholder="Title" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
          <input value={form.writeup.excerpt} onChange={(e) => updateForm("writeup", "excerpt", e.target.value)} placeholder="Excerpt" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
          <textarea value={form.writeup.content} onChange={(e) => updateForm("writeup", "content", e.target.value)} placeholder="Content" className="min-h-24 rounded border border-white/20 bg-black/40 px-3 py-2" />
          <button onClick={() => create("/writeups", form.writeup, "writeup")} className="w-fit rounded bg-cyber-red px-3 py-2 text-xs font-bold uppercase">Create Writeup</button>
          <pre className="overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(writeups, null, 2)}</pre>
        </section>
      ) : null}

      {active === "team" ? (
        <section className="mt-6 grid gap-4">
          <div className="grid gap-2 md:grid-cols-4">
            <input value={form.team.name} onChange={(e) => updateForm("team", "name", e.target.value)} placeholder="Name" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
            <input value={form.team.title} onChange={(e) => updateForm("team", "title", e.target.value)} placeholder="Title" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
            <select value={form.team.group} onChange={(e) => updateForm("team", "group", e.target.value)} className="rounded border border-white/20 bg-black/40 px-3 py-2"><option value="core">core</option><option value="developers">developers</option><option value="researchers">researchers</option><option value="organizers">organizers</option></select>
            <button onClick={() => create("/admin/team-members", form.team, "team")} className="rounded bg-cyber-red px-3 py-2 text-xs font-bold uppercase">Create</button>
          </div>
          <textarea value={form.team.description} onChange={(e) => updateForm("team", "description", e.target.value)} placeholder="Description" className="min-h-20 rounded border border-white/20 bg-black/40 px-3 py-2" />
          <pre className="overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(team, null, 2)}</pre>
        </section>
      ) : null}

      {active === "notifications" ? (
        <section className="mt-6 grid gap-4">
          <input value={form.notification.title} onChange={(e) => updateForm("notification", "title", e.target.value)} placeholder="Title" className="rounded border border-white/20 bg-black/40 px-3 py-2" />
          <textarea value={form.notification.message} onChange={(e) => updateForm("notification", "message", e.target.value)} placeholder="Message" className="min-h-20 rounded border border-white/20 bg-black/40 px-3 py-2" />
          <button onClick={() => create("/admin/notifications", form.notification, "notification")} className="w-fit rounded bg-cyber-red px-3 py-2 text-xs font-bold uppercase">Create Notification</button>
          <pre className="overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(notifications, null, 2)}</pre>
        </section>
      ) : null}

      {active === "media" ? <pre className="mt-6 overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(media, null, 2)}</pre> : null}
      {active === "audit" ? <pre className="mt-6 overflow-auto rounded-md border border-white/10 bg-black/40 p-4 text-xs">{JSON.stringify(auditLogs, null, 2)}</pre> : null}
    </main>
  );
}

// frontend/src/components/projects/ProjectCreateForm.jsx
import { useState } from "react";
import api, { API_BASE_URL } from "../../axiosConfig";

export default function ProjectCreateForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    skills: "",
    visibility: "public",
  });

  const [previewImages, setPreviewImages] = useState([]); // returned from /api/uploads
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  async function handleUpload(e) {
    const files = e.target.files;
    if (!files || !files.length) return;
    setBusy(true);
    setMsg("");

    try {
      const fd = new FormData();
      for (const f of files) fd.append("files", f);
      // IMPORTANT: send to backend uploads (no JSON header!)
      const res = await fetch(`${API_BASE_URL}/api/uploads`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json(); // [{ url, name }]
      setPreviewImages((s) => [...s, ...data]);
      setMsg("Files uploaded.");
    } catch (err) {
      console.error(err);
      setMsg("Upload failed.");
    } finally {
      setBusy(false);
      e.target.value = ""; // reset input
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()).filter(Boolean) : [],
        images: previewImages, // already [{url,name}]
        visibility: form.visibility,
      };

      const { data } = await api.post("/projects", payload);
      setMsg("Project created ✅");
      // redirect to details page
      window.location.href = `/projects/${data._id}`;
    } catch (err) {
      console.error(err);
      setMsg(err?.response?.data?.error || "Create failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, maxWidth: 640 }}>
      <h2>Post a Project</h2>

      <input name="title" placeholder="Title *" value={form.title} onChange={onChange} required />
      <textarea name="description" placeholder="Description *" rows={5} value={form.description} onChange={onChange} required />

      <div style={{ display: "flex", gap: 12 }}>
        <input name="budgetMin" placeholder="Budget min" type="number" value={form.budgetMin} onChange={onChange} />
        <input name="budgetMax" placeholder="Budget max" type="number" value={form.budgetMax} onChange={onChange} />
      </div>

      <input name="skills" placeholder="Skills (comma separated) e.g. React, CSS" value={form.skills} onChange={onChange} />

      <div>
        <label>
          Visibility:&nbsp;
          <select name="visibility" value={form.visibility} onChange={onChange}>
            <option value="public">public</option>
            <option value="invite-only">invite-only</option>
          </select>
        </label>
      </div>

      <div>
        <label>
          Images:&nbsp;
          <input type="file" multiple accept="image/*,application/pdf" onChange={handleUpload} disabled={busy} />
        </label>
        <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
          {previewImages.map((img) => (
            <img key={img.url} src={img.url} alt={img.name} style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 6 }} />
          ))}
        </div>
      </div>

      <button disabled={busy} style={{ padding: "8px 12px", borderRadius: 6 }}>
        {busy ? "Working…" : "Create Project"}
      </button>
      {msg && <p>{msg}</p>}
    </form>
  );
}

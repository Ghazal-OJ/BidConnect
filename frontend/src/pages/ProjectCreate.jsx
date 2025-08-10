import { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function ProjectCreate() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budgetMin: "",
    budgetMax: "",
    skills: "",
    deadline: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        title: form.title,
        description: form.description,
        budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
        skills: form.skills
          ? form.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        deadline: form.deadline || undefined,
      };
      await api.post("/projects", payload); // نیاز به توکن دارد
      navigate("/projects");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to create project");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Project</h1>

      {error && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="title" value={form.title} onChange={onChange}
          placeholder="Title" className="w-full border rounded p-2" required
        />
        <textarea
          name="description" value={form.description} onChange={onChange}
          placeholder="Description" className="w-full border rounded p-2 h-28" required
        />
        <div className="grid grid-cols-2 gap-3">
          <input name="budgetMin" value={form.budgetMin} onChange={onChange} placeholder="Budget Min" className="border rounded p-2" type="number" min="0" />
          <input name="budgetMax" value={form.budgetMax} onChange={onChange} placeholder="Budget Max" className="border rounded p-2" type="number" min="0" />
        </div>
        <input
          name="skills" value={form.skills} onChange={onChange}
          placeholder="Skills (comma-separated e.g. react,css,node)" className="w-full border rounded p-2"
        />
        <input
          name="deadline" value={form.deadline} onChange={onChange}
          placeholder="Deadline" className="w-full border rounded p-2" type="date"
        />

        <div className="flex gap-2">
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white">Create</button>
          <button type="button" className="px-4 py-2 rounded border" onClick={() => navigate("/projects")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

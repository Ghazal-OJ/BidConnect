import { useState } from "react";
import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";

export default function ProjectForm() {
  const [form, setForm] = useState({
    title: "", description: "", budgetMin: "", budgetMax: "", skills: "", deadline: ""
  });
  const nav = useNavigate();

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async e => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      budgetMin: form.budgetMin ? Number(form.budgetMin) : undefined,
      budgetMax: form.budgetMax ? Number(form.budgetMax) : undefined,
      skills: form.skills ? form.skills.split(",").map(s=>s.trim()).filter(Boolean) : [],
      deadline: form.deadline || undefined
    };
    await axios.post("/projects", payload);
    nav("/projects");
  };

  return (
    <form onSubmit={onSubmit} style={{padding:16, display:'grid', gap:8}}>
      <h2>New Project</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={onChange} required/>
      <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} required/>
      <input name="budgetMin" type="number" placeholder="Budget Min" value={form.budgetMin} onChange={onChange}/>
      <input name="budgetMax" type="number" placeholder="Budget Max" value={form.budgetMax} onChange={onChange}/>
      <input name="skills" placeholder="react, css, node" value={form.skills} onChange={onChange}/>
      <input name="deadline" type="date" value={form.deadline} onChange={onChange}/>
      <button type="submit">Create</button>
    </form>
  );
}

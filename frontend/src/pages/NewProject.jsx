import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function NewProject(){
  const nav = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ title:'', desc:'', budget:'', deadline:'' });
  const [err, setErr] = useState('');

  if (user?.role !== 'client') {
    return <p className="text-red-600">Only clients can post projects.</p>;
  }

  async function submit(e){
    e.preventDefault(); setErr('');
    try{
      const payload = { ...form, budget: form.budget? Number(form.budget): null, deadline: form.deadline || null };
      await api.post('/projects', payload);
      nav('/projects');
    }catch(e){ setErr(e.response?.data?.error || 'Failed to create project'); }
  }

  return (
    <form onSubmit={submit} className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Post a Project</h2>
      {err && <p className="text-red-600 mb-3">{err}</p>}

      <label className="block mb-1">Title</label>
      <input className="w-full p-2 border rounded mb-3" value={form.title}
        onChange={e=>setForm({...form, title:e.target.value})} required />

      <label className="block mb-1">Description</label>
      <textarea className="w-full p-2 border rounded mb-3" value={form.desc}
        onChange={e=>setForm({...form, desc:e.target.value})} />

      <label className="block mb-1">Budget</label>
      <input type="number" className="w-full p-2 border rounded mb-3" value={form.budget}
        onChange={e=>setForm({...form, budget:e.target.value})} />

      <label className="block mb-1">Deadline</label>
      <input type="date" className="w-full p-2 border rounded mb-4" value={form.deadline}
        onChange={e=>setForm({...form, deadline:e.target.value})} />

      <button className="w-full bg-blue-600 text-white p-2 rounded">Create</button>
    </form>
  );
}

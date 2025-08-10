import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function NewProject() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',   // ← مهم: نام دقیق فیلد
    budget: '',
    deadline: '',
  });
  const [err, setErr] = useState('');

  if (user?.role !== 'client') {
    return <p className="text-red-600">403 — Only clients can post projects.</p>;
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.post(
        '/projects',
        {
          title: form.title,
          description: form.description,           // ← این کلید باید همین باشد
          budget: form.budget ? Number(form.budget) : undefined,
          deadline: form.deadline || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/projects');
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to create project');
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Post a Project</h2>
      {err && <p className="mb-3 text-red-600">{err}</p>}

      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            className="w-full p-2 border rounded"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded"
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Budget</label>
          <input
            type="number"
            className="w-full p-2 border rounded"
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Deadline</label>
          <input
            type="date"
            className="w-full p-2 border rounded"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
        </div>

        <button className="w-full bg-blue-600 text-white p-2 rounded">Create</button>
      </form>
    </div>
  );
}

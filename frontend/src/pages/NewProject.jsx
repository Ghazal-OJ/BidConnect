import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function NewProject() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // ✅ تمام هوک‌ها قبل از هر return
  const [form, setForm] = useState({
    title: '',
    description: '',
    budget: '',
    deadline: '',
  });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  // ⛳️ گاردهای دسترسی — بعد از تعریف هوک‌ها
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'employer') {
    return (
      <div className="max-w-xl mx-auto mt-10">
        <p className="text-red-600">403 — Only employers can post projects.</p>
      </div>
    );
  }

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        budget: form.budget ? Number(form.budget) : undefined,
        deadline: form.deadline || undefined,
      };

      const { data } = await api.post('/projects', payload, {
        // اگر axiosConfig توکن رو خودش اضافه می‌کنه، این هدر رو بردار
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate(`/projects/${data?._id || ''}` || '/projects');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
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

        <button
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating…' : 'Create'}
        </button>
      </form>
    </div>
  );
}

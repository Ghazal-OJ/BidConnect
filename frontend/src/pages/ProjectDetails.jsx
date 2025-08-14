import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [err, setErr] = useState('');
  const [form, setForm] = useState({ amount: '', days: '', note: '' });

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const { data } = await api.get(`/projects/${id}`);
        if (!cancelled) setProject(data);

        const { data: list } = await api.get(`/bids/projects/${id}`);
        if (!cancelled) setBids(list || []);
      } catch (e) {
        if (!cancelled) setErr(e.response?.data?.error || 'Failed to load project');
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.post(`/bids/projects/${id}`, {
        amount: Number(form.amount),
        days: Number(form.days),
        coverLetter: form.note,
        projectId: id
      });
      setForm({ amount: '', days: '', note: '' });
      const { data: list } = await api.get(`/bids/projects/${id}`);
      setBids(list || []);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to submit bid');
    }
  }

  if (!project) return <p>Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto">
      {err && <p className="text-red-600 mb-3">{err}</p>}

      <h1 className="text-2xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-700 mb-6">{project.description}</p>

      <h2 className="text-xl font-semibold mb-2">Bids</h2>
      <ul className="space-y-2 mb-6">
        {bids.map(b => (
          <li key={b._id} className="border rounded p-3">
            <div className="flex justify-between">
              <strong>${b.amount}</strong>
              <span>{b.days} days</span>
            </div>
            <div className="text-sm text-gray-700 mt-2">{b.coverLetter}</div>
          </li>
        ))}
        {bids.length === 0 && <li className="text-gray-500">No bids yet.</li>}
      </ul>

      {user && user.id !== project.owner && (
        <form onSubmit={handleSubmit} className="border rounded p-4">
          <h3 className="font-semibold mb-3">Submit a bid</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              min="1"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
              placeholder="Amount (USD)"
              className="border rounded p-2"
              required
            />
            <input
              type="number"
              min="1"
              value={form.days}
              onChange={e => setForm(f => ({ ...f, days: e.target.value }))}
              placeholder="Days"
              className="border rounded p-2"
              required
            />
          </div>
          <textarea
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            placeholder="Cover letter"
            className="border rounded p-2 w-full h-28 mb-3"
            required
          />
          <button className="bg-black text-white px-4 py-2 rounded">Submit</button>
        </form>
      )}
    </div>
  );
}

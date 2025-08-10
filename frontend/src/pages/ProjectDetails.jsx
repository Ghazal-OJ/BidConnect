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

    async function load() {
      try {
        const [{ data: p }, { data: list }] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/bids/project/${id}`)
        ]);
        if (!cancelled) {
          setProject(p);
          setBids(list || []);
        }
      } catch (e) {
        if (!cancelled) setErr(e.response?.data?.error || 'Failed to load');
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id]);

  async function submitBid(e) {
    e.preventDefault();
    setErr('');
    try {
      await api.post('/bids', {
        amount: Number(form.amount),
        days: Number(form.days),
        note: form.note,
        projectId: id
      });
      setForm({ amount: '', days: '', note: '' });
      const { data: list } = await api.get(`/bids/project/${id}`);
      setBids(list || []);
    } catch (e) {
      setErr(e.response?.data?.error || 'Failed to submit bid');
    }
  }

  if (!project) return <p>Loading…</p>;

  return (
    <div className="max-w-2xl mx-auto">
      {err && <p className="text-red-600 mb-3">{err}</p>}

      <h2 className="text-2xl font-bold mb-2">{project.title}</h2>
      <p className="mb-2">{project.desc}</p>
      <p className="text-sm text-gray-600 mb-6">
        Status: {project.status} — Budget: {project.budget ?? '-'}
      </p>

      <h3 className="text-xl font-semibold mb-2">Bids</h3>
      <ul className="space-y-2 mb-6">
        {bids.map((b) => (
          <li key={b._id} className="p-3 border rounded">
            <div>{b.amount} in {b.days} day(s) — {b.status}</div>
            {b.note && <div className="text-sm text-gray-600">{b.note}</div>}
          </li>
        ))}
      </ul>

      {user?.role === 'freelancer' && (
        <form onSubmit={submitBid} className="p-4 border rounded">
          <h4 className="font-semibold mb-2">Submit a bid</h4>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <input
              type="number"
              className="p-2 border rounded"
              placeholder="Amount"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
            <input
              type="number"
              className="p-2 border rounded"
              placeholder="Days"
              value={form.days}
              onChange={(e) => setForm({ ...form, days: e.target.value })}
              required
            />
          </div>
          <input
            className="w-full p-2 border rounded mb-3"
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Send bid</button>
        </form>
      )}
    </div>
  );
}

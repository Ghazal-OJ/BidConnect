import { useState } from 'react';
import api from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

export default function BidForm({ projectId, onSubmitted }) {
  const { token } = useAuth();

  const [amount, setAmount] = useState('');
  const [days, setDays] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await api.post(
        `/bids/projects/${projectId}`,
        {
          amount: amount ? Number(amount) : undefined,
          days: days ? Number(days) : undefined,
          coverLetter: coverLetter.trim() || undefined,
        },
        { headers: { Authorization: `Bearer ${token}` } } // ⬅️ حتماً توکن
      );
      setAmount('');
      setDays('');
      setCoverLetter('');
      onSubmitted?.(); // refresh parent (reload project/bids)
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to submit bid');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h3 className="font-semibold mb-3">Place a Bid</h3>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          className="border rounded px-3 py-2"
          type="number"
          min="1"
          placeholder="Amount ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          className="border rounded px-3 py-2"
          type="number"
          min="1"
          placeholder="Days"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />
        <button
          disabled={loading}
          className="bg-blue-600 text-white rounded px-4 py-2 disabled:opacity-60"
        >
          {loading ? 'Submitting…' : 'Submit Bid'}
        </button>
        <textarea
          className="md:col-span-3 border rounded px-3 py-2"
          rows={4}
          placeholder="Cover letter (optional)"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
        />
      </form>
    </div>
  );
}

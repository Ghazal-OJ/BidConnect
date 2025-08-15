import { useEffect, useState, useCallback } from 'react';
import api from '../../axiosConfig';
import { useAuth } from '../../context/AuthContext';

/**
 * Props:
 * - projectId
 * - view: 'employer' | 'freelancer'
 */
export default function BidList({ projectId, view }) {
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get(`/bids/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` }, // ⬅️ حتماً توکن
      });
      setItems(data || []);
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to load bids');
    } finally {
      setLoading(false);
    }
  }, [projectId, token]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <p>Loading bids…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!items.length) return <p className="text-gray-600">No bids yet.</p>;

  return (
    <ul className="space-y-2">
      {items.map((b) => (
        <li key={b._id} className="border rounded-lg p-3 flex items-center justify-between">
          <div>
            <div className="font-medium">
              ${b.amount} — {b.days ? `${b.days} days` : 'n/a'}
            </div>
            <div className="text-sm text-gray-600">
              By: {b?.bidder?.name || 'N/A'} — Status: {b.status}
            </div>
            {b.coverLetter && <div className="text-sm mt-1">{b.coverLetter}</div>}
          </div>
          <div className="text-xs text-gray-500">
            {new Date(b.createdAt).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}

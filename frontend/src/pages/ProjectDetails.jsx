import { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import BidForm from '../components/bids/BidForm';
import BidList from '../components/bids/BidList';

function fmtBudget(p) {
  if (p?.budget != null) return `$${Number(p.budget).toLocaleString()}`;
  const { budgetMin, budgetMax } = p || {};
  if (budgetMin != null && budgetMax != null) return `$${budgetMin}–$${budgetMax}`;
  if (budgetMin != null) return `$${budgetMin}+`;
  if (budgetMax != null) return `≤ $${budgetMax}`;
  return '$-';
}

export default function ProjectDetails() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user, token } = useAuth();

  const [project, setProject] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const ownerId = project?.owner?._id ?? project?.owner;
  const userId = user?.id || user?._id;

  const isEmployerOwner = useMemo(
    () => Boolean(user && user.role === 'employer' && String(userId) === String(ownerId)),
    [user, userId, ownerId]
  );
  const canFreelancerBid = useMemo(
    () => Boolean(user && user.role === 'freelancer' && String(userId) !== String(ownerId)),
    [user, userId, ownerId]
  );

  async function handleDelete() {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      nav('/projects');
    } catch (e) {
      alert(e?.response?.data?.error || 'Delete failed');
    }
  }

  if (loading) return <div className="p-4">Loading…</div>;
  if (err) return <div className="p-4 text-red-600">{err}</div>;
  if (!project) return <div className="p-4">Not found</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <p className="text-gray-700 mt-2 whitespace-pre-line">{project.description}</p>
            <p className="text-sm text-gray-600 mt-2">
              Status: {project.status || 'Published'} — Budget: {fmtBudget(project)}
            </p>
          </div>
          {isEmployerOwner && (
            <div className="flex gap-2">
              <Link to={`/projects/${id}/edit`} className="px-3 py-1 border rounded">
                Edit
              </Link>
              <button onClick={handleDelete} className="px-3 py-1 border rounded text-red-600">
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Link to="/projects" className="underline text-blue-600">Back to Projects</Link>
        </div>
      </div>

      {/* Freelancer bid form */}
      {canFreelancerBid && (
        <div className="mb-6">
          <BidForm projectId={id} onSubmitted={load} />
        </div>
      )}

      {/* Bids list */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Bids</h3>
        {isEmployerOwner ? (
          <BidList projectId={id} view="employer" />
        ) : (
          <FreelancerOwnBid projectId={id} userId={userId} />
        )}
      </div>
    </div>
  );
}

/** Show only the current freelancer's own bid on this project */
function FreelancerOwnBid({ projectId, userId }) {
  const [myBid, setMyBid] = useState(null);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(true);

  const loadMy = useCallback(async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get(`/bids/projects/${projectId}`);
      const mine = (data || []).find(
        (b) => String(b.bidder?._id ?? b.bidder) === String(userId)
      );
      setMyBid(mine || null);
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to load bids');
    } finally {
      setLoading(false);
    }
  }, [projectId, userId]);

  useEffect(() => {
    loadMy();
  }, [loadMy]);

  if (loading) return <p>Loading…</p>;
  if (err) return <p className="text-red-600">{err}</p>;
  if (!myBid) return <p className="text-gray-600">You have not placed a bid yet.</p>;

  return (
    <div className="border rounded-lg p-3">
      <div className="font-medium">
        ${myBid.amount} — {myBid.days ? `${myBid.days} days` : 'n/a'}
      </div>
      <div className="text-sm text-gray-600">Status: {myBid.status}</div>
      {myBid.coverLetter && <div className="text-sm mt-1">{myBid.coverLetter}</div>}
    </div>
  );
}

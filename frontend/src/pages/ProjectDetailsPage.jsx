
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import BidForm from '../components/bids/BidForm';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();                  // expects { role: 'freelancer' | 'employer', ... }
  const [project, setProject] = useState(null);
  const [showBid, setShowBid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/projects/${id}`);
        if (alive) setProject(data);
      } catch (e) {
        console.error(e);
        if (alive) setErr(e?.response?.data?.message || 'Failed to load project');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const canApply = Boolean(user) && user.role === 'freelancer';

  if (loading) return <p className="p-4">Loading…</p>;
  if (err) return <p className="p-4 text-red-600">{err}</p>;
  if (!project) return <p className="p-4">Not found.</p>;

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-semibold">{project.title}</h1>
      <p className="text-gray-700">{project.description}</p>

      {!!project.images?.length && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {project.images.map((img, i) => (
            <img
              key={img.url || i}
              src={img.url}
              alt={img.name || `image-${i}`}
              className="w-full h-44 object-cover rounded-lg border"
              loading="lazy"
            />
          ))}
        </div>
      )}

      <div className="text-sm text-gray-600 space-y-1">
        <div>
          <b>Budget:</b>{' '}
          {(project.budgetMin ?? '?') + ' – ' + (project.budgetMax ?? '?')} USD
        </div>
        <div>
          <b>Skills:</b> {project.skills?.join(' · ') || '-'}
        </div>
        <div>
          <b>Status:</b> {project.status}
        </div>
      </div>

      <div className="flex gap-3">
        {canApply ? (
          <button
            className="px-4 py-2 rounded-md bg-black text-white"
            onClick={() => setShowBid(true)}
          >
            Apply
          </button>
        ) : !user ? (
          <Link className="px-4 py-2 rounded-md border" to="/login">
            Login to Apply
          </Link>
        ) : null}
      </div>

      {showBid && (
        <BidForm
          projectId={project._id}
          onClose={() => setShowBid(false)}
        />
      )}
    </div>
  );
}

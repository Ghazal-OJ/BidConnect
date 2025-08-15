import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [form, setForm] = useState({ title: '', description: '', budget: '' });
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;

    if (!user) {
      setLoading(false);
      return () => { mounted = false; };
    }

    (async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        const ownerId = data.owner?._id ?? data.owner;
        const userId = user?.id || user?._id;
        const isOwnerEmployer =
          user?.role === 'employer' && String(userId) === String(ownerId);

        if (!isOwnerEmployer) {
          if (mounted) {
            setForbidden(true);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setForm({
            title: data.title || '',
            description: data.description || '',
            budget: data.budget ?? '',
          });
          setLoading(false);
        }
      } catch (e) {
        if (mounted) {
          setErr(e?.response?.data?.error || 'Failed to load project');
          setLoading(false);
        }
      }
    })();

    return () => { mounted = false; };
  }, [id, user]);

  if (!user) return <Navigate to="/login" replace />;
  if (loading) return <div className="max-w-xl mx-auto mt-10">Loading…</div>;
  if (forbidden) return <div className="max-w-xl mx-auto mt-10 text-red-600">You’re not allowed to edit this project.</div>;
  if (err) return <div className="max-w-xl mx-auto mt-10 text-red-600">{err}</div>;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      await api.put(`/projects/${id}`, {
        title: form.title.trim(),
        description: form.description.trim(),
        budget: form.budget === '' ? undefined : Number(form.budget),
      }, { headers: { Authorization: `Bearer ${token}` } });
      navigate(`/projects/${id}`);
    } catch (e) {
      setErr(e?.response?.data?.error || 'Update failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

        {err && <p className="mb-4 text-red-600">{err}</p>}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              required
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Project title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              required
              rows={6}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe your project…"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input
                type="number"
                name="budget"
                min="0"
                value={form.budget}
                onChange={onChange}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. 500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-lg border hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

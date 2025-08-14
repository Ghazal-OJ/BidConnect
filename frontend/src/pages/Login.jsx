import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const { login } = useAuth();

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      console.log('[Login] submitting', form.email);
      const { data } = await api.post('/auth/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password
      });
      console.log('[Login] response', data);
      login(data);                // AuthContext نسخه‌ی اصلاح‌شده هر دو فرمت پاسخ را می‌پذیرد
      nav('/projects');
    } catch (e) {
      console.error('[Login] error', e?.response?.status, e?.response?.data || e.message);
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Login failed';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {err && <p className="text-red-600 mb-3">{err}</p>}

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        className="w-full p-2 border rounded mb-3"
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />

      <div className="flex justify-between items-center mb-4">
        <span />
        <Link to="/forgot-password" className="text-sm text-blue-600">Forgot password?</Link>
      </div>

      <button
        className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
        disabled={loading}
      >
        {loading ? 'Signing in…' : 'Login'}
      </button>
    </form>
  );
}

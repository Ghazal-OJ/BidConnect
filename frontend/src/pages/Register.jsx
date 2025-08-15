import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employer',
  });

  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    
    const v = name === 'role' ? value.toLowerCase() : value;
    setFormData((f) => ({ ...f, [name]: v }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    try {
      
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role === 'freelancer' ? 'freelancer' : 'employer',
      };

      const { data } = await api.post('/auth/register', payload);

      
      login(data);
      navigate('/projects');
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        'Registration failed';
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <form onSubmit={onSubmit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Create account</h1>
        {err && <p className="mb-3 text-red-600">{err}</p>}

        <input
          name="name"
          type="text"
          placeholder="Full name"
          className="border rounded w-full p-2 mb-3"
          value={formData.name}
          onChange={onChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border rounded w-full p-2 mb-3"
          value={formData.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6)"
          className="border rounded w-full p-2 mb-4"
          value={formData.password}
          onChange={onChange}
          minLength={6}
          required
        />

        <label className="block text-sm mb-1 font-medium">Role</label>
        <select
          name="role"
          className="border rounded w-full p-2 mb-4"
          value={formData.role}
          onChange={onChange}
        >
          <option value="employer">Employer</option>
          <option value="freelancer">Freelancer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Creating…' : 'Create'}
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 underline">Login</Link>
        </p>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function Register(){
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'client' });
  const [err, setErr] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();

  async function submit(e){
    e.preventDefault(); setErr('');
    try{
      const { data } = await api.post('/auth/register', form);
      login(data);          // {token, user}
      nav('/projects');
    }catch(e){ setErr(e.response?.data?.error || 'Register failed'); }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4">Create account</h2>
      {err && <p className="text-red-600 mb-3">{err}</p>}

      <input className="w-full p-2 border rounded mb-3" placeholder="Name"
        value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />

      <input className="w-full p-2 border rounded mb-3" placeholder="Email" type="email"
        value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />

      <input className="w-full p-2 border rounded mb-3" placeholder="Password" type="password"
        value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />

      <label className="block text-sm mb-1">Role</label>
      <select className="w-full p-2 border rounded mb-4"
        value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
        <option value="client">Employer</option>
        <option value="freelancer">Freelancer</option>
      </select>

      <button className="w-full bg-blue-600 text-white p-2 rounded">Create</button>
    </form>
  );
}

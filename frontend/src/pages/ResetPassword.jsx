import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

export default function ResetPassword() {
  const [sp] = useSearchParams();
  const token = sp.get('token');
  const [pw, setPw] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setMsg('');
    try{
      await api.post('/auth/reset-password', { token, newPassword: pw });
      setMsg('Password updated. You can login now.');
      setTimeout(()=> navigate('/login'), 1200);
    }catch(err){
      setMsg(err.response?.data?.error || 'Something went wrong.');
    }
  }

  if(!token) return <p className="p-4">Invalid link.</p>;

  return (
    <div className="max-w-md mx-auto mt-20">
      <form onSubmit={submit} className="bg-white p-6 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-center">Reset Password</h1>
        <input type="password" name="new-password" autoComplete="new-password"
          value={pw} onChange={e=>setPw(e.target.value)}
          className="w-full mb-4 p-2 border rounded" placeholder="New password" required />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Update Password</button>
        {msg && <p className="mt-4 text-center text-sm">{msg}</p>}
      </form>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axiosConfig';

export default function Projects(){
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  useEffect(()=>{ (async ()=>{
    try {
      const { data } = await api.get('/projects');
      setItems(data || []);
    } catch (e) { setErr(e.response?.data?.error || 'Failed to load projects'); }
  })(); },[]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Projects</h2>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <ul className="space-y-2">
        {items.map(p=>(
          <li key={p._id} className="p-3 border rounded">
            <Link className="font-medium" to={`/projects/${p._id}`}>{p.title}</Link>
            <div className="text-sm text-gray-600">Status: {p.status} — Budget: ${p.budget ?? '-'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

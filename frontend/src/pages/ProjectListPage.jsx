import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../axiosConfig';

export default function ProjectListPage() {
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get('/projects'); // http://localhost:5001/api/projects
        if (alive) setItems(data);
      } catch (e) {
        console.error(e);
        setErr(e?.message || 'Failed to fetch projects');
      }
    })();
    return () => { alive = false; };
  }, []);

  if (err) return <p style={{ color: 'red' }}>{err}</p>;
  if (!items.length) return <p>No projects yet.</p>;

  return (
    <ul>
      {items.map(p => (
        <li key={p._id}><Link to={`/projects/${p._id}`}>{p.title}</Link></li>
      ))}
    </ul>
  );
}

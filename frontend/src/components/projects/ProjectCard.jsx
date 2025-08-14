import { Link } from 'react-router-dom';

export default function ProjectCard({ p }) {
  const cover = p.images?.[0]?.url;
  return (
    <div className="card">
      {cover && <img src={cover} alt={p.title} />}
      <h3>{p.title}</h3>
      <p>{p.category} · ${p.budgetMin}–${p.budgetMax}</p>
      <Link to={`/projects/${p._id}`}>View details</Link>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

export default function Projects() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get("/projects").then(res => setItems(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          to="/projects/new"
          className="px-3 py-2 rounded bg-blue-600 text-white"
        >
          + New Project
        </Link>
      </div>

      <div className="grid gap-4">
        {items.map(p => (
          <div key={p._id} className="border rounded p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <span className="text-sm px-2 py-1 bg-gray-100 rounded">{p.status}</span>
            </div>
            <p className="text-gray-600 mt-1">{p.description}</p>
            <div className="text-sm mt-2">
              Budget: {p.budgetMin ?? "-"} – {p.budgetMax ?? "-"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

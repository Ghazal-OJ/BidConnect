import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axiosConfig";

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`/projects/${id}`);
        setProject(res.data);
      } catch (e) { console.error(e); }
    })();
  }, [id]);

  if (!project) return <div style={{padding:16}}>Loading…</div>;
  return (
    <div style={{padding:16}}>
      <h2>{project.title}</h2>
      <p>{project.description}</p>
    </div>
  );
}

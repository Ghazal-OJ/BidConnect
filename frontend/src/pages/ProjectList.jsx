import { useEffect, useState } from "react";
import axios from "../axiosConfig"; // اگر فایل axiosConfig.js داری؛ وگرنه از axios مستقیم استفاده کن

export default function ProjectList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/projects");
        setItems(res.data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  return (
    <div style={{padding:16}}>
      <h2>Projects</h2>
      <ul>
        {items.map(p => <li key={p._id}>{p.title}</li>)}
      </ul>
    </div>
  );
}

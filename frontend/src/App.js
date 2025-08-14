import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import ProjectDetails from './pages/ProjectDetails';
import { useAuth } from './context/AuthContext';

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}
function PublicOnly({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/projects" replace /> : children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <div className="p-4">
        <Routes>
          {/* قبل از لاگین */}
          <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

          {/* بعد از لاگین */}
          <Route path="/projects" element={<Protected><Projects /></Protected>} />
          <Route path="/projects/new" element={<Protected><NewProject /></Protected>} />
          <Route path="/projects/:id" element={<Protected><ProjectDetails /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

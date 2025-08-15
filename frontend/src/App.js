import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import ProjectDetails from './pages/ProjectDetails';
import EditProject from './pages/EditProject';
import Portfolio from './pages/Portfolio';

import { useAuth } from './context/AuthContext';

// Guard: only for logged-in users
function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

// Guard: only for logged-out users
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
          {/* Public (before login) */}
          <Route path="/" element={<PublicOnly><Landing /></PublicOnly>} />
          <Route path="/login" element={<PublicOnly><Login /></PublicOnly>} />
          <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

          {/* Private (after login) */}
          <Route path="/projects" element={<Protected><Projects /></Protected>} />
          <Route path="/projects/new" element={<Protected><NewProject /></Protected>} />
          <Route path="/projects/:id" element={<Protected><ProjectDetails /></Protected>} />
          <Route path="/projects/:id/edit" element={<Protected><EditProject /></Protected>} />  {/* ⬅️ added */}

          {/* Optional: only freelancers should manage their portfolio (the page itself should check role) */}
          <Route path="/portfolio" element={<Protected><Portfolio /></Protected>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

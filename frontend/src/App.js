import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Projects from './pages/Projects';
import NewProject from './pages/NewProject';
import ProjectDetails from './pages/ProjectDetails';
import { useAuth } from './context/AuthContext';
import ForgotPassword from './pages/ForgotPassword';
// اگر صفحه ResetPassword را ساختی:
import ResetPassword from './pages/ResetPassword';

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
          <Route path="/forgot-password" element={<PublicOnly><ForgotPassword /></PublicOnly>} />
          {/* اگر صفحه ResetPassword داری */}
          <Route path="/reset-password" element={<PublicOnly><ResetPassword /></PublicOnly>} />

          {/* بعد از لاگین */}
          <Route path="/projects" element={<Protected><Projects /></Protected>} />
          <Route path="/projects/new" element={<Protected><NewProject /></Protected>} />
          <Route path="/projects/:id" element={<Protected><ProjectDetails /></Protected>} />

          {/* مسیر پیش‌فرض */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

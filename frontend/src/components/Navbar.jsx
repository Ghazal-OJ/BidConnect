import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// اگر لوگوت png است، این خط را به png تغییر بده
import logo from '../assets/bidconnect-logo.png';

export default function Navbar() {
  const { token, user, logout } = useAuth();

  // قبل از لاگین: لوگو + دکمه‌های ورود/ثبت‌نام
  if (!token) {
    return (
      <nav className="flex items-center justify-between p-4 border-b bg-white">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <img src={logo} alt="BidConnect" className="h-7 w-7" />
          <span>BidConnect</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
          <Link to="/register" className="px-3 py-1 bg-blue-600 text-white rounded">
            Get started
          </Link>
        </div>
      </nav>
    );
  }

  // بعد از لاگین: منوی کامل
  return (
    <nav className="flex items-center gap-4 p-4 border-b bg-white">
      <Link to="/projects" className="flex items-center gap-2 font-semibold">
        <img src={logo} alt="BidConnect" className="h-6 w-6" />
        <span>BidConnect</span>
      </Link>

      <Link to="/projects">Projects</Link>
      {user?.role === 'client' && <Link to="/projects/new">Post a Project</Link>}

      <div className="ml-auto flex items-center gap-3">
        <span className="text-sm text-gray-700">Hi, {user?.name}</span>
        <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
      </div>
    </nav>
  );
}

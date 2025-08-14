// frontend/src/components/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// همون لوگوی خودت
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

  // بعد از لاگین
  return (
    <nav className="flex items-center justify-between p-4 border-b bg-white">
      <Link to="/" className="flex items-center gap-2 font-semibold">
        <img src={logo} alt="BidConnect" className="h-6 w-6" />
        <span>BidConnect</span>
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/projects">Projects</Link>

        {/* فقط employer می‌تواند پروژه ثبت کند */}
        {user?.role === 'employer' && (
          <Link to="/projects/new">Post a Project</Link>
        )}

        {/* فقط freelancer صفحهٔ پورتفولیو دارد */}
        {user?.role === 'freelancer' && (
          <Link to="/portfolio">My Portfolio</Link>
        )}

        <span className="text-sm text-gray-700">Hi, {user?.name}</span>
        <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
      </div>
    </nav>
  );
}

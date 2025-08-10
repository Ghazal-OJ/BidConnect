import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar(){
  const { user, logout } = useAuth();

  return (
    <nav className="flex gap-4 p-3 border-b">
      <Link to="/">BidConnect</Link>
      <Link to="/projects">Projects</Link>
      {user?.role === 'client' && <Link to="/projects/new">Post a Project</Link>}
      <div className="ml-auto">
        {user ? (
          <>
            <span className="mr-3">Hi, {user.name}</span>
            <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <span className="mx-1">|</span>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

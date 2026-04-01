import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <h2>FoodFlow</h2>
        <nav>
          <Link to="/">Dashboard</Link>
          <Link to="/submit">Submit Claim</Link>
          <Link to="/queue">Approval Queue</Link>
        </nav>
      </aside>
      <main className="content">
        <header className="topbar">
          <div>
            <strong>{user?.name}</strong>
            <p>{user?.role}</p>
          </div>
          <button onClick={logout}>Logout</button>
        </header>
        {children}
      </main>
    </div>
  );
};

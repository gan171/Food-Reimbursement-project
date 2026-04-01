import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <p className="brand-kicker">Workflow Suite</p>
          <h2>FoodFlow Pro</h2>
        </div>

        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/submit">Submit Claim</NavLink>
          <NavLink to="/queue">Approval Queue</NavLink>
          <NavLink to="/my-claims">My Claims</NavLink>
        </nav>
      </aside>

      <main className="content">
        <header className="topbar card">
          <div>
            <p className="muted">Signed in as</p>
            <strong>{user?.name}</strong>
            <p className="muted">{user?.department} · {user?.role}</p>
          </div>
          <button onClick={logout}>Logout</button>
        </header>
        {children}
      </main>
    </div>
  );
};

import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalClaims: 0, totalDisbursed: 0, slaBreaches: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!['IT_ADMIN', 'ACCOUNTS'].includes(user?.role)) return;

    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data))
      .catch((err) => setError(getErrorMessage(err, 'Could not load dashboard stats.')));
  }, [user?.role]);

  return (
    <div className="grid">
      <div className="card stat"><h3>My Role</h3><p>{user?.role}</p></div>
      <div className="card stat"><h3>Department</h3><p>{user?.department}</p></div>
      {['IT_ADMIN', 'ACCOUNTS'].includes(user?.role) ? (
        <>
          <div className="card stat"><h3>Total Claims (Month)</h3><p>{stats.totalClaims}</p></div>
          <div className="card stat"><h3>Total Disbursed</h3><p>₹{stats.totalDisbursed}</p></div>
          <div className="card span-2">
            <h3>SLA Breaches (&gt;3 days)</h3>
            {error && <p className="error">{error}</p>}
            {!stats.slaBreaches.length && !error ? <p className="muted">No SLA breaches 🎉</p> : null}
            {stats.slaBreaches.map((r) => (
              <div key={r.claim_id} className="list-row">{r.claim_id} · {r.current_stage} · {r.pendingDays}d</div>
            ))}
          </div>
        </>
      ) : (
        <div className="card span-2"><p className="muted">You do not have admin analytics access.</p></div>
      )}
    </div>
  );
};

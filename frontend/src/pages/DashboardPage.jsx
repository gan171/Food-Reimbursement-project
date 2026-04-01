import { useEffect, useState } from 'react';
import { api } from '../api/client';

export const DashboardPage = () => {
  const [stats, setStats] = useState({ totalClaims: 0, totalDisbursed: 0, slaBreaches: [] });

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data)).catch(() => {});
  }, []);

  return (
    <div className="grid">
      <div className="card stat"><h3>Total Claims (Month)</h3><p>{stats.totalClaims}</p></div>
      <div className="card stat"><h3>Total Disbursed</h3><p>₹{stats.totalDisbursed}</p></div>
      <div className="card">
        <h3>SLA Breaches</h3>
        {stats.slaBreaches.map((r) => (
          <div key={r.claim_id} className="list-row">{r.claim_id} · {r.current_stage} · {r.pendingDays}d</div>
        ))}
      </div>
    </div>
  );
};

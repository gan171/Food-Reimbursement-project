import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { getErrorMessage } from '../utils';

export const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/claims/mine')
      .then((res) => setClaims(res.data))
      .catch((err) => setError(getErrorMessage(err, 'Unable to load your claims.')));
  }, []);

  return (
    <section className="card">
      <h2>My Claims</h2>
      {error && <p className="error">{error}</p>}
      {!claims.length && !error ? <p className="muted">No claims submitted yet.</p> : null}
      {claims.map((claim) => (
        <div key={claim.id} className="list-row">
          <div>
            <strong>{claim.claim_id}</strong>
            <p className="muted">{claim.ot_date} · ₹{claim.amount_claimed}</p>
          </div>
          <span className={`pill ${claim.status.toLowerCase()}`}>{claim.status}</span>
        </div>
      ))}
    </section>
  );
};

import React, { useEffect, useState } from 'react';
import API from '../api';
import CandidateForm from '../components/CandidateForm';

export default function Candidates({ token, onLogout }) {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const r = await API.get('/candidates', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setList(r.data);
    } catch (e) {
      console.error('Error fetching candidates', e);
    }
  };

  useEffect(() => { fetchList(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onLogout}>Logout</button>
      <h3>Candidates</h3>
      <CandidateForm token={token} onCreated={fetchList} />
      <ul>
        {list.map(c => (
          <li key={c.id}>
            {c.first_name} {c.last_name} — {c.email} — {c.mobile}
            {c.resume_url && (
              <a href={c.resume_url} target="_blank" rel="noreferrer"> [resume]</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

import React, { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Candidates from './pages/Candidates';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  if (!token) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Simple SaaS Candidate Manager</h2>
        <Register />
        <hr />
        <Login onLogin={(t) => { setToken(t); }} />
      </div>
    );
  }

  return (
    <Candidates
      token={token}
      onLogout={() => {
        localStorage.removeItem('token');
        setToken(null);
      }}
    />
  );
}

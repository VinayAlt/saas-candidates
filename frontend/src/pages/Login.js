import React, { useState } from 'react';
import API from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async () => {
    try {
      const r = await API.post('/auth/login', { email, password });
      localStorage.setItem('token', r.data.token);
      onLogin(r.data.token);
    } catch (e) {
      setMsg('Login failed');
    }
  };

  return (
    <div>
      <h3>Login</h3>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
      <button onClick={submit}>Login</button>
      <div>{msg}</div>
    </div>
  );
}

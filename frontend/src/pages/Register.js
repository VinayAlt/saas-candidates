import React, { useState } from 'react';
import API from '../api';

export default function Register() {
  const [company_name, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const submit = async () => {
    try {
      await API.post('/auth/register', { company_name, email, password });
      setMsg('Registered successfully. Now login.');
    } catch (e) {
      setMsg('Registration failed');
    }
  };

  return (
    <div>
      <h3>Register Company</h3>
      <input placeholder="Company" value={company_name} onChange={e => setCompany(e.target.value)} /> <br />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} /> <br />
      <button onClick={submit}>Register</button>
      <div>{msg}</div>
    </div>
  );
}

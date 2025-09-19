import React, { useState } from 'react';
import API from '../api';

export default function CandidateForm({ token, onCreated }) {
  const [first_name, setFirst] = useState('');
  const [last_name, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [file, setFile] = useState(null);

  const submit = async () => {
    const fd = new FormData();
    fd.append('first_name', first_name);
    fd.append('last_name', last_name);
    fd.append('email', email);
    fd.append('mobile', mobile);
    if (file) fd.append('resume', file);

    try {
      await API.post('/candidates', fd, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFirst(''); setLast(''); setEmail(''); setMobile(''); setFile(null);
      onCreated();
    } catch (e) {
      console.error('Error creating candidate', e);
    }
  };

  return (
    <div>
      <h4>Create Candidate</h4>
      <input placeholder="First name" value={first_name} onChange={e => setFirst(e.target.value)} /> <br />
      <input placeholder="Last name" value={last_name} onChange={e => setLast(e.target.value)} /> <br />
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /> <br />
      <input placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} /> <br />
      <input type="file" onChange={e => setFile(e.target.files[0])} /> <br />
      <button onClick={submit}>Create</button>
    </div>
  );
}

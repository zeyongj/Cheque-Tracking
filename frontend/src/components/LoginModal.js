import React, { useState } from 'react';

function LoginModal({ onLogin }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div style={{
      position:'fixed',
      top:0, left:0,
      width:'100%', height:'100%',
      background:'rgba(0,0,0,0.5)',
      display:'flex',justifyContent:'center',alignItems:'center'
    }}>
      <div style={{background:'white',padding:'20px',borderRadius:'5px'}}>
        <h4>Enter Your Name</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={e=>setName(e.target.value)} />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;

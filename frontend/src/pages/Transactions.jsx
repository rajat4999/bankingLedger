import React, { useState } from 'react';
import { api } from '../api/client';
import { useParams, useNavigate } from 'react-router-dom';

export default function Transactions() {
  const { accountId } = useParams(); 
  const navigate = useNavigate();
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleTransfer = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: 'Processing...' });
    
    try {
      await api.createTransaction({
        fromAccount: accountId,
        toAccount,
        amount: Number(amount),
        idempotencyKey: crypto.randomUUID() 
      });
      setStatus({ type: 'success', msg: 'Transfer successful!' });
      setTimeout(() => navigate('/'), 2000); 
    } catch (err) {
      setStatus({ type: 'error', msg: `Error: ${err.message}` });
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginBottom: '20px' }}>&larr; Back to Dashboard</button>
      
      <h2>Transfer Funds</h2>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>Sending from: <code style={{ backgroundColor: '#1d1e20', padding: '4px' }}>{accountId}</code></p>
      
      <form onSubmit={handleTransfer} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input type="text" placeholder="Recipient Account ID" value={toAccount} onChange={(e) => setToAccount(e.target.value)} required style={inputStyle} />
        <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" style={inputStyle} />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Confirm Transfer
        </button>
      </form>
      
      {status.msg && (
        <p style={{ padding: '15px', marginTop: '20px', borderRadius: '4px', backgroundColor: status.type === 'error' ? '#fee2e2' : status.type === 'success' ? '#dcfce7' : '#f1f5f9', color: status.type === 'error' ? '#991b1b' : status.type === 'success' ? '#166534' : '#334155' }}>
          {status.msg}
        </p>
      )}
    </div>
  );
}

const inputStyle = { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '4px' };
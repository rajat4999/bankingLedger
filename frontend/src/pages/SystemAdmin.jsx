import React, { useState } from 'react';
import { api } from '../api/client';

export default function SystemAdmin() {
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleFundInjection = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: 'Processing...' });
    
    try {
      await api.systemFund({
        toAccount,
        amount: Number(amount),
        idempotencyKey: crypto.randomUUID()
      });
      setStatus({ type: 'success', msg: `Successfully injected ₹${amount} into ${toAccount}` });
      setToAccount('');
      setAmount('');
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
      <div style={{ padding: '30px', border: '2px solid #ef4444', borderRadius: '12px', backgroundColor: '#fef2f2' }}>
        <h2 style={{ color: '#b91c1c', marginTop: 0 }}>⚠️ System Admin Controls</h2>
        <p style={{ color: '#991b1b', marginBottom: '20px' }}>Inject initial funds directly into user accounts. This requires a System User token.</p>
        
        <form onSubmit={handleFundInjection} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input type="text" placeholder="Target Account ID" value={toAccount} onChange={(e) => setToAccount(e.target.value)} required style={inputStyle} />
          <input type="number" placeholder="Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} required min="1" style={inputStyle} />
          <button type="submit" style={{ backgroundColor: '#ef4444', color: 'white', padding: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Execute System Transfer
          </button>
        </form>

        {status.msg && (
          <p style={{ marginTop: '20px', color: status.type === 'error' ? '#b91c1c' : '#15803d', fontWeight: 'bold' }}>
            {status.msg}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = { padding: '12px', border: '1px solid #fca5a5', borderRadius: '4px' };
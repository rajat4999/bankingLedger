import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});

  const loadAccounts = async () => {
    try {
      const data = await api.getAccounts();
      setAccounts(data.accounts);
      
      data.accounts.forEach(async (acc) => {
        const balData = await api.getBalance(acc._id);
        setBalances((prev) => ({ ...prev, [acc._id]: balData.balance }));
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleCreateAccount = async () => {
    try {
      await api.createAccount();
      loadAccounts(); 
    } catch (error) {
      alert("Failed to create account");
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Your Accounts</h1>
        <button onClick={handleCreateAccount} style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Open New Account
        </button>
      </div>
      
      {accounts.length === 0 ? (
        <p>You have no accounts. Open one to get started.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {accounts.map((acc) => (
            <div key={acc._id} style={{ border: '1px solid #e2e8f0', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#64748b' }}>ACCOUNT ID</p>
              <p style={{ margin: '0 0 20px 0', fontFamily: 'monospace' }}>{acc._id}</p>
              
              <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b' }}>AVAILABLE BALANCE</p>
              <h2 style={{ margin: '0 0 20px 0', fontSize: '32px' }}>
                ₹ {balances[acc._id] !== undefined ? balances[acc._id].toLocaleString() : '...'}
              </h2>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ padding: '4px 8px', backgroundColor: acc.status === 'ACTIVE' ? '#dcfce7' : '#fee2e2', color: acc.status === 'ACTIVE' ? '#166534' : '#991b1b', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                  {acc.status}
                </span>
                
                {/* BUTTON CONTAINER */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => navigate(`/history/${acc._id}`)} style={{ padding: '8px 16px', backgroundColor: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer' }}>
                    History
                  </button>
                  <button onClick={() => navigate(`/transfer/${acc._id}`)} disabled={acc.status !== 'ACTIVE'} style={{ padding: '8px 16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: acc.status === 'ACTIVE' ? 'pointer' : 'not-allowed' }}>
                    Transfer
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
// src/pages/History.jsx
import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useParams, useNavigate } from 'react-router-dom';

export default function History() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.getHistory(accountId);
        setTransactions(data.transactions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [accountId]);

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6', marginBottom: '20px', padding: 0 }}>
        &larr; Back to Dashboard
      </button>

      <h2>Transaction History</h2>
      <p style={{ color: '#64748b', marginBottom: '30px' }}>
        Account: <code style={{ backgroundColor: '#292a2c', padding: '4px' }}>{accountId}</code>
      </p>

      {loading ? (
        <p>Loading transactions...</p>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : transactions.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
          <p style={{ color: '#64748b' }}>No transactions found for this account.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {transactions.map((tx) => (
            <div key={tx.transactionId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
              
              {/* Left Side: Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    {tx.type === 'CREDIT' ? 'Funds Received' : 'Funds Sent'}
                  </span>
                  <StatusBadge status={tx.status} />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span>{new Date(tx.date).toLocaleString()}</span>
                  <span>{tx.type === 'CREDIT' ? `From: ${tx.fromAccount}` : `To: ${tx.toAccount}`}</span>
                  <span style={{ fontFamily: 'monospace' }}>TXN ID: {tx.transactionId}</span>
                </div>
              </div>

              {/* Right Side: Amount */}
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: tx.type === 'CREDIT' ? '#16a34a' : '#dc2626' }}>
                {tx.type === 'CREDIT' ? '+' : '-'} ₹{tx.amount.toLocaleString()}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper component for colored status badges
function StatusBadge({ status }) {
  const styles = {
    COMPLETED: { bg: '#dcfce7', text: '#166534' },
    PENDING: { bg: '#fef9c3', text: '#854d0e' },
    FAILED: { bg: '#fee2e2', text: '#991b1b' },
    REVERSED: { bg: '#f3f4f6', text: '#374151' }
  };
  
  const currentStyle = styles[status] || styles.PENDING;

  return (
    <span style={{ padding: '2px 8px', backgroundColor: currentStyle.bg, color: currentStyle.text, borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
      {status}
    </span>
  );
}
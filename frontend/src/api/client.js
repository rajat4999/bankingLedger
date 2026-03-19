const BASE_URL = 'http://localhost:3000/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  const data = await response.json();
  
  if (!response.ok) throw new Error(data.message || 'API Error');
  return data;
};

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  // Accounts
  createAccount: () => request('/accounts', { method: 'POST' }),
  getAccounts: () => request('/accounts', { method: 'GET' }),
  getBalance: (accountId) => request(`/accounts/balance/${accountId}`, { method: 'GET' }),
  getHistory: (accountId) => request(`/accounts/${accountId}/transactions`, { method: 'GET' }),

  // Transactions
  createTransaction: (body) => request('/transactions', { method: 'POST', body: JSON.stringify(body) }),
  systemFund: (body) => request('/transactions/system/initial-funds', { method: 'POST', body: JSON.stringify(body) }),
};
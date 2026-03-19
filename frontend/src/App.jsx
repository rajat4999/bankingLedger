import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Auth from './pages/Auth'; 
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import SystemAdmin from './pages/SystemAdmin';
import History from './pages/History';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/auth" />;
};

// A wrapper to include the Navbar on authenticated routes
const AuthenticatedLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <AuthenticatedLayout><Dashboard /></AuthenticatedLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/transfer/:accountId" element={
            <ProtectedRoute>
              <AuthenticatedLayout><Transactions /></AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/admin/system-funds" element={
            <ProtectedRoute>
              <AuthenticatedLayout><SystemAdmin /></AuthenticatedLayout>
            </ProtectedRoute>
          } />

          <Route path="/history/:accountId" element={
            <ProtectedRoute>
              <AuthenticatedLayout><History /></AuthenticatedLayout>
            </ProtectedRoute>
          } />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
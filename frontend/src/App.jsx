import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { SubmitClaimPage } from './pages/SubmitClaimPage';
import { QueuePage } from './pages/QueuePage';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <LoginPage />;

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/submit" element={<SubmitClaimPage />} />
        <Route path="/queue" element={<QueuePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

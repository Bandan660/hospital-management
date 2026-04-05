import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/auth.store';
import DashboardLayout from './components/layout/LayoutDashboard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctor';
import Appointments from './pages/Appointment';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#0f172a',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"    element={<Dashboard />} />
          <Route path="patients"     element={<Patients />} />
          <Route path="doctors"      element={<Doctors />} />
          <Route path="appointments" element={<Appointments />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
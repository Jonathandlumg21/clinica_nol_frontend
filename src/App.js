import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PacientesPage from './pages/PacientesPage';
import ConsultasPage from './pages/ConsultasPage';
import UsuariosPage from './pages/UsuariosPage';

function SoloAdmin({ children }) {
  const { user } = useAuth();
  return user?.rol === 'admin' ? children : <Navigate to="/" replace />;
}

const layout = {
  app: { display: 'flex', minHeight: '100vh', background: '#f1f5f9' },
  main: { marginLeft: '220px', flex: 1, minHeight: '100vh' },
};

function AppLayout() {
  return (
    <div style={layout.app}>
      <Navbar />
      <main style={layout.main}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pacientes" element={<PacientesPage />} />
          <Route path="/consultas" element={<ConsultasPage />} />
          <Route path="/usuarios" element={<SoloAdmin><UsuariosPage /></SoloAdmin>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

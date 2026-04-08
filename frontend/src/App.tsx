import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LangProvider } from './context/LangContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import SubmitGrievance from './pages/SubmitGrievance';
import TrackGrievance from './pages/TrackGrievance';
import ForgotToken from './pages/ForgotToken';
import MinisterDashboard from './pages/MinisterDashboard';
import AdminPanel from './pages/AdminPanel';
import LoginPage from './pages/LoginPage';
import ScrollToTop from './components/ScrollToTop';

// ✅ y: -8 → page slides in from top, not bottom
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: -8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    transition={{ duration: 0.25 }}
  >
    {children}
  </motion.div>
);

const AppRoutes = () => {
  const location = useLocation();
  const { role } = useAuth();

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route
            path="/submit"
            element={role === "admin" ? <Navigate to="/admin" replace /> : <PageWrapper><SubmitGrievance /></PageWrapper>}
          />
          <Route
            path="/track"
            element={role === "admin" ? <Navigate to="/admin" replace /> : <PageWrapper><TrackGrievance /></PageWrapper>}
          />
          <Route
            path="/forgot-token"
            element={role === "admin" ? <Navigate to="/admin" replace /> : <PageWrapper><ForgotToken /></PageWrapper>}
          />
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="minister">
                <PageWrapper><MinisterDashboard /></PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <PageWrapper><AdminPanel /></PageWrapper>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <LangProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1"><AppRoutes /></main>
              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </Provider>
  );
}

export default App;
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'; // Corrected import
import './styles/index.css';
import Chatbot from './components/Chatbot.jsx';
import Dashboard from './components/Dashboard.jsx';
import { DefaultLayout } from './default_layout.jsx';
import 'leaflet/dist/leaflet.css';
import OrdersMapView from './components/OrdersMapView';
import CustomerServicePage from './components/CustomerServicePage.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import InventoryPage from './components/InventoryPage.jsx';
import SalesIncomePage from './components/SalesIncomePage.jsx';
import ReportsPage from './components/Reports.jsx'; // Corrected import
import Leaderboard from './components/Leaderboard.jsx';
import PaymentPage from './components/Payment.jsx';
import GrabAdsPage from './components/GrabAd.jsx';
import supabase from "./utils/supabaseClient.js"
import AuthComponent from './components/AuthComponent.jsx'; // Corrected import

//  Wrapper for auth
function AuthWrapper({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return session ? children : <Navigate to="/login" replace />;
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<AuthComponent />} />

        {/* Protected routes */}
        <Route element={<DefaultLayout />}>
          <Route
            index
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            }
          />
          <Route
            path="chat"
            element={
              <AuthWrapper>
                <Chatbot />
              </AuthWrapper>
            }
          />
          <Route
            path="orders"
            element={
              <AuthWrapper>
                <OrdersMapView />
              </AuthWrapper>
            }
          />
          {/* Add AuthWrapper to all other protected routes similarly */}
          <Route
            path="customer-service"
            element={
              <AuthWrapper>
                <CustomerServicePage />
              </AuthWrapper>
            }
          />
          <Route
            path="profile"
            element={
              <AuthWrapper>
                <ProfilePage />
              </AuthWrapper>
            }
          />
          <Route
            path="inventory"
            element={
              <AuthWrapper>
                <InventoryPage />
              </AuthWrapper>
            }
          />

          <Route
            path="sales-income"
            element={
              <AuthWrapper>
                <SalesIncomePage />
              </AuthWrapper>
            }
          />
          <Route
            path="reports"
            element={
              <AuthWrapper>
                <Leaderboard />
              </AuthWrapper>
            }
          />
          <Route
            path="payment"
            element={
              <AuthWrapper>
                <PaymentPage />
              </AuthWrapper>
            }
          />

          <Route
            path="ads"
            element={
              <AuthWrapper>
                <GrabAdsPage />
              </AuthWrapper>
            }
          />
          {/* Continue for all other protected routes... */}
        </Route>

        {/* Redirect to login for unknown routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
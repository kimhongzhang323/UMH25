import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './styles/index.css'
import Chatbot from './components/Chatbot.jsx'
import Dashboard from './components/Dashboard.jsx'
import { DefaultLayout } from './default_layout.jsx'
import 'leaflet/dist/leaflet.css'
import OrdersMapView from './components/OrdersMapView'
import CustomerServicePage from './components/CustomerServicePage.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import InventoryPage from './components/InventoryPage.jsx'
import SalesIncomePage from './components/SalesIncomePage.jsx'
import ReportsPage from './components/Reports.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import PaymentPage from './components/Payment.jsx'
import GrabAdsPage from './components/GrabAd.jsx'
import AuthComponent from './components/AuthComponent.jsx'
import AuthWrapper from './components/AuthWrapper.jsx'
import AddItem from './components/Additem.jsx'
import StaffManager from './components/StaffManagement.jsx'
import MenuGenerator from './components/Menu.jsx'

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
                <Navigate to="/chat" replace />
              </AuthWrapper>
            }
          />
          <Route
            path="/menu"
            element={
              <AuthWrapper>
                <MenuGenerator/>
              </AuthWrapper>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthWrapper>
                <Dashboard />
              </AuthWrapper>
            }
          />
          <Route
            path="/chat"
            element={
              <AuthWrapper>
                <Chatbot />
              </AuthWrapper>
            }
          />
          <Route
            path="/orders"
            element={
              <AuthWrapper>
                <OrdersMapView />
              </AuthWrapper>
            }
          />

          <Route
            path="/customer-service"
            element={
              <AuthWrapper>
                <CustomerServicePage />
              </AuthWrapper>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthWrapper>
                <ProfilePage />
              </AuthWrapper>
            }
          />
          <Route 
          
            path="/staff-manager"
            element={
              <AuthWrapper>
                <StaffManager />
              </AuthWrapper>
            }
          />
          <Route
            path="/inventory"
            element={
              <AuthWrapper>
                <InventoryPage />
              </AuthWrapper>
            }
          />
          <Route
            path="/add-item"
            element={
              <AuthWrapper>
                <AddItem />
              </AuthWrapper>
            }
          />

          <Route
            path="/sales-income"
            element={
              <AuthWrapper>
                <SalesIncomePage />
              </AuthWrapper>
            }
          />
          <Route
            path="/reports"
            element={
              <AuthWrapper>
                <ReportsPage />
              </AuthWrapper>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <AuthWrapper>
                <Leaderboard />
              </AuthWrapper>
            }
          />
          <Route
            path="/payment"
            element={
              <AuthWrapper>
                <PaymentPage />
              </AuthWrapper>
            }
          />
          <Route
            path="/ads"
            element={
              <AuthWrapper>
                <GrabAdsPage />
              </AuthWrapper>
            }
          />
        </Route>

        {/* Root redirect */}
        <Route
          path="/"
          element={
            <AuthWrapper>
              <Navigate to="/chat" replace />
            </AuthWrapper>
          }
        />

        <Route
          path="/logout"
          element={
            <AuthWrapper>
              <Navigate to="/login" replace />
            </AuthWrapper>
          }
        />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
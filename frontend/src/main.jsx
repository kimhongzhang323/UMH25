import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router'; // Corrected import
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="chat" element={<Chatbot />} />
          <Route path="orders" element={<OrdersMapView />} />
          <Route path="customer-service" element={<CustomerServicePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="sales-income" element={<SalesIncomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

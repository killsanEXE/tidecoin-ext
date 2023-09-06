import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Routes, Route, HashRouter } from 'react-router-dom';
import MainRoute from './pages/MainRoute';
import CreatePassword from './pages/account/account-pages/CreatePassword';
import Login from './pages/account/account-pages/Login';
import Wallet from 'pages/home/wallet/Wallet';
import Settings from 'pages/home/settings/Settings';
import Layout from 'pages/home/Layout';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App>
        <Routes>
          <Route path="account">
            <Route path="insert-password" element={<Login />} />
            <Route path="create-password" element={<CreatePassword />} />
          </Route>
          <Route path="/" element={<MainRoute />}>
            <Route path="/home" element={<Layout />}>
              <Route path="wallet" element={<Wallet />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </App>
    </HashRouter>
  </React.StrictMode>
);

reportWebVitals();

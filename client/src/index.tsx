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
import Settings from 'pages/home/settings/Wallet';
import Layout from 'pages/home/Layout';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <HashRouter>
      <App>
        <Routes>
          <Route path="/account">
            <Route path="insert-password" element={<Login />} />
            <Route path="create-password" element={<CreatePassword />} />
          </Route>
          <Route path="/" element={<MainRoute />}>
            <Route path="/" element={<Layout />}>
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
      </App>
    </HashRouter>

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

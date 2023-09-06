import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Routes, Route, HashRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/account/Login';
import Wallet from 'pages/home/wallet/Wallet';
import Settings from 'pages/home/settings/Settings';
import Layout from 'pages/home/Layout';
import CreatePassword from 'pages/account/CreatePassword';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "account",
        children: [
          { path: "insert-password", element: <Login /> },
          { path: "create-password", element: <CreatePassword /> }
        ]
      },
      {
        path: "home",
        element: <Layout />,
        children: [
          { path: "wallet", element: <Wallet /> },
          { path: "settings", element: <Settings /> }
        ]
      },
    ]
  },
]);

root.render(
  <RouterProvider router={router} />
);

reportWebVitals();

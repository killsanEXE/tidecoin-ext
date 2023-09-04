import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import MainRoute from './pages/MainRoute';
import CreatePassword from './pages/account/account-pages/CreatePassword';
import Login from './pages/account/account-pages/Login';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <MemoryRouter>
      <Routes>
          <Route path="/" element={<App />}>
          </Route>
          <Route path="account">
            <Route path="login" element={<Login />} />
            <Route path="create-password" element={<CreatePassword />} />
          </Route>
        </Routes>
    </MemoryRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

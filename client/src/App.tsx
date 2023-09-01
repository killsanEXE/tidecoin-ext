import React from 'react';
import logo from './logo.svg';
import './App.scss';
import Layout from './pages/Layout';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Login from './pages/account/Login';
import CreatePassword from './pages/account/CreatePassword';


function App() {
  return (
    <MemoryRouter>
      <Routes>
          <Route path="/" element={<Layout />}>
          </Route>
          <Route path="account">
            <Route path="login" element={<Login />} />
            <Route path="create-password" element={<CreatePassword />} />
          </Route>
        </Routes>
    </MemoryRouter>
  );
}

export default App;

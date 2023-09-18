import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Routes, Route, HashRouter, createHashRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/account/Login';
import CreateNewAccount from './components/create-new-account-component/CreateNewAccount';
import SwitchAccountComponent from './components/switch-account-component/SwitchAccountComponent';
import CreatePassword from './pages/account/CreatePassword';
import Layout from './pages/home/Layout';
import Settings from './pages/home/settings/Settings';
import Wallet from './pages/home/wallet/Wallet';
import eventBus from 'shared/eventBus';
import PortMessage from 'shared/utils/message/portMessage';
import { EVENTS } from 'shared/constant';
import { Message } from 'shared/utils';

export const initUi = () => {

  const { PortMessage } = Message;
  const portMessageChannel = new PortMessage();
  portMessageChannel.connect('popup');

  portMessageChannel.listen((data) => {
    if (data.type === 'broadcast') {
      eventBus.emit(data.method, data.params);
    }
  });

  eventBus.addEventListener(EVENTS.broadcastToBackground, (data) => {
    portMessageChannel.request({
      type: 'broadcast',
      method: data.method,
      params: data.data
    });
  });



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
            { path: "login", element: <Login /> },
            { path: "create-password", element: <CreatePassword /> }
          ]
        },
        {
          path: "home",
          element: <Layout />,
          children: [
            { path: "wallet", element: <Wallet /> },
            { path: "settings", element: <Settings /> },
          ]
        },
        { path: "switch-account", element: <SwitchAccountComponent /> },
        { path: "create-new-account", element: <CreateNewAccount /> },
      ]
    },
  ]);

  root.render(
    <RouterProvider router={router} />
  );

  reportWebVitals();
}
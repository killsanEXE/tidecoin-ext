import ReactLoading from 'react-loading';
import './App.scss';
import MainRoute from './pages/MainRoute';
import { useEffect, useState } from 'react';
import { useAppState } from 'shared/states/appState';
import { useNavigate } from 'react-router-dom';
import WalletIcon from 'components/icons/WalletIcon';


function App(props: any) {

  const {checkVault, isReady} = useAppState((v) => ({checkVault: v.checkVault, isReady: v.isReady}));

  const navigate = useNavigate();
  useEffect(() => {
    if(!isReady) checkVault();
  }, [isReady, checkVault]);

  return (
    <div className='app'>
      {isReady ? props.children : <ReactLoading type="spin" color="#fff" />}
    </div>
  );
}

export default App;
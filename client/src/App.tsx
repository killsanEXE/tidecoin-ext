import ReactLoading from 'react-loading';
import './App.scss';
import MainRoute from './pages/MainRoute';
import { useEffect, useState } from 'react';
import { useAppState } from 'shared/states/appState';
import { useNavigate } from 'react-router-dom';


function App() {

  const {checkVault, isReady} = useAppState((v) => ({checkVault: v.checkVault, isReady: v.isReady}));

  useEffect(() => {
    if (!isReady) checkVault();
  }, [isReady, checkVault])

  return (
    <div>
      {isReady ? <MainRoute /> : <ReactLoading type="spin" color="#fff" />}
    </div>
  );
}

export default App;
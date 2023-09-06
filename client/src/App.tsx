import ReactLoading from 'react-loading';
import './App.scss';
import { useEffect, useState } from 'react';
import { useAppState } from 'shared/states/appState';
import { useNavigate } from 'react-router-dom';


function App(props: any) {

  const {checkVault, isReady} = useAppState((v) => ({checkVault: v.checkVault, isReady: v.isReady}));

  const navigate = useNavigate();
  useEffect(() => {
    if(!isReady) checkVault();
    else navigate("/home")
  }, [isReady, checkVault]);

  return (
    <div className='app'>
      {isReady ? props.children : <ReactLoading type="spin" color="#fff" />}
    </div>
  );
}

export default App;
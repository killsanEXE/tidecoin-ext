import ReactLoading from 'react-loading';
import './App.scss';
import MainRoute from './pages/MainRoute';
import { useEffect } from 'react';
import { useAppState } from 'shared/states/appState';


function App() {

  const {checkVault, isReady} = useAppState((v) => ({checkVault: v.checkVault, isReady: v.isReady}));

  useEffect(() => {
    if (!isReady) {
      checkVault();
    }
  }, [isReady, checkVault])

  return (
    // <div>
    //   {appState.isReady ? <MainRoute /> : <ReactLoading type="spin" color="#fff" />}
    // </div>
    <MainRoute/>
  );
}

export default App;

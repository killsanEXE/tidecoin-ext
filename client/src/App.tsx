import ReactLoading from 'react-loading';
import './App.scss';
import MainRoute from './pages/MainRoute';
import { appStore } from './stores/appStore';


function App() {

  const appState = appStore();

  if(!appState.isReady){
    
  }

  return (
    <div>
      {appState.isReady ? <MainRoute/> : <ReactLoading type="spin" color="#fff" />}
    </div>
  );
}

export default App;

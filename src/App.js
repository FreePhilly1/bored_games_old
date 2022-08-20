import logo from './logo.svg';
import './App.css';
import HomeMenu from './components/HomeMenu';
import { SocketContext, socket } from './context/socket.js';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <HomeMenu/>
      </div>
    </SocketContext.Provider>
  );
}

export default App;

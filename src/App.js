import logo from './logo.svg';
import './App.css';
import { SocketContext, socket } from './contexts/socket.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages and components
import StartMenu from './pages/StartPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route 
              path="/"
              element={<StartMenu/>}
            ></Route>
            <Route
              path="/game/room"
              element={<GamePage/>}
            ></Route>
          </Routes>
        </BrowserRouter>
        
      </div>
    </SocketContext.Provider>
  );
}

export default App;

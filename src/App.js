import './App.css';
import { SocketContext, socket } from './contexts/socket.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages and components
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route 
              path="/"
              element={<StartPage/>}
            ></Route>
            <Route
              path="/room/:roomcode"
              element={<GamePage/>}
            ></Route>
          </Routes>
        </BrowserRouter>
        
      </div>
    </SocketContext.Provider>
  );
}

export default App;

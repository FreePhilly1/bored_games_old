import logo from './logo.svg';
import './App.css';
import { SocketContext, socket } from './contexts/socket.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages and components
import StartMenu from './pages/StartPage';
import Chat from './components/Chat';

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <BrowserRouter>
          <div>
            <Routes>
              <Route 
                path="/"
                element={<StartMenu/>}
              ></Route>
              <Route
                path="/game/:gameid"
                element={<Chat/>}
              ></Route>
            </Routes>
          </div>
        </BrowserRouter>
        
      </div>
    </SocketContext.Provider>
  );
}

export default App;

import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

//pages and components
import StartPage from './pages/StartPage';
import GamePage from './pages/GamePage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/"
            element={<StartPage/>}
          />
          <Route
            path="/room/:roomcode"
            element={<GamePage/>}
          />
        </Routes>
      </BrowserRouter>
      
    </div>
  );
}

export default App;

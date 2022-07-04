import {
  Routes,
  Route,
} from 'react-router-dom';
import LoginPage from './LoginPage';
import MainPage from './MainPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      </header>
        <Routes>
          <Route path="/">
            <Route index element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
    </div>
  );
}

export default App;

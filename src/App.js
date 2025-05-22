
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TestPage from './component/TestPage';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<TestPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

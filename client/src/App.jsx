import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/nav/Navbar';
import Register from './pages/Register';
import Trace from './pages/Trace';
import Record from './pages/Record';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/trace" element={<Trace />} />
        <Route path="/record" element={<Record />} />
  </Routes>
    </Router>
  );
}

export default App;

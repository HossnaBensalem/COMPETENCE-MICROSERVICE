import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateCompetence from './pages/CreateCompetence';
import EvaluateCompetence from './pages/EvaluateCompetence';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCompetence />} />
          <Route path="/evaluate/:id" element={<EvaluateCompetence />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
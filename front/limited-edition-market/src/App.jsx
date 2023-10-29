import React, {} from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';


function App() {

  return (
    <Router>
      <div className="app-container">
        <header className="app-header d-flex justify-content-between align-items-center">
          <h1 className="logo-text mx-auto">
            <Link to="/" onClick={() => window.location.reload()} className="no-decoration">
              한정판
            </Link>
          </h1>
          
        </header>
      </div>
    </Router>
  );
}

export default App;

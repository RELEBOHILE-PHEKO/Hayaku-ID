import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Navbar from './Components/Navbar.jsx';
import AppRoutes from './AppRoutes';
import { checkAuthStatus } from './Services/authService';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is already logged in when app loads
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="content">
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
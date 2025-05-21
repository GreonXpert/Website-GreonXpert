// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { Provider } from 'react-redux';
import theme from './theme';
import store from './store';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/Home';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            minHeight: '100vh'
          }}>
            <Navbar />
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Add more routes as needed */}
                <Route path="/about" element={<div>About Page</div>} />
                <Route path="/services" element={<div>Services Page</div>} />
                <Route path="/contact" element={<div>Contact Page</div>} />
                <Route path="/profile" element={<div>Profile Page</div>} />
                <Route path="/account" element={<div>Account Page</div>} />
                <Route path="/dashboard" element={<div>Dashboard Page</div>} />
                <Route path="*" element={<div>Page Not Found</div>} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}


export default App;
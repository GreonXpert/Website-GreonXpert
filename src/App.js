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
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import CompanyPage from './pages/CompanyPage';
import Solution from './pages/Solution';
import SustainabilityStoryPage from './pages/SustainabilityStoryPage';
import ProjectPage from './pages/ProjectPage';
import ProjectDetail from './components/Project/ProjectDetail';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
            <Box sx={{ flexGrow: 0 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/contact-us" element={<ContactPage />} />
                <Route path="/company" element={<CompanyPage />} />
                <Route path="/solutions" element={<Solution />} />
                <Route path="/projects" element={<ProjectPage />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                {/* Other routes remain the same */}

                  {/* Sustainability Stories Routes */}
                <Route path="/sustainability-stories" element={<SustainabilityStoryPage />} />
                <Route path="/sustainability-stories/:category" element={<SustainabilityStoryPage />} />
                <Route path="/sustainability-stories/:category/:storyId" element={<SustainabilityStoryPage />} />
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
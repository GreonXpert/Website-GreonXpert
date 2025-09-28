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
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/Terms&Service';
import CookiePolicy from './pages/CookiePolicy';
import FAQPage from './pages/Faq';
import CareerPage from './pages/Career';

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

                <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                <Route path='/terms' element={<TermsAndConditions/>}/>
                <Route path='/cookie-policy' element={<CookiePolicy/>}/>
                <Route path="/faq" element={<FAQPage/>}/>
                <Route path='/careers' element={<CareerPage/>}/>

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
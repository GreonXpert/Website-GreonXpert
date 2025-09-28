import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, useTheme, useMediaQuery, Fade, Grow, Grid, Divider,
  CircularProgress, Alert, Snackbar
} from '@mui/material';
import { keyframes } from '@emotion/react';
import WorkIcon from '@mui/icons-material/Work';
import axios from 'axios';

// Import components
import JobCard from '../components/Career/JobCard';
import JobDetailDialog from '../components/Career/JobDetailDialog';
import ApplicationForm from '../components/Career/ApplicationForm';
import NoOpenings from '../components/Career/NoOpenings';

// FIXED: Get API_BASE from your utils/api.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';
const API_URL = `${API_BASE}/api/careers`;

// Animations from TrustedByLeaders theme
const glitterAnimation = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0 rgba(255,255,255,0.4);
  }
  25% {
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4);
  }
  50% {
    transform: scale(1.1) rotate(-1deg);
    box-shadow: 0 0 30px rgba(255,255,255,1), 0 0 40px rgba(26, 201, 159, 0.6);
  }
  75% {
    transform: scale(1.05) rotate(1deg);
    box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4);
  }
  100% {
    transform: scale(1) rotate(0deg);
    box-shadow: 0 0 0 rgba(255,255,255,0.4);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const dividerGlow = keyframes`
  0% {
    opacity: 0.6;
    transform: scaleX(0.8);
  }
  50% {
    opacity: 1;
    transform: scaleX(1.1);
  }
  100% {
    opacity: 0.6;
    transform: scaleX(0.8);
  }
`;

const CareerPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State management
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollScale, setScrollScale] = useState(1);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailOpen, setJobDetailOpen] = useState(false);
  const [applicationFormOpen, setApplicationFormOpen] = useState(false);
  
  // Backend integration state
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '', severity: 'info' });

  // FIXED: Fetch jobs from backend with proper data handling
  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching jobs from:', API_URL);
      
      const response = await axios.get(API_URL, {
        params: {
          status: 'active', // Only get active jobs
          limit: 50, // Get enough jobs to display
          sort: '-featured,-createdAt' // Sort by featured first, then newest
        }
      });

      console.log('Raw API response:', response.data);

      if (response.data?.success) {
        // FIXED: Access the correct nested data structure
        const responseData = response.data.data;
        
        // Handle both possible response structures
        let jobsData;
        if (responseData && responseData.jobs) {
          // New structure: { data: { jobs: [...], pagination: {...} } }
          jobsData = responseData.jobs;
        } else if (Array.isArray(responseData)) {
          // Alternative structure: { data: [...] }
          jobsData = responseData;
        } else if (Array.isArray(response.data.data)) {
          // Direct array structure
          jobsData = response.data.data;
        } else {
          console.error('Unexpected data structure:', response.data);
          throw new Error('Invalid response structure from server');
        }

        console.log('Processed jobs data:', jobsData);

        // FIXED: Ensure jobsData is an array before calling map
        if (!Array.isArray(jobsData)) {
          console.error('Jobs data is not an array:', jobsData);
          throw new Error('Jobs data is not in the expected format');
        }
        
        // Format jobs with proper image URLs
        const formattedJobs = jobsData.map(job => ({
          ...job,
          // Fix image URL if it exists
          image: job.image ? 
            (job.image.startsWith('http') ? job.image : `${API_BASE}${job.image}`) :
            `https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80`, // Default image
          // Ensure required fields exist
          responsibilities: job.responsibilities || [],
          skills: job.skills || [],
          requirements: job.requirements || [],
          benefits: job.benefits || []
        }));

        console.log('Final formatted jobs:', formattedJobs);
        setJobs(formattedJobs);
        setError('');
        
        if (formattedJobs.length === 0) {
          console.log('No active jobs found');
        }
      } else {
        throw new Error(response.data?.message || 'Failed to fetch jobs');
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      
      let errorMessage = 'Failed to load job openings';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
      } else if (err.request) {
        // Network error
        errorMessage = 'Unable to connect to the server. Please check your internet connection.';
      } else if (err.message) {
        // Other error
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchJobs();
  }, []);

  // Handle scroll effects and animations
  useEffect(() => {
    // Stagger section animations
    const sections = ['header', 'jobs', 'notify'];
    sections.forEach((section, index) => {
      setTimeout(() => {
        setVisibleSections(prev => ({ ...prev, [section]: true }));
      }, index * 200);
    });

    // Scroll scale effect
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 300;
      const scale = Math.max(0.8, 1 - (scrollY / maxScroll) * 0.2);
      setScrollScale(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJobClick = (job) => {
    // Track job view
    trackJobView(job._id);
    setSelectedJob(job);
    setJobDetailOpen(true);
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setJobDetailOpen(false);
    setApplicationFormOpen(true);
  };

  const handleNotifyClick = () => {
    setSelectedJob(null);
    setApplicationFormOpen(true);
  };

  // Track job views
  const trackJobView = async (jobId) => {
    try {
      await axios.get(`${API_URL}/${jobId}`);
    } catch (err) {
      console.warn('Failed to track job view:', err);
    }
  };

  // Handle application success
  const handleApplicationSuccess = (message) => {
    setToast({ open: true, message, severity: 'success' });
    setApplicationFormOpen(false);
    // Optionally refresh jobs to update application counts
    fetchJobs();
  };

  // Handle application error
  const handleApplicationError = (message) => {
    setToast({ open: true, message, severity: 'error' });
  };

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity });
  };

  const handleToastClose = () => {
    setToast({ ...toast, open: false });
  };

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.grey[50]} 25%, ${theme.palette.background.default} 50%, ${theme.palette.grey[50]} 75%, ${theme.palette.background.default} 100%)`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '10%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}15 0%, transparent 70%)`,
          animation: `${glitterAnimation} 8s ease-in-out infinite`
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.secondary.main}15 0%, transparent 70%)`,
          animation: `${glitterAnimation} 10s ease-in-out infinite reverse`
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in={visibleSections.header} timeout={800}>
          <Box textAlign="center" mb={6}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
              <Box
                sx={{
                  p: 3,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: `${glitterAnimation} 3s ease-in-out infinite`
                }}
              >
                <WorkIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              </Box>
            </Box>

            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem', lg: '3.5rem' },
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
                animation: `${slideIn} 0.8s ease-out`
              }}
            >
              Join Our Mission
            </Typography>

             <Typography
                                      color="text.secondary"
                                      sx={{
                                        maxWidth: { xs: '95%', sm: '85%', md: '600px' },
                                        mx: 'auto',
                                        fontSize: { 
                                          xs: '0.75rem', 
                                          sm: '0.85rem', 
                                          md: '0.95rem', 
                                          lg: '1.2rem' 
                                        }, // Similar to TrustedByLeaders
                                        opacity: 0.8,
                                        lineHeight: 1.4,
                                        transform: `scale(${scrollScale})`,
                                        transition: 'transform 0.3s ease',
                                        px: { xs: 0.5, sm: 1 },
                                      }}
                                    >
              Shape the future of environmental technology. Join Greon Xpert and help organizations worldwide achieve their sustainability goals through innovative solutions.
            </Typography>

            {/* Decorative divider */}
            <Box
              sx={{
                width: '100px',
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                mx: 'auto',
                mt: 4,
                animation: `${dividerGlow} 3s ease-in-out infinite`
              }}
            />
          </Box>
        </Fade>

        {/* Current Openings Section */}
        <Fade in={visibleSections.jobs} timeout={1000}>
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h3"
              textAlign="center"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 1,
                fontSize: { xs: '1.8rem', md: '2.2rem' }
              }}
            >
              Current Opportunities
            </Typography>

            <Typography
              variant="body1"
              textAlign="center"
              color="text.secondary"
              sx={{
                maxWidth: '600px',
                mx: 'auto',
                mb: 5,
                lineHeight: 1.6
              }}
            >
              Discover exciting career opportunities in environmental technology and sustainability. Be part of the solution to climate change.
            </Typography>

            {/* Loading State */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
                <CircularProgress size={60} sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" sx={{ ml: 3, color: theme.palette.primary.main }}>
                  Loading opportunities...
                </Typography>
              </Box>
            )}

            {/* Error State */}
            {error && !loading && (
              <Box sx={{ mb: 4 }}>
                <Alert 
                  severity="error" 
                  sx={{ 
                    borderRadius: 3,
                    '& .MuiAlert-message': {
                      width: '100%',
                      textAlign: 'center'
                    }
                  }}
                  action={
                    <button
                      onClick={fetchJobs}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: theme.palette.error.main,
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      Retry
                    </button>
                  }
                >
                  <Typography variant="h6" gutterBottom>Unable to Load Job Openings</Typography>
                  <Typography variant="body2">{error}</Typography>
                </Alert>
              </Box>
            )}

            {/* Jobs Display */}
            {!loading && !error && jobs.length > 0 ? (
              // Job Listings - 3 cards per row
              <Grid container spacing={4}>
                {jobs.map((job, index) => (
                  <Grid item xs={12} md={6} lg={4} key={job._id}>
                    <JobCard
                      job={job}
                      index={index}
                      onJobClick={handleJobClick}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              // No Openings Component
              !loading && !error && (
                <Grow in timeout={1000}>
                  <Box>
                    <NoOpenings onNotifyClick={handleNotifyClick} />
                  </Box>
                </Grow>
              )
            )}
          </Box>
        </Fade>

        {/* Company Values Section */}
        <Fade in timeout={1200}>
          <Box sx={{ mt: 8, mb: 6 }}>
            <Typography
              variant="h4"
              textAlign="center"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 4,
                fontSize: { xs: '1.6rem', md: '2rem' }
              }}
            >
              Why Join Greon Xpert?
            </Typography>

            <Grid container spacing={4}>
              {[
                {
                  title: 'Impact-Driven Work',
                  description: 'Make a real difference in the fight against climate change through innovative technology solutions.'
                },
                {
                  title: 'Growth Opportunities',
                  description: 'Advance your career in the rapidly growing climate tech industry with continuous learning and development.'
                },
                {
                  title: 'Collaborative Environment',
                  description: 'Work with passionate professionals in a supportive, inclusive, and dynamic team environment.'
                },
                {
                  title: 'Cutting-Edge Technology',
                  description: 'Work with the latest technologies in AI, IoT, and cloud computing to build next-generation solutions.'
                }
              ].map((value, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Grow in timeout={1400 + index * 200}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}08, ${theme.palette.secondary.main}05)`,
                        border: `1px solid ${theme.palette.primary.main}20`,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: `0 8px 25px ${theme.palette.primary.main}15`
                        }
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.primary.main,
                          mb: 2
                        }}
                      >
                        {value.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {value.description}
                      </Typography>
                    </Box>
                  </Grow>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Job Detail Dialog */}
        <JobDetailDialog
          open={jobDetailOpen}
          onClose={() => setJobDetailOpen(false)}
          job={selectedJob}
          onApply={handleApplyClick}
        />

        {/* Application Form */}
        <ApplicationForm
          open={applicationFormOpen}
          onClose={() => setApplicationFormOpen(false)}
          selectedJob={selectedJob}
          onSuccess={handleApplicationSuccess}
          onError={handleApplicationError}
        />

        {/* Footer Note */}
        <Fade in timeout={1600}>
          <Box sx={{ mt: 8, textAlign: 'center' }}>
            <Divider sx={{ mb: 3, opacity: 0.3 }} />
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.8rem',
                opacity: 0.7,
                fontStyle: 'italic',
                mb: 2
              }}
            >
              Equal Opportunity Employer - Greon Xpert is committed to creating an inclusive environment for all employees regardless of race, gender, age, religion, sexual orientation, or disability status.
            </Typography>
            
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontSize: '0.75rem', opacity: 0.6 }}
            >
              © 2025 Greon Xpert Pvt Ltd. All rights reserved.
            </Typography>
          </Box>
        </Fade>
      </Container>

      {/* Toast Notifications */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toast.severity}
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CareerPage;

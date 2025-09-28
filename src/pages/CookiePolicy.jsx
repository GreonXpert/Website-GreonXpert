import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Fade,
  Grow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Link,
  Grid,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CookieIcon from '@mui/icons-material/Cookie';
import DescriptionIcon from '@mui/icons-material/Description';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import FunctionsIcon from '@mui/icons-material/Functions';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PublicIcon from '@mui/icons-material/Public';
import ChromeReaderModeIcon from '@mui/icons-material/ChromeReaderMode';
import WebIcon from '@mui/icons-material/Web';
import StorageIcon from '@mui/icons-material/Storage';
import TimerIcon from '@mui/icons-material/Timer';

// Animations from TrustedByLeaders theme
const glitterAnimation = keyframes`
  0% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(255,255,255,0.4); }
  25% { transform: scale(1.05) rotate(2deg); box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4); }
  50% { transform: scale(1.1) rotate(-1deg); box-shadow: 0 0 30px rgba(255,255,255,1), 0 0 40px rgba(26, 201, 159, 0.6); }
  75% { transform: scale(1.05) rotate(1deg); box-shadow: 0 0 20px rgba(255,255,255,0.8), 0 0 30px rgba(26, 201, 159, 0.4); }
  100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 rgba(255,255,255,0.4); }
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
  0% { opacity: 0.6; transform: scaleX(0.8); }
  50% { opacity: 1; transform: scaleX(1.1); }
  100% { opacity: 0.6; transform: scaleX(0.8); }
`;

const CookiePolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollScale, setScrollScale] = useState(1);

  useEffect(() => {
    // Stagger section animations
    const sections = ['header', 'overview', 'definitions', 'types', 'choices', 'browsers', 'info', 'contact'];
    sections.forEach((section, index) => {
      setTimeout(() => {
        setVisibleSections(prev => ({ ...prev, [section]: true }));
      }, index * 150);
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

  const cookieSections = [
    {
      id: 'overview',
      title: 'What Are Cookies?',
      icon: <InfoIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can 
            understand what type of cookies We use, or the information We collect using Cookies and how that information is used.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Cookies do not typically contain any information that personally identifies a user, but personal information 
            that we store about You may be linked to the information stored in and obtained from Cookies. For further 
            information on how We use, store and keep your personal data secure, see our Privacy Policy.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Security Notice:</strong> We do not store sensitive personal information, such as mailing addresses, 
              account passwords, etc. in the Cookies We use.
            </Typography>
          </Alert>
        </>
      )
    },
    {
      id: 'definitions',
      title: 'Interpretation and Definitions',
      icon: <DescriptionIcon />,
      content: (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
            Interpretation
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            The words whose initial letters are capitalized have meanings defined under the following conditions. 
            The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2, mt: 3 }}>
            Definitions
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            For the purposes of this Cookies Policy:
          </Typography>
          <List sx={{ mb: 3 }}>
            {[
              {
                term: 'Company',
                definition: '(referred to as either "the Company", "We", "Us" or "Our" in this Cookies Policy) refers to Greon Xpert Pvt Ltd, No:203, Ground floor Pallath Heights, Kalamassery, Ernakulam.'
              },
              {
                term: 'Cookies',
                definition: 'means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.'
              },
              {
                term: 'Website',
                definition: 'refers to greonxpert, accessible from www.greonxpert.com'
              },
              {
                term: 'You',
                definition: 'means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.'
              }
            ].map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5, alignItems: 'flex-start' }}>
                <ListItemIcon sx={{ minWidth: 30, mt: 0.5 }}>
                  <CheckCircleIcon sx={{ color: '#1AC99F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography component="div" sx={{ fontSize: '0.9rem' }}>
                      <strong style={{ color: theme.palette.primary.main }}>{item.term}:</strong> {item.definition}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        </>
      )
    },
    {
      id: 'types',
      title: 'The Use of Cookies',
      icon: <SettingsIcon />,
      content: (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
            Type of Cookies We Use
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies remain on your personal computer or 
            mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We use both session and persistent Cookies for the purposes set out below:
          </Typography>

          {[
            {
              title: 'Necessary / Essential Cookies',
              type: 'Session Cookies',
              admin: 'Us',
              purpose: 'These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.',
              color: '#e74c3c'
            },
            {
              title: 'Functionality Cookies',
              type: 'Persistent Cookies', 
              admin: 'Us',
              purpose: 'These Cookies allow us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.',
              color: '#1AC99F'
            }
          ].map((cookie, index) => (
            <Paper key={index} sx={{ p: 3, mb: 3, borderLeft: `4px solid ${cookie.color}`, backgroundColor: `${cookie.color}08` }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: cookie.color }}>
                {cookie.title}
              </Typography>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Type:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {cookie.type}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Administered by:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {cookie.admin}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Duration:
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {cookie.type === 'Session Cookies' ? 'Until browser closes' : 'Until manually deleted'}
                  </Typography>
                </Grid>
              </Grid>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
                Purpose:
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {cookie.purpose}
              </Typography>
            </Paper>
          ))}
        </>
      )
    },
    {
      id: 'choices',
      title: 'Your Choices Regarding Cookies',
      icon: <SecurityIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your 
            browser and then delete the Cookies saved in your browser associated with this website. You may use this 
            option for preventing the use of Cookies at any time.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some 
            features may not function properly.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            If You'd like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the 
            help pages of your web browser.
          </Typography>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Important:</strong> Disabling cookies may affect website functionality and your user experience.
            </Typography>
          </Alert>
        </>
      )
    },
    {
      id: 'browsers',
      title: 'Browser Cookie Management',
      icon: <WebIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            For specific instructions on managing cookies in your browser, please visit the following help pages:
          </Typography>

          <List sx={{ mb: 3 }}>
            {[
              {
                browser: 'Google Chrome',
                url: 'https://support.google.com/accounts/answer/32050',
                icon: <ChromeReaderModeIcon />
              },
              {
                browser: 'Internet Explorer',
                url: 'http://support.microsoft.com/kb/278835',
                icon: <WebIcon />
              },
              {
                browser: 'Mozilla Firefox',
                url: 'https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored',
                icon: <StorageIcon />
              },
              {
                browser: 'Apple Safari',
                url: 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac',
                icon: <SecurityIcon />
              }
            ].map((item, index) => (
              <ListItem key={index} sx={{ py: 1 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>
                  {React.cloneElement(item.icon, { sx: { color: '#1AC99F', fontSize: 24 } })}
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {item.browser}
                      </Typography>
                      <Link 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        sx={{ 
                          color: '#1AC99F', 
                          textDecoration: 'none', 
                          fontSize: '0.9rem',
                          '&:hover': { textDecoration: 'underline' } 
                        }}
                      >
                        Cookie Management Guide →
                      </Link>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
            For any other web browser, please visit your web browser's official web pages for cookie management instructions.
          </Typography>
        </>
      )
    },
    {
      id: 'info',
      title: 'More Information About Cookies',
      icon: <FunctionsIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            You can learn more about cookies and how they work by visiting external resources that provide comprehensive 
            information about cookie technology and privacy practices.
          </Typography>

          <Box sx={{ mt: 2, p: 3, backgroundColor: '#1AC99F15', borderRadius: 2, border: `1px solid ${theme.palette.primary.main}20` }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
              Additional Resources
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
              For more detailed information about cookies, their types, and how they affect your privacy, we recommend 
              consulting reputable web privacy resources and browser documentation.
            </Typography>
          </Box>

          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>Stay Informed:</strong> Cookie technology and privacy regulations are constantly evolving. 
              We recommend staying informed about your privacy rights and options.
            </Typography>
          </Alert>
        </>
      )
    }
  ];

  return (
    <Box
      sx={{
        py: { xs: 4, sm: 6, md: 8 },
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          ${theme.palette.background.default} 0%, 
          ${theme.palette.grey[50]} 25%, 
          ${theme.palette.background.default} 50%, 
          ${theme.palette.grey[50]} 75%, 
          ${theme.palette.background.default} 100%
        )`,
        position: 'relative',
        overflow: 'hidden',
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
          animation: `${glitterAnimation} 8s ease-in-out infinite`,
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
          animation: `${glitterAnimation} 10s ease-in-out infinite reverse`,
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
                  animation: `${glitterAnimation} 3s ease-in-out infinite`,
                }}
              >
                <CookieIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
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
                fontSize: { 
                  xs: '2rem', 
                  sm: '2.5rem', 
                  md: '3rem', 
                  lg: '3.5rem' 
                },
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
                animation: `${slideIn} 0.8s ease-out`,
              }}
            >
              Cookies Policy
            </Typography>
            
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: '800px',
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                opacity: 0.8,
                lineHeight: 1.6,
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
              }}
            >
              Learn how we use cookies to enhance your experience on our website
            </Typography>

            <Box sx={{ mt: 3, p: 2, backgroundColor: '#1AC99F15', borderRadius: 2, maxWidth: 400, mx: 'auto' }}>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1AC99F' }}>
                Last Updated: September 24, 2025
              </Typography>
            </Box>
            
            {/* Decorative divider */}
            <Box
              sx={{
                width: 100,
                height: 4,
                borderRadius: 2,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                mx: 'auto',
                mt: 4,
                animation: `${dividerGlow} 3s ease-in-out infinite`,
              }}
            />
          </Box>
        </Fade>

        {/* Cookie Policy Sections */}
        <Box sx={{ mt: 4 }}>
          {cookieSections.map((section, index) => (
            <Grow
              key={section.id}
              in={visibleSections[section.id]}
              timeout={1000 + index * 150}
            >
              <Accordion
                sx={{
                  mb: 3,
                  borderRadius: '16px !important',
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                  boxShadow: `0 8px 32px ${theme.palette.primary.main}08`,
                  border: `1px solid ${theme.palette.primary.main}20`,
                  '&::before': {
                    display: 'none',
                  },
                  '&:hover': {
                    boxShadow: `0 12px 40px ${theme.palette.primary.main}15`,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s ease',
                  }
                }}
                defaultExpanded={index === 0}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
                  sx={{
                    px: 4,
                    py: 2,
                    '& .MuiAccordionSummary-content': {
                      alignItems: 'center',
                      gap: 2,
                    },
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}05`,
                    }
                  }}
                >
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(section.icon, { 
                      sx: { fontSize: 24, color: theme.palette.primary.main } 
                    })}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.text.primary,
                      fontSize: { xs: '1rem', md: '1.2rem' },
                    }}
                  >
                    {section.title}
                  </Typography>
                </AccordionSummary>
                
                <AccordionDetails sx={{ px: 4, py: 3 }}>
                  {section.content}
                </AccordionDetails>
              </Accordion>
            </Grow>
          ))}
        </Box>

        {/* Contact Section */}
        <Fade in={visibleSections.contact} timeout={1200}>
          <Paper
            sx={{
              mt: 6,
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
              border: `2px solid ${theme.palette.primary.main}20`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.palette.primary.main}20 0%, transparent 70%)`,
              }}
            />
            
            <ContactMailIcon 
              sx={{ 
                fontSize: 48, 
                color: theme.palette.primary.main, 
                mb: 2,
                animation: `${glitterAnimation} 4s ease-in-out infinite`,
              }} 
            />
            
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            >
              Questions About Cookies?
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}
            >
              If you have any questions about this Cookies Policy, you can contact us:
            </Typography>

            <Box sx={{ mt: 3, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
              <List>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ContactMailIcon sx={{ color: '#1AC99F', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Link href="mailto:fazil@greonxpert.com" sx={{ color: '#1AC99F', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        fazil@greonxpert.com
                      </Link>
                    }
                  />
                </ListItem>
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PublicIcon sx={{ color: '#1AC99F', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Link href="https://www.greonxpert.com/contact-us" target="_blank" rel="noopener noreferrer" sx={{ color: '#1AC99F', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                        www.greonxpert.com/contact-us
                      </Link>
                    }
                  />
                </ListItem>
              </List>
            </Box>
          </Paper>
        </Fade>

        {/* Footer Note */}
        <Fade in timeout={1400}>
          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Divider sx={{ mb: 3, opacity: 0.3 }} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.8rem',
                opacity: 0.7,
                fontStyle: 'italic',
                mb: 2,
              }}
            >
              This Cookies Policy was last updated on September 24, 2025. We may update this policy from time to time 
              to reflect changes in our practices or applicable laws.
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.75rem',
                opacity: 0.6,
              }}
            >
              © 2025 Greon Xpert Pvt Ltd. All rights reserved.
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default CookiePolicy;

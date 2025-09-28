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
} from '@mui/material';
import { keyframes } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SecurityIcon from '@mui/icons-material/Security';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import CookieIcon from '@mui/icons-material/Cookie';
import ShareIcon from '@mui/icons-material/Share';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PolicyIcon from '@mui/icons-material/Policy';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import ShieldIcon from '@mui/icons-material/Shield';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import GavelIcon from '@mui/icons-material/Gavel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Animations from TrustedByLeaders
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

const PrivacyPolicy = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollScale, setScrollScale] = useState(1);

  useEffect(() => {
    // Stagger section animations
    const sections = ['header', 'overview', 'collection', 'usage', 'disclosure', 'cookies', 'rights', 'contact'];
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

  const privacySections = [
    {
      id: 'overview',
      title: 'Privacy Overview',
      icon: <PolicyIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            This Privacy Policy describes how <strong>Greon Xpert Pvt Ltd</strong> ("we", "us", or "our") collects, uses, and discloses your personal information when you visit, use our services, or communicate with us through <strong>www.greonxpert.com</strong>.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            By using our Services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy. If you do not agree to this Privacy Policy, please do not use our Services.
          </Typography>
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#1AC99F15', borderRadius: 2, borderLeft: '4px solid #1AC99F' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1AC99F' }}>
              Last Updated: September 2025
            </Typography>
          </Box>
        </>
      )
    },
    {
      id: 'collection',
      title: 'Information We Collect',
      icon: <DataUsageIcon />,
      content: (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
            Information We Collect Directly from You
          </Typography>
          <List sx={{ mb: 3 }}>
            {[
              'Basic contact details including your name, address, phone number, email',
              'Order information including billing address, shipping address, payment confirmation',
              'Account information including username, password, security questions',
              'Shopping information including items you view, cart contents, wishlist items',
              'Customer support information from your communications with us'
            ].map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <CheckCircleIcon sx={{ color: '#1AC99F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={item} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.9rem', 
                      color: 'text.secondary' 
                    } 
                  }} 
                />
              </ListItem>
            ))}
          </List>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
            Information We Collect Automatically
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We automatically collect certain information about your interaction with our Services ("Usage Data") through cookies, pixels, and similar technologies. This includes device information, browser information, IP address, and interaction patterns.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
            Information from Third Parties
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We may obtain information from third parties including payment processors, service providers who support our platform, and companies that provide analytics services to help us understand how our Services are used.
          </Typography>
        </>
      )
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      icon: <AccountCircleIcon />,
      content: (
        <>
          {[
            {
              title: 'Providing Products and Services',
              description: 'We use your personal information to process payments, fulfill orders, manage your account, arrange shipping, and enable you to use our features and post reviews.'
            },
            {
              title: 'Marketing and Advertising',
              description: 'We use your information for marketing and promotional purposes, including sending communications and showing you relevant advertisements.'
            },
            {
              title: 'Security and Fraud Prevention',
              description: 'We use your information to detect, investigate, and prevent fraudulent, illegal, or malicious activity to protect our Services and users.'
            },
            {
              title: 'Communication',
              description: 'We use your information to provide customer support, respond to inquiries, and improve our Services based on your feedback.'
            }
          ].map((use, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {use.title}
              </Typography>
              <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8, ml: 2 }}>
                {use.description}
              </Typography>
            </Box>
          ))}
        </>
      )
    },
    {
      id: 'cookies',
      title: 'Cookies and Tracking Technologies',
      icon: <CookieIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Like many websites, we use Cookies on our Site to power and improve our Services, remember your preferences, run analytics, and better understand user interaction with our platform.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Most browsers automatically accept Cookies by default, but you can choose to set your browser to remove or reject Cookies. Please note that removing or blocking Cookies may negatively impact your user experience and cause some features to work incorrectly.
          </Typography>
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#FF980015', borderRadius: 2, borderLeft: '4px solid #FF9800' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FF9800' }}>
              Cookie Management: You can manage your cookie preferences through your browser settings at any time.
            </Typography>
          </Box>
        </>
      )
    },
    {
      id: 'disclosure',
      title: 'How We Share Your Information',
      icon: <ShareIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We may disclose your personal information to third parties for legitimate purposes in the following circumstances:
          </Typography>
          <List sx={{ mb: 3 }}>
            {[
              'With vendors who perform services on our behalf (IT management, payment processing, customer support)',
              'With business and marketing partners to provide services and advertise to you',
              'When you direct or consent to disclosure to third parties',
              'With our affiliates or within our corporate group',
              'In connection with business transactions, legal obligations, or to protect our rights'
            ].map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <CheckCircleIcon sx={{ color: '#1AC99F', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={item} 
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      fontSize: '0.9rem', 
                      color: 'text.secondary' 
                    } 
                  }} 
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We do not sell your personal information to third parties for their own marketing purposes without your explicit consent.
          </Typography>
        </>
      )
    },
    {
      id: 'rights',
      title: 'Your Rights and Choices',
      icon: <GavelIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Depending on your location, you may have the following rights regarding your personal information:
          </Typography>
          {[
            {
              title: 'Right to Access/Know',
              description: 'You may request access to personal information we hold about you, including details about how we use and share your information.'
            },
            {
              title: 'Right to Delete',
              description: 'You may request that we delete personal information we maintain about you, subject to certain exceptions.'
            },
            {
              title: 'Right to Correct',
              description: 'You may request that we correct inaccurate personal information we maintain about you.'
            },
            {
              title: 'Right to Portability',
              description: 'You may request a copy of your personal information and ask us to transfer it to a third party in certain circumstances.'
            },
            {
              title: 'Right to Opt-Out',
              description: 'You may opt out of certain uses of your information, including marketing communications and targeted advertising.'
            }
          ].map((right, index) => (
            <Box key={index} sx={{ mb: 2.5 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                {right.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, ml: 2 }}>
                {right.description}
              </Typography>
            </Box>
          ))}
        </>
      )
    },
    {
      id: 'security',
      title: 'Data Security & Retention',
      icon: <ShieldIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no security measures are perfect or impenetrable.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We retain your personal information for as long as necessary to provide our Services, comply with legal obligations, resolve disputes, and enforce our agreements. The retention period varies depending on the type of information and the purpose for which it was collected.
          </Typography>
          <Box sx={{ mt: 2, p: 2, backgroundColor: '#e74c3c15', borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#e74c3c' }}>
              Security Notice: We recommend using secure channels when communicating sensitive information to us.
            </Typography>
          </Box>
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
                <PrivacyTipIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
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
              Privacy Policy
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
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </Typography>
            
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

        {/* Privacy Policy Sections */}
        <Box sx={{ mt: 4 }}>
          {privacySections.map((section, index) => (
            <Grow
              key={section.id}
              in={visibleSections[section.id]}
              timeout={1000 + index * 200}
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
              Questions About Your Privacy?
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}
            >
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              please don't hesitate to contact us. We're here to help and ensure your privacy is protected.
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Chip
                label="Contact Us"
                sx={{
                  px: 3,
                  py: 1,
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 20px ${theme.palette.primary.main}40`,
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => window.location.href = 'mailto:privacy@greonxpert.com'}
              />
            </Box>
          </Paper>
        </Fade>

        {/* Footer Note */}
        <Fade in timeout={1400}>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                fontSize: '0.8rem',
                opacity: 0.7,
                fontStyle: 'italic',
              }}
            >
              This Privacy Policy was last updated in September 2025. We may update this policy from time to time to reflect changes in our practices or applicable laws.
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default PrivacyPolicy;

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
} from '@mui/material';
import { keyframes } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GavelIcon from '@mui/icons-material/Gavel';
import DescriptionIcon from '@mui/icons-material/Description';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import LinkIcon from '@mui/icons-material/Link';
import BlockIcon from '@mui/icons-material/Block';
import WarningIcon from '@mui/icons-material/Warning';
import ShieldIcon from '@mui/icons-material/Shield';
import PublicIcon from '@mui/icons-material/Public';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UpdateIcon from '@mui/icons-material/Update';
import TranslateIcon from '@mui/icons-material/Translate';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SecurityIcon from '@mui/icons-material/Security';

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

const TermsAndConditions = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollScale, setScrollScale] = useState(1);

  useEffect(() => {
    // Stagger section animations
    const sections = ['header', 'definitions', 'acknowledgment', 'links', 'termination', 'liability', 'disclaimer', 'governing', 'disputes', 'compliance', 'severability', 'translation', 'changes', 'contact'];
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

  const termsSections = [
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
            The words of which the initial letter is capitalized have meanings defined under the following conditions. 
            The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2, mt: 3 }}>
            Definitions
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            For the purposes of these Terms and Conditions:
          </Typography>
          <List sx={{ mb: 3 }}>
            {[
              {
                term: 'Affiliate',
                definition: 'means an entity that controls, is controlled by or is under common control with a party, where "control" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority.'
              },
              {
                term: 'Country',
                definition: 'refers to: Kerala, India'
              },
              {
                term: 'Company',
                definition: '(referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Greon Xpert Pvt Ltd, No:203, Ground floor, Pallath Heights, Kalamassery, Ernakulam.'
              },
              {
                term: 'Device',
                definition: 'means any device that can access the Service such as a computer, a cellphone or a digital tablet.'
              },
              {
                term: 'Service',
                definition: 'refers to the Website.'
              },
              {
                term: 'Terms and Conditions',
                definition: '(also referred as "Terms") mean these Terms and Conditions that form the entire agreement between You and the Company regarding the use of the Service.'
              },
              {
                term: 'Third-party Social Media Service',
                definition: 'means any services or content (including data, information, products or services) provided by a third-party that may be displayed, included or made available by the Service.'
              },
              {
                term: 'Website',
                definition: 'refers to greonxpert, accessible from www.greonxpert.com'
              },
              {
                term: 'You',
                definition: 'means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.'
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
      id: 'acknowledgment',
      title: 'Acknowledgment',
      icon: <PersonIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            These are the Terms and Conditions governing the use of this Service and the agreement that operates between 
            You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the 
            use of the Service.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms 
            and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with 
            any part of these Terms and Conditions then You may not access the Service.
          </Typography>
          
          <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              <strong>Age Requirement:</strong> You represent that you are over the age of 18. The Company does not permit 
              those under 18 to use the Service.
            </Typography>
          </Alert>

          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Your access to and use of the Service is also conditioned on Your acceptance of and compliance with the Privacy 
            Policy of the Company. Our Privacy Policy describes Our policies and procedures on the collection, use and 
            disclosure of Your personal information when You use the Application or the Website and tells You about Your 
            privacy rights and how the law protects You. Please read Our Privacy Policy carefully before using Our Service.
          </Typography>
        </>
      )
    },
    {
      id: 'links',
      title: 'Links to Other Websites',
      icon: <LinkIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Our Service may contain links to third-party web sites or services that are not owned or controlled by the Company.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices 
            of any third party web sites or services. You further acknowledge and agree that the Company shall not be 
            responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in 
            connection with the use of or reliance on any such content, goods or services available on or through any such 
            web sites or services.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We strongly advise You to read the terms and conditions and privacy policies of any third-party web sites or 
            services that You visit.
          </Typography>

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#FF980015', borderRadius: 2, borderLeft: '4px solid #FF9800' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FF9800' }}>
              Disclaimer: Third-party websites have their own terms and conditions which are beyond our control.
            </Typography>
          </Box>
        </>
      )
    },
    {
      id: 'termination',
      title: 'Termination',
      icon: <BlockIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We may terminate or suspend Your access immediately, without prior notice or liability, for any reason 
            whatsoever, including without limitation if You breach these Terms and Conditions.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Upon termination, Your right to use the Service will cease immediately.
          </Typography>

          <Alert severity="error" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Notice:</strong> Termination may occur without prior warning for violation of these terms.
            </Typography>
          </Alert>
        </>
      )
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      icon: <WarningIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers 
            under any provision of this Terms and Your exclusive remedy for all of the foregoing shall be limited to the 
            amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable 
            for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, 
            damages for loss of profits, loss of data or other information, for business interruption, for personal injury, 
            loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party 
            software and/or third-party hardware used with the Service, or otherwise in connection with any provision of 
            this Terms), even if the Company or any supplier has been advised of the possibility of such damages and even 
            if the remedy fails of its essential purpose.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or 
            consequential damages, which means that some of the above limitations may not apply. In these states, each 
            party's liability will be limited to the greatest extent permitted by law.
          </Typography>

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#e74c3c15', borderRadius: 2, borderLeft: '4px solid #e74c3c' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#e74c3c' }}>
              Maximum Liability: Limited to $100 USD or the amount you paid for services, whichever is greater.
            </Typography>
          </Box>
        </>
      )
    },
    {
      id: 'disclaimer',
      title: '"AS IS" and "AS AVAILABLE" Disclaimer',
      icon: <ShieldIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty 
            of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf 
            of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, 
            whether express, implied, statutory or otherwise, with respect to the Service.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation 
            of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work 
            with any other software, applications, systems or services, operate without interruption, meet any performance 
            or reliability standards or be error free or that any errors or defects can or will be corrected.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable 
            statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. 
            But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest 
            extent enforceable under applicable law.
          </Typography>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Service Disclaimer:</strong> We provide our service "as is" without any warranties or guarantees.
            </Typography>
          </Alert>
        </>
      )
    },
    {
      id: 'governing',
      title: 'Governing Law',
      icon: <AccountBalanceIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            The laws of the Country, excluding its conflicts of law rules, shall govern this Terms and Your use of the 
            Service. Your use of the Application may also be subject to other local, state, national, or international laws.
          </Typography>

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#1AC99F15', borderRadius: 2, borderLeft: '4px solid #1AC99F' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#1AC99F' }}>
              Jurisdiction: These terms are governed by the laws of Kerala, India.
            </Typography>
          </Box>
        </>
      )
    },
    {
      id: 'disputes',
      title: 'Disputes Resolution',
      icon: <SecurityIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally 
            by contacting the Company.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2, mt: 3 }}>
            For European Union (EU) Users
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country 
            in which You are resident.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2, mt: 3 }}>
            United States Legal Compliance
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            You represent and warrant that (i) You are not located in a country that is subject to the United States 
            government embargo, or that has been designated by the United States government as a "terrorist supporting" 
            country, and (ii) You are not listed on any United States government list of prohibited or restricted parties.
          </Typography>
        </>
      )
    },
    {
      id: 'severability',
      title: 'Severability and Waiver',
      icon: <GavelIcon />,
      content: (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2 }}>
            Severability
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and 
            interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable 
            law and the remaining provisions will continue in full force and effect.
          </Typography>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: theme.palette.primary.main, mb: 2, mt: 3 }}>
            Waiver
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            Except as provided herein, the failure to exercise a right or to require performance of an obligation under 
            these Terms shall not affect a party's ability to exercise such right or require such performance at any time 
            thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach.
          </Typography>
        </>
      )
    },
    {
      id: 'translation',
      title: 'Translation Interpretation',
      icon: <TranslateIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            These Terms and Conditions may have been translated if We have made them available to You on our Service. 
            You agree that the original English text shall prevail in the case of a dispute.
          </Typography>

          <Box sx={{ mt: 2, p: 2, backgroundColor: '#FF980015', borderRadius: 2, borderLeft: '4px solid #FF9800' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#FF9800' }}>
              Language: English version takes precedence in case of translation discrepancies.
            </Typography>
          </Box>
        </>
      )
    },
    {
      id: 'changes',
      title: 'Changes to These Terms and Conditions',
      icon: <UpdateIcon />,
      content: (
        <>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is 
            material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. 
            What constitutes a material change will be determined at Our sole discretion.
          </Typography>
          <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
            By continuing to access or use Our Service after those revisions become effective, You agree to be bound by 
            the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the website 
            and the Service.
          </Typography>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Notice Period:</strong> Material changes will be communicated at least 30 days in advance.
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
                <GavelIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
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
              Terms and Conditions
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
              Please read these terms and conditions carefully before using our Service
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

        {/* Terms and Conditions Sections */}
        <Box sx={{ mt: 4 }}>
          {termsSections.map((section, index) => (
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
              Contact Us
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}
            >
              If you have any questions about these Terms and Conditions, you can contact us:
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
                <ListItem sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocationOnIcon sx={{ color: '#1AC99F', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="No:203, Ground floor, Pallath Heights, Kalamassery, Ernakulam, Kerala, India"
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.9rem',
                        color: 'text.secondary'
                      }
                    }}
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
              These Terms and Conditions were last updated on September 24, 2025. We may update these terms from time to time 
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

export default TermsAndConditions;

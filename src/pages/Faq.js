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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BusinessIcon from '@mui/icons-material/Business';
import EcoIcon from '@mui/icons-material/Nature';
import DevicesIcon from '@mui/icons-material/Devices';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import PaymentIcon from '@mui/icons-material/Payment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ConnectedCarIcon from '@mui/icons-material/ConnectedTv';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import CloudIcon from '@mui/icons-material/Cloud';
import CertificateIcon from '@mui/icons-material/Verified';

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

const FAQPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [visibleSections, setVisibleSections] = useState({});
  const [scrollScale, setScrollScale] = useState(1);

  useEffect(() => {
    // Stagger section animations
    const sections = ['header', 'company', 'products', 'technology', 'implementation', 'pricing', 'support'];
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

  const faqSections = [
    {
      id: 'company',
      title: 'About Greon Xpert',
      icon: <BusinessIcon />,
      faqs: [
        {
          question: 'What is Greon Xpert?',
          answer: 'Greon Xpert Private Limited is an environmental technology company founded in 2025 and based in Kerala, India. We specialize in AI-powered sustainability solutions, helping enterprises measure, reduce, and monetize their carbon emissions through comprehensive ESG management and decarbonization planning.',
          tags: ['Company', 'Overview']
        },
        {
          question: 'When was Greon Xpert established?',
          answer: 'Greon Xpert Private Limited was incorporated on March 4, 2025. Despite being a new company, we have quickly established ourselves as a leader in climate tech and sustainability software solutions.',
          tags: ['History']
        },
        {
          question: 'Where is Greon Xpert located?',
          answer: 'Our registered office is located at Door No. 230/A6, Pallath Heights, FACT Road, Kalamassery, Kanayannur, Ernakulam district, Kerala, India. We serve clients globally while being proudly based in India.',
          tags: ['Location', 'Contact']
        },
        {
          question: 'What is Greon Xpert\'s mission?',
          answer: 'Our mission is to enable sustainable transformation across industries by providing comprehensive environmental solutions. We aim to help organizations transition to a low-carbon economy through innovative technology, data-driven insights, and actionable sustainability strategies.',
          tags: ['Mission', 'Sustainability']
        }
      ]
    },
    {
      id: 'products',
      title: 'Our Products & Solutions',
      icon: <EcoIcon />,
      faqs: [
        {
          question: 'What is Zero Carbon?',
          answer: 'Zero Carbon is our flagship AI-powered SaaS platform for automated Scope 1, 2, and 3 greenhouse gas accounting. It integrates data from IoT devices, energy systems, travel records, and procurement to provide comprehensive decarbonization planning and access to carbon credit marketplaces.',
          tags: ['Zero Carbon', 'AI', 'GHG Accounting']
        },
        {
          question: 'How does ESG Link help with compliance?',
          answer: 'ESG Link is our comprehensive SaaS platform that automates ESG reporting, data collection, and materiality analysis. It ensures compliance with major frameworks including BRSR, GRI, TCFD, and other international standards, streamlining your sustainability reporting process.',
          tags: ['ESG Link', 'Compliance', 'Reporting']
        },
        {
          question: 'What hardware solutions do you offer?',
          answer: 'We provide three main hardware solutions: Greon Connect (environmental monitoring communication controller), Greon Meter (energy measurement with multiple protocol support), and Greon Track (vehicle telematics for fuel consumption and CO₂ emissions tracking).',
          tags: ['Hardware', 'IoT', 'Monitoring']
        },
        {
          question: 'How do your products work together?',
          answer: 'Our products form an integrated ecosystem: hardware devices collect real-time environmental data, which feeds into our software platforms for analysis, reporting, and strategic planning. This creates a complete end-to-end solution from data capture to carbon market participation.',
          tags: ['Integration', 'Ecosystem', 'Data Flow']
        }
      ]
    },
    {
      id: 'technology',
      title: 'Technology & Standards',
      icon: <SmartToyIcon />,
      faqs: [
        {
          question: 'What technologies power your solutions?',
          answer: 'Our solutions leverage cutting-edge technologies including Artificial Intelligence for automated analysis, Internet of Things (IoT) for real-time data collection, cloud-based SaaS platforms for scalability, and advanced analytics for actionable insights.',
          tags: ['AI', 'IoT', 'SaaS', 'Analytics']
        },
        {
          question: 'Which standards and frameworks do you support?',
          answer: 'We ensure compliance with global standards including ISO 14064, GHG Protocol, BRSR (Business Responsibility and Sustainability Reporting), GRI (Global Reporting Initiative), TCFD (Task Force on Climate-related Financial Disclosures), and other major ESG frameworks.',
          tags: ['Standards', 'ISO', 'GHG Protocol', 'TCFD']
        },
        {
          question: 'How accurate is your emissions measurement?',
          answer: 'Our AI-powered systems provide highly accurate emissions measurement by combining real-time IoT data, industry-standard emission factors, and advanced algorithms. We follow internationally recognized methodologies to ensure precision and reliability in all measurements.',
          tags: ['Accuracy', 'Measurement', 'Verification']
        },
        {
          question: 'Is your platform secure?',
          answer: 'Yes, security is our top priority. Our platforms implement enterprise-grade security measures including data encryption, secure communication protocols, access controls, and regular security audits to protect your sensitive environmental and business data.',
          tags: ['Security', 'Data Protection', 'Encryption']
        }
      ]
    },
    {
      id: 'implementation',
      title: 'Implementation & Integration',
      icon: <IntegrationInstructionsIcon />,
      faqs: [
        {
          question: 'How long does implementation take?',
          answer: 'Implementation timelines vary based on your organization\'s size and requirements. Typically, software deployment takes 2-4 weeks, while hardware installation and integration can take 4-8 weeks. We provide dedicated support throughout the entire process.',
          tags: ['Implementation', 'Timeline', 'Support']
        },
        {
          question: 'Can you integrate with our existing systems?',
          answer: 'Absolutely! Our solutions are designed for seamless integration with existing enterprise systems, ERP platforms, energy management systems, and IoT infrastructure. We provide APIs and custom integration services to ensure smooth connectivity.',
          tags: ['Integration', 'APIs', 'ERP', 'Compatibility']
        },
        {
          question: 'Do you provide training and support?',
          answer: 'Yes, we offer comprehensive training programs for your team, including platform usage, data interpretation, and report generation. Our ongoing support includes technical assistance, regular updates, and strategic guidance for your sustainability initiatives.',
          tags: ['Training', 'Support', 'Guidance']
        },
        {
          question: 'What industries do you serve?',
          answer: 'We serve diverse industries including manufacturing, energy, transportation, real estate, hospitality, healthcare, and more. Our flexible solutions can be customized to meet the specific sustainability challenges and regulatory requirements of any sector.',
          tags: ['Industries', 'Manufacturing', 'Energy', 'Healthcare']
        }
      ]
    },
    {
      id: 'pricing',
      title: 'Pricing & Plans',
      icon: <PaymentIcon />,
      faqs: [
        {
          question: 'How is your pricing structured?',
          answer: 'We offer flexible pricing models including subscription-based SaaS plans, hardware purchase or lease options, and custom enterprise packages. Pricing is based on factors like organization size, number of facilities, data points monitored, and specific feature requirements.',
          tags: ['Pricing', 'Subscription', 'Enterprise']
        },
        {
          question: 'Do you offer trial periods?',
          answer: 'Yes, we provide trial periods and pilot programs to help you evaluate our solutions. This allows you to experience the platform\'s capabilities and see the value before making a full commitment.',
          tags: ['Trial', 'Pilot', 'Evaluation']
        },
        {
          question: 'Are there any setup fees?',
          answer: 'Setup fees vary depending on the complexity of your implementation. We provide transparent pricing with no hidden costs. Our team will work with you to create a customized proposal that fits your budget and requirements.',
          tags: ['Setup Fees', 'Transparent Pricing']
        },
        {
          question: 'Do you offer ROI guarantees?',
          answer: 'While we cannot guarantee specific ROI figures, our solutions typically help organizations achieve significant cost savings through energy efficiency improvements, carbon credit revenue, and streamlined compliance processes. We provide ROI projections during the consultation phase.',
          tags: ['ROI', 'Cost Savings', 'Efficiency']
        }
      ]
    },
    {
      id: 'support',
      title: 'Support & Services',
      icon: <SupportAgentIcon />,
      faqs: [
        {
          question: 'What support do you provide after implementation?',
          answer: 'We provide comprehensive ongoing support including 24/7 technical assistance, regular system updates, performance monitoring, strategic consulting, and help with regulatory compliance. Our customer success team ensures you maximize the value from our solutions.',
          tags: ['24/7 Support', 'Consulting', 'Updates']
        },
        {
          question: 'How do you handle system maintenance?',
          answer: 'System maintenance is handled proactively through our cloud-based infrastructure. We perform regular updates, security patches, and performance optimizations with minimal downtime. Hardware maintenance is included in our service agreements.',
          tags: ['Maintenance', 'Updates', 'Cloud']
        },
        {
          question: 'Can you help with carbon credit trading?',
          answer: 'Yes, our Zero Carbon platform includes access to carbon credit marketplaces. We provide guidance on carbon credit generation, verification processes, and trading strategies to help you monetize your emission reduction efforts.',
          tags: ['Carbon Credits', 'Trading', 'Monetization']
        },
        {
          question: 'Do you provide consulting services?',
          answer: 'Absolutely! Beyond our technology solutions, we offer strategic sustainability consulting, decarbonization planning, ESG strategy development, and regulatory compliance guidance to help you achieve your environmental goals.',
          tags: ['Consulting', 'Strategy', 'Compliance']
        }
      ]
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
                <HelpOutlineIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
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
              Frequently Asked Questions
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
              Everything you need to know about Greon Xpert's environmental solutions and services
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

        {/* FAQ Sections */}
        <Box sx={{ mt: 4 }}>
          {faqSections.map((section, sectionIndex) => (
            <Grow
              key={section.id}
              in={visibleSections[section.id]}
              timeout={1000 + sectionIndex * 150}
            >
              <Paper
                sx={{
                  mb: 4,
                  borderRadius: 4,
                  overflow: 'hidden',
                  background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
                  boxShadow: `0 8px 32px ${theme.palette.primary.main}08`,
                  border: `1px solid ${theme.palette.primary.main}20`,
                }}
              >
                {/* Section Header */}
                <Box
                  sx={{
                    p: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
                    borderBottom: `1px solid ${theme.palette.primary.main}20`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '12px',
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {React.cloneElement(section.icon, { 
                        sx: { fontSize: 28, color: theme.palette.primary.main } 
                      })}
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: theme.palette.primary.main,
                        fontSize: { xs: '1.5rem', md: '1.8rem' },
                      }}
                    >
                      {section.title}
                    </Typography>
                  </Box>
                </Box>

                {/* FAQ Items */}
                <Box sx={{ p: 2 }}>
                  {section.faqs.map((faq, faqIndex) => (
                    <Accordion
                      key={faqIndex}
                      sx={{
                        mb: 2,
                        borderRadius: '12px !important',
                        background: 'transparent',
                        boxShadow: `0 2px 8px ${theme.palette.primary.main}05`,
                        border: `1px solid ${theme.palette.primary.main}15`,
                        '&::before': {
                          display: 'none',
                        },
                        '&:hover': {
                          boxShadow: `0 4px 16px ${theme.palette.primary.main}10`,
                          transform: 'translateY(-1px)',
                          transition: 'all 0.3s ease',
                        }
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon sx={{ color: theme.palette.primary.main }} />}
                        sx={{
                          px: 3,
                          py: 1.5,
                          '&:hover': {
                            backgroundColor: `${theme.palette.primary.main}05`,
                          }
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            fontSize: { xs: '0.95rem', md: '1.1rem' },
                            pr: 2,
                          }}
                        >
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      
                      <AccordionDetails sx={{ px: 3, py: 2 }}>
                        <Typography
                          variant="body1"
                          sx={{
                            color: 'text.secondary',
                            lineHeight: 1.7,
                            mb: 2,
                          }}
                        >
                          {faq.answer}
                        </Typography>
                        
                        {/* Tags */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {faq.tags.map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              sx={{
                                backgroundColor: `${theme.palette.primary.main}15`,
                                color: theme.palette.primary.main,
                                fontSize: '0.75rem',
                                fontWeight: 500,
                                '&:hover': {
                                  backgroundColor: `${theme.palette.primary.main}25`,
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              </Paper>
            </Grow>
          ))}
        </Box>

        {/* Contact Section */}
        <Fade in timeout={1200}>
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
            
            <SupportAgentIcon 
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
              Still Have Questions?
            </Typography>
            
            <Typography
              variant="body1"
              color="text.secondary"
              paragraph
              sx={{ maxWidth: 600, mx: 'auto', lineHeight: 1.8 }}
            >
              Can't find what you're looking for? Our sustainability experts are here to help you understand 
              how Greon Xpert can transform your organization's environmental impact.
            </Typography>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Chip
                label="Schedule a Demo"
                clickable
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
                onClick={() => window.location.href = '/contact-us'}
              />
              
              <Chip
                label="Contact Support"
                clickable
                variant="outlined"
                sx={{
                  px: 3,
                  py: 1,
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
                onClick={() => window.location.href = 'mailto:support@greonxpert.com'}
              />
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
              This FAQ was last updated on September 24, 2025. Our solutions and services continue to evolve 
              to meet the changing needs of environmental sustainability.
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

export default FAQPage;

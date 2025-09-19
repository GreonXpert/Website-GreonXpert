import React from 'react';
import {
  Box,
  Container,
  Typography,
  useTheme,
  useMediaQuery,
  Grid,
  Stack,
  IconButton,
  Dialog,
  DialogContent,
  Button,
  Chip,
  Fade,
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { motion, AnimatePresence, m } from 'framer-motion';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';

/* ==================== Team Image ===================== */
import CEO from '../../assests/Team/CEO.png';
import CTO from '../../assests/Team/CTO.jpg';
import Manager from '../../assests/Team/Justin.jpg';
import Nimisha from '../../assests/Team/Nimisha.jpg';
import Ashley from '../../assests/Team/Ashley.jpg';

/* ===================== Animations ===================== */
const fadeInUp = keyframes`
  0% { opacity: 0; transform: translateY(30px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 5px rgba(26,201,159,0.3); }
  50% { box-shadow: 0 0 20px rgba(26,201,159,0.6), 0 0 30px rgba(26,201,159,0.4); }
  100% { box-shadow: 0 0 5px rgba(26,201,159,0.3); }
`;

/* ===================== Enhanced Team Data ===================== */
const rawTeam = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop&crop=faces",
    alt: "Man in a pink t-shirt",
    role: "Project Coordinator",
    name: "Daniel",
    bio: "Daniel coordinates our projects with precision, ensuring timely delivery and quality results.",
    description: "Daniel brings over 8 years of experience in project management and team coordination. He has successfully managed complex software development projects across various industries, from fintech startups to enterprise solutions. His expertise lies in agile methodologies, risk assessment, and stakeholder communication. Daniel's strategic approach to project planning has consistently delivered results 20% ahead of schedule. He holds certifications in PMP and Scrum Master, and is passionate about creating efficient workflows that empower teams to achieve their full potential while maintaining high-quality standards.",
    specialised: [
      "Agile & Scrum Methodologies",
      "Risk Management & Assessment",
      "Stakeholder Communication",
      "Resource Planning & Allocation",
      "Quality Assurance Processes",
      "Team Leadership & Mentoring",
      "Budget Management",
      "Timeline Optimization"
    ]
  },
  {
    id: 2,
    src: Manager,
    alt: "Woman smiling at the camera",
    role: "Manager",
    name: "Justin",
    bio: "Justin manages our operations with expertise, driving efficiency and team excellence.",
    description: "Justin is a dynamic operations manager with a proven track record of transforming business processes and driving organizational growth. With 10+ years in operations management, she has led teams of 50+ employees and managed budgets exceeding $5M annually. Her analytical mindset and people-first approach have resulted in 35% improvement in operational efficiency and 40% increase in employee satisfaction scores. Justin specializes in process optimization, change management, and building high-performance teams. She holds an MBA in Operations Management and is certified in Lean Six Sigma.",
    specialised: [
      "Operations Strategy & Planning",
      "Process Optimization",
      "Change Management",
      "Performance Analytics",
      "Team Development",
      "Lean Six Sigma",
      "Budget Management",
      "Vendor Relations"
    ]
  },
  {
    id: 3,
    src: CEO,
    alt: "Adhil Farhan",
    role: "CEO & Founder",
    name: "Adhil Farhan",
    bio: "Adhil is the visionary behind our company, leading with passion and innovative thinking.",
    description: "Adhil Farhan is a visionary entrepreneur and technology leader with over 15 years of experience in building and scaling successful tech companies. As CEO & Founder, she has raised over $50M in funding and grown the company from a startup to a market leader serving 100,000+ customers globally. Her strategic vision combines deep technical expertise with business acumen, having previously founded two successful startups that were acquired by Fortune 500 companies. Adhil is passionate about democratizing technology and creating solutions that make a meaningful impact on businesses and communities worldwide.",
    specialised: [
      "Strategic Vision & Leadership",
      "Business Development",
      "Investor Relations",
      "Product Strategy",
      "Market Expansion",
      "Team Building & Culture",
      "Innovation Management",
      "Public Speaking & Thought Leadership"
    ]
  },
  {
    id: 4,
    src: CTO,
    alt: "Fazil",
    role: "CTO & Founder",
    name: "Mohamed Fazil",
    bio: "Fazil drives our technical vision, architecting solutions that power our platform.",
    description: "Mohamed Fazil is a distinguished technology executive and system architect with 12+ years of experience in designing and implementing large-scale distributed systems. As CTO & Co-Founder, he leads a team of 80+ engineers and oversees the technical infrastructure serving millions of users daily. His expertise spans cloud architecture, machine learning, and cybersecurity. Fazil has published 15+ technical papers and holds 8 patents in distributed computing. He previously led engineering teams at Google and Amazon, where he architected systems processing petabytes of data. His technical leadership has been instrumental in achieving 99.99% uptime and sub-100ms response times.",
    specialised: [
      "System Architecture & Design",
      "Cloud Computing (AWS, GCP, Azure)",
      "Machine Learning & AI",
      "Distributed Systems",
      "Cybersecurity & Data Privacy",
      "DevOps & Infrastructure",
      "Technical Leadership",
      "Performance Optimization"
    ]
  },
  {
    id: 5,
    src: Ashley,
    alt: "Ashley",
    role: "Software Developer",
    name: "Ashley",
    bio: "Ashley builds amazing user experiences with clean, efficient code and creative solutions.",
    description: "Ashley is a passionate full-stack developer with 6+ years of experience creating beautiful, user-centric web applications. She specializes in modern JavaScript frameworks and has contributed to open-source projects with over 10,000+ GitHub stars. Her work focuses on accessibility, performance optimization, and creating seamless user experiences. Ashley has led the development of our flagship product's frontend, which serves 2M+ daily active users. She's an advocate for inclusive design and has spoken at 20+ tech conferences about frontend best practices. Her code has been featured in several tech publications for its elegance and efficiency.",
    specialised: [
      "React & Next.js Development",
      "TypeScript & JavaScript",
      "UI/UX Implementation",
      "Performance Optimization",
      "Accessibility (a11y)",
      "Responsive Design",
      "Testing & Quality Assurance",
      "Open Source Contribution"
    ]
  },
  {
    id: 6,
    src: Nimisha,
    alt: "Nimisha",
    role: "Software Developer",
    name: "Nimisha",
    bio: "Nimisha crafts robust backend systems that ensure our platform runs smoothly and securely.",
    description: "Nimisha is a backend engineering specialist with 7+ years of experience building scalable, high-performance server-side applications. He has architected microservices handling 100M+ API requests daily and designed database systems managing petabytes of data. His expertise in cloud-native technologies and containerization has reduced infrastructure costs by 40% while improving system reliability. Nimisha is passionate about clean code, test-driven development, and mentoring junior developers. He has contributed to several open-source database projects and is recognized for his expertise in distributed systems and data engineering within the developer community.",
    specialised: [
      "Backend API Development",
      "Database Design & Optimization",
      "Microservices Architecture",
      "Docker & Kubernetes",
      "Python & Node.js",
      "Data Engineering",
      "System Performance Tuning",
      "Security & Authentication"
    ]
  },
];

/* Desktop 3D Layout Helpers */
const transformByOffset = {
  0: 'rotateY(0deg) translateZ(0px) translateX(0%)',
  5: 'rotateY(18deg) translateZ(-110px) translateX(-120%)',
  4: 'rotateY(28deg) translateZ(-200px) translateX(-240%)',
  1: 'rotateY(-18deg) translateZ(-110px) translateX(120%)',
  2: 'rotateY(-28deg) translateZ(-200px) translateX(240%)',
  3: 'rotateY(-40deg) translateZ(-280px) translateX(360%)',
};

const zByOffset = { 0: 100, 5: 60, 1: 55, 4: 40, 2: 35, 3: 20 };
const sizeByOffset = (offset) => (offset === 0 ? { w: 200, h: 260 } : { w: 180, h: 240 });
const getOffset = (index, activeIndex, len) => ((index - activeIndex) % len + len) % len;

/* ===================== Background Colors for Center Changes ===================== */
const backgroundColors = [
   // Default (keeping your original)
  '#F0FDFB', // Very light tint of primary (#1AC99F) - almost white with hint of turquoise
  '#E6FFFA', // Light tint of primary - subtle turquoise background
  '#F0FDFA', // Another primary tint - very light mint
  '#F7FFFE', // Ultra light primary tint - barely visible turquoise
  '#F3FFFE', // Light secondary tint (#2E8B8B) - subtle teal
  '#EDF9F9', // Light secondary variation - soft teal background
];

/* ===================== Team Detail Dialog ===================== */
const TeamDetailDialog = ({ open, onClose, member }) => {
  if (!member) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          backgroundColor: '#FAFAFA',
          boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.9)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Image Section */}
          <Box sx={{ flex: { xs: 'none', md: '0 0 400px' }, position: 'relative' }}>
            <Box
              component="img"
              src={member.src}
              alt={member.alt}
              sx={{
                width: '100%',
                height: { xs: 300, md: 500 },
                objectFit: 'cover',
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                p: 3,
                display: { xs: 'block', md: 'none' }
              }}
            >
              <Typography variant="caption" sx={{ color: '#A7F3D0', fontWeight: 700, letterSpacing: 1 }}>
                {member.role}
              </Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 800 }}>
                {member.name}
              </Typography>
            </Box>
          </Box>

          {/* Details Section */}
          <Box sx={{ flex: 1, p: 4 }}>
            {/* Header - Hidden on mobile (shown on image overlay) */}
            <Box sx={{ display: { xs: 'none', md: 'block' }, mb: 3 }}>
              <Typography
                variant="caption"
                sx={{
                  color: '#1ac99f',
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  display: 'block',
                  mb: 1
                }}
              >
                {member.role}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1f2937', mb: 2 }}>
                {member.name}
              </Typography>
            </Box>

            {/* Description */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>
                About
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#6b7280',
                  lineHeight: 1.7,
                  fontSize: '0.95rem'
                }}
              >
                {member.description}
              </Typography>
            </Box>

            {/* Specializations */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#374151', mb: 2 }}>
                Specializations
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {member.specialised.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    sx={{
                      backgroundColor: '#E6FFFA',
                      color: '#0D9488',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      '&:hover': {
                        backgroundColor: '#CCFBF1',
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

/* ===================== Team Image (Desktop Card) ===================== */
const TeamImage = ({ image, offset, hovered, onHover, onLeave, onMoreClick }) => {
  const isActive = hovered === offset;
  const isDimmed = hovered !== null && hovered !== offset;
  const { w, h } = sizeByOffset(offset);
  const isCenterItem = offset === 0;

  return (
    <Box
      onMouseEnter={() => onHover(offset)}
      onMouseLeave={onLeave}
      sx={{
        position: 'absolute',
        transition: 'transform 0.35s ease, box-shadow 0.35s ease, filter 0.35s ease, opacity 0.25s ease',
        borderRadius: '12px',
        overflow: 'hidden',
        transform: `${transformByOffset[offset]}${isActive ? ' scale(1.08)' : ''}`,
        zIndex: isActive ? 150 : zByOffset[offset],
        boxShadow: isActive
          ? '0 18px 45px rgba(0,0,0,0.28)'
          : isCenterItem
          ? '0 12px 28px rgba(0,0,0,0.18)'
          : '0 10px 20px rgba(0,0,0,0.1)',
        outline: isActive
          ? '2px solid rgba(26,201,159,0.9)'
          : isCenterItem
          ? '2px solid rgba(26,201,159,0.3)'
          : '2px solid transparent',
        opacity: isDimmed ? 0.7 : 1,
        filter: isDimmed ? 'grayscale(10%) brightness(0.95)' : 'none',
        cursor: 'pointer',
      }}
    >
      <Box
        component="img"
        src={image.src}
        alt={image.alt}
        sx={{
          width: { xs: 140, md: w },
          height: { xs: 180, md: h },
          objectFit: 'cover',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* More Button */}
      <Button
        onClick={() => onMoreClick(image)}
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          minWidth: 60,
          height: 28,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          color: 'white',
          fontSize: '0.7rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          transition: 'all 0.3s ease',
          opacity: isActive || isCenterItem ? 1 : 0,
          '&:hover': {
            backgroundColor: 'rgba(26, 201, 159, 0.2)',
            borderColor: 'rgba(26, 201, 159, 0.5)',
            animation: `${glowAnimation} 2s infinite`,
            transform: 'scale(1.05)',
          }
        }}
      >
        More
      </Button>

      {/* Hover Overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-end',
          p: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.35), rgba(0,0,0,0))',
          opacity: isActive ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none',
          textAlign: 'center',
        }}
      >
        <Stack spacing={0.5} sx={{ width: '100%' }}>
          <Typography
            variant="caption"
            sx={{
              color: '#A7F3D0',
              letterSpacing: 0.8,
              fontWeight: 800,
              textTransform: 'uppercase',
            }}
          >
            {image.role}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: '#FFFFFF', fontWeight: 800, lineHeight: 1.1 }}
          >
            {image.name}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: '#E5E7EB',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3
            }}
          >
            {image.bio}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

/* ===================== Mobile Team Card ===================== */
const MobileTeamCard = ({ image, index, onMoreClick }) => {
  const isCEO = image.role === "CEO & Founder";
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
    >
      <Box
        sx={{
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: isCEO ? '0 12px 32px rgba(0,0,0,0.15)' : '0 8px 24px rgba(0,0,0,0.1)',
          border: isCEO ? '2px solid rgba(26,201,159,0.3)' : '1px solid rgba(0,0,0,0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: isCEO ? 'scale(1.03)' : 'scale(1.01)',
          }
        }}
      >
        <Box
          component="img"
          src={image.src}
          alt={image.alt}
          sx={{
            width: '100%',
            height: isCEO ? 280 : 240,
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* More Button for Mobile */}
        <Button
          onClick={() => onMoreClick(image)}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            minWidth: 60,
            height: 28,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            color: 'white',
            fontSize: '0.7rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
            '&:hover': {
              backgroundColor: 'rgba(26, 201, 159, 0.2)',
              borderColor: 'rgba(26, 201, 159, 0.5)',
              animation: `${glowAnimation} 2s infinite`,
            }
          }}
        >
          More
        </Button>

        <Box
          onClick={() => setExpanded(v => !v)}
          sx={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            background: expanded
              ? 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.4), transparent)'
              : 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.25), transparent)',
            p: 3,
            cursor: 'pointer'
          }}
        >
          <Stack spacing={0.5} alignItems="center">
            <Typography variant="caption" sx={{ color: '#A7F3D0', fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase' }}>
              {image.role}
            </Typography>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.2 }}>
              {image.name}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: '#E5E7EB',
                display: '-webkit-box',
                WebkitLineClamp: expanded ? 'unset' : 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              {image.bio}
            </Typography>
            <Typography variant="caption" sx={{ color: '#D1FAE5', opacity: 0.9, mt: 0.5 }}>
              {expanded ? 'Tap to collapse' : 'Tap to read more'}
            </Typography>
          </Stack>
        </Box>
      </Box>
    </motion.div>
  );
};

/* ===================== Navigation Arrow ===================== */
const NavigationArrow = ({ direction, onClick }) => (
  <IconButton
    onClick={onClick}
    sx={{
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      [direction === 'left' ? 'left' : 'right']: -60,
      width: 48,
      height: 48,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: 200,
      transition: 'all 0.25s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)',
        transform: 'translateY(-50%) scale(1.05)',
      },
    }}
    aria-label={direction === 'left' ? 'Previous' : 'Next'}
  >
    {direction === 'left'
      ? <ArrowBackIosIcon sx={{ color: '#374151', fontSize: 20 }} />
      : <ArrowForwardIosIcon sx={{ color: '#374151', fontSize: 20 }} />}
  </IconButton>
);

/* ===================== Main Teams Component ===================== */
const Teams = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const team = React.useMemo(() => rawTeam.slice(), []);
  const len = team.length;
  
  const CEO_NAME = "Adhil Farhan";
  const initialCenter = React.useMemo(() => {
    const i = team.findIndex(m => m.name === CEO_NAME);
    return i >= 0 ? i : 0;
  }, [team]);

  const [activeIndex, setActiveIndex] = React.useState(initialCenter);
  const [hoveredOffset, setHoveredOffset] = React.useState(null);
  const [paused, setPaused] = React.useState(false);
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Dynamic background color based on center member
  const currentBgColor = backgroundColors[activeIndex % backgroundColors.length];

  // Auto-rotation
  React.useEffect(() => {
    if (paused || isMobile) return;
    const id = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % len);
    }, 3000);
    return () => clearInterval(id);
  }, [paused, len, isMobile]);

  const next = React.useCallback(() => {
    setActiveIndex(i => (i + 1) % len);
  }, [len]);

  const prev = React.useCallback(() => {
    setActiveIndex(i => (i - 1 + len) % len);
  }, [len]);

  const handleMouseEnter = () => setPaused(true);
  const handleMouseLeave = () => setPaused(false);

  const handleMoreClick = (member) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: currentBgColor,
        color: '#374151',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        pt: { xs: 8, md: 16 },
        pb: 4,
        transition: 'background-color 0.8s ease',
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', width: '100%', maxWidth: '1152px', mx: 'auto' }}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '2.5rem', md: '4rem', lg: '5rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#1f2937',
                mb: 1,
              }}
            >
              Meet Our Amazing Team
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                fontWeight: 700,
                lineHeight: 1.1,
                color: '#1f2937',
                mb: 3,
              }}
            >
              Supercharge Your Workflow
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 3,
                fontSize: { xs: '1rem', md: '1.125rem' },
                color: '#6b7280',
                maxWidth: '512px',
                mx: 'auto',
                lineHeight: 1.6,
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              All-in-one platform to plan, collaborate, and deliver — faster and smarter.
            </Typography>
          </motion.div>

          {/* Desktop: 3D Carousel */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Box
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                  mt: 12,
                  height: 380,
                  position: 'relative',
                  perspective: '1200px',
                  maxWidth: 1000,
                  mx: 'auto',
                }}
              >
                <NavigationArrow direction="left" onClick={prev} />
                <NavigationArrow direction="right" onClick={next} />
                
                <Box
                  sx={{
                    transformStyle: 'preserve-3d',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2rem 0',
                    position: 'relative',
                    height: '100%',
                    transition: 'all 0.5s ease',
                  }}
                >
                  {team.map((member, index) => {
                    const offset = getOffset(index, activeIndex, len);
                    return (
                      <TeamImage
                        key={member.id}
                        image={member}
                        offset={offset}
                        hovered={hoveredOffset}
                        onHover={setHoveredOffset}
                        onLeave={() => setHoveredOffset(null)}
                        onMoreClick={handleMoreClick}
                      />
                    );
                  })}
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Mobile: 2 per row grid */}
          {isMobile && (
            <Box sx={{ mt: 8 }}>
              <Grid container spacing={2} justifyContent="center">
                {team.map((member, index) => (
                  <Grid item xs={6} key={member.id}>
                    <MobileTeamCard 
                      image={member} 
                      index={index}
                      onMoreClick={handleMoreClick}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>

      {/* Team Detail Dialog */}
      <TeamDetailDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        member={selectedMember}
      />
    </Box>
  );
};

export default Teams;

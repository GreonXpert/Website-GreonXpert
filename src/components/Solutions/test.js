// src/components/Solutions/SolutionHero.jsx
import React from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PauseRounded from '@mui/icons-material/PauseRounded';
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded';
import { AnimatePresence, motion } from 'framer-motion';

/* ===================== Data (4 images import) ===================== */
import img1 from '../../assests/Solutions/ESGLink.jpg';
import img2 from '../../assests/Solutions/ZeroCarbon.png';
import img3 from '../../assests/Solutions/GreonMeter.jpg';
import img4 from '../../assests/Solutions/GreonConnect.jpg'

/* ===================== Slides (4 images like your ref) ===================== */
const slides = [
  {
    id: 1,
    image:
      img1, // fox
    overline: 'ESGLink',
    titleLines: ['BRSR'],
    subtitle:
      "A swift, solitary icon of wilderness. Explore textures, colors, and motion captured in the wild.",
    cta: 'See This Creative Gallery',
  },
  {
    id: 2,
    image:
      img2, // lions
    overline: 'ZeroCarbon',
    titleLines: ['Emission', 'Reduction', 'Decarbonization'],
    subtitle:
      "A family moving as one—power and presence in a single frame. Discover the story behind the shot.",
    cta: 'See This Creative Gallery',
  },
  {
    id: 3,
    image:
      img3, // cat
    overline: 'Greon Meter',
    titleLines: ['Felis', 'Catus'],
    subtitle:
      'Quiet curiosity in soft light. Minimal distractions, maximum emotion in a single glance.',
    cta: 'See This Creative Gallery',
  },
  {
    id: 4,
    image:
      img4, // sheep field
    overline: 'Greon Connect',
    titleLines: ['Ovis', 'Aries'],
    subtitle:
      'Rolling pastures and patient motion. A calm palette with layered depth across the frame.',
    cta: 'See This Creative Gallery',
  },
];

/* ===================== Motion presets ===================== */
const bgVariants = {
  enter: { opacity: 0, scale: 1.04 },
  center: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.55, ease: 'easeIn' } },
};

const textUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: 'easeOut' } },
};

/* ===================== Helper ===================== */
const clamp = (n, len) => ((n % len) + len) % len;

export default function SolutionHero() {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));

  // *** REDUCED TIME FROM 3000ms TO 1800ms FOR FASTER TRANSITIONS ***
  const intervalMs = 1800;
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [progress, setProgress] = React.useState(0); // 0..1

  const len = slides.length;
  const active = slides[index];

  const next = React.useCallback(() => setIndex((i) => clamp(i + 1, len)), [len]);
  const prev = React.useCallback(() => setIndex((i) => clamp(i - 1, len)), [len]);
  const goTo = (i) => setIndex(clamp(i, len));

  // progress + autoplay (pause on hover/hold)
  React.useEffect(() => {
    let id;
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      if (!paused) {
        setProgress((p) => {
          const np = p + dt / intervalMs;
          if (np >= 1) {
            // advance & restart
            setTimeout(next, 0);
            return 0;
          }
          return np;
        });
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [paused, next]);

  // reset progress on slide change
  React.useEffect(() => setProgress(0), [index]);

  // filmstrip indices (prev, current, next)
  const prevIdx = clamp(index - 1, len);
  const nextIdx = clamp(index + 1, len);

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        position: 'relative',
        height: { xs: '100vh', md: '100vh' },
        overflow: 'hidden',
        color: '#fff',
        backgroundColor: '#0f0f0f',
      }}
    >
      {/* Background crossfade */}
      <AnimatePresence mode="wait">
        <Box
          key={active.id}
          component={motion.div}
          variants={bgVariants}
          initial="enter"
          animate="center"
          exit="exit"
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${active.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'saturate(95%) contrast(105%)',
          }}
        />
      </AnimatePresence>

      {/* Enhanced Scrim for legibility */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(0,0,0,.3) 0%, rgba(0,0,0,.6) 60%, rgba(0,0,0,.75) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'grid',
          gridTemplateRows: '1fr auto',
          alignItems: 'center',
          pt: { xs: 8, md: 10 },
          pb: { xs: 4, md: 6 },
        }}
      >
        {/* Headline / Copy */}
        <Box sx={{ alignSelf: 'center' }}>
          <Stack spacing={2} sx={{ maxWidth: 760 }}>
            <motion.div key={`over-${active.id}`} variants={textUp} initial="hidden" animate="show">
              <Chip
                label={active.overline}
                sx={{
                  color: '#fff',
                  fontWeight: 800,
                  letterSpacing: 1.2,
                  bgcolor: 'rgba(255,255,255,.16)',
                  border: '1px solid rgba(255,255,255,.35)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,.3)',
                }}
              />
            </motion.div>

            <motion.div key={`ttl-${active.id}`} variants={textUp} initial="hidden" animate="show">
              <Stack spacing={0.2}>
                {active.titleLines.map((line, li) => (
                  <Typography
                    key={li}
                    variant="h1"
                    sx={{
                      fontWeight: 100,
                      lineHeight: 1.05,
                      letterSpacing: { md: '-.5px' },
                      fontSize: { xs: '2.2rem', sm: '3rem', md: '4rem' },
                      textShadow: '0 6px 40px rgba(0,0,0,.4)',
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </Stack>
            </motion.div>

            <motion.div key={`sub-${active.id}`} variants={textUp} initial="hidden" animate="show">
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  opacity: 0.95, 
                  lineHeight: 1.7, 
                  maxWidth: 720,
                  textShadow: '0 2px 10px rgba(0,0,0,.3)',
                }}
              >
                {active.subtitle}
              </Typography>
            </motion.div>
          </Stack>
        </Box>

        {/* Bottom controls area */}
        <Box sx={{ position: 'relative', pb: { xs: 2, md: 0 } }}>
          {/* Enhanced Filmstrip (3 tiles) */}
          {!isMdDown && (
            <Stack
              direction="row"
              spacing={3}
              sx={{
                mb: 3,
                px: 1,
                justifyContent: 'center',
              }}
            >
              {[prevIdx, index, nextIdx].map((i, k) => {
                const item = slides[i];
                const isCenter = i === index;
                return (
                  <Box
                    key={`${item.id}-${k}`}
                    onClick={() => goTo(i)}
                    sx={{
                      width: 240,
                      height: 220,
                      borderRadius: 3,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      position: 'relative',
                      boxShadow: isCenter
                        ? '0 20px 60px rgba(0,0,0,.5), 0 0 0 2px rgba(255,255,255,.2)'
                        : '0 12px 30px rgba(0,0,0,.4)',
                      transform: isCenter ? 'scale(1.03)' : 'scale(.97)',
                      transition: 'all .35s cubic-bezier(0.4, 0, 0.2, 1)',
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      '&:hover': { 
                        transform: 'scale(1.05)',
                        boxShadow: '0 25px 70px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.3)',
                      },
                    }}
                  >
                    {/* Enhanced overlay */}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        background:
                          'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,.65) 100%)',
                      }}
                    />
                    {/* Premium indicator dot */}
                    <Box
                      sx={{
                        position: 'absolute',
                        right: 12,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: isCenter ? 10 : 8,
                        height: isCenter ? 10 : 8,
                        borderRadius: '50%',
                        background: isCenter 
                          ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                          : '#fff',
                        opacity: isCenter ? 1 : 0.75,
                        boxShadow: isCenter 
                          ? `0 0 20px ${theme.palette.primary.main}`
                          : '0 2px 8px rgba(0,0,0,.3)',
                        transition: 'all .3s ease',
                      }}
                    />
                  </Box>
                );
              })}
            </Stack>
          )}

          {/* Enhanced Timeline with dots + CTA (left) + hold-to-pause (right) */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mx: { xs: 1, md: 0 },
            }}
          >
       

            {/* *** PREMIUM ENHANCED TIMELINE *** */}
            <Box sx={{ position: 'relative', flex: 1, height: 32 }}>
              {/* Enhanced Track with gradient */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: 3,
                  background: 'linear-gradient(90deg, rgba(255,255,255,.2), rgba(255,255,255,.4), rgba(255,255,255,.2))',
                  borderRadius: 2,
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,.3)',
                }}
              />
              
              {/* *** PREMIUM ANIMATED FILL *** */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  height: 3,
                  width: `${progress * 100}%`,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  borderRadius: 2,
                  boxShadow: `
                    0 0 15px ${theme.palette.primary.main}80,
                    0 0 30px ${theme.palette.secondary.main}60,
                    0 2px 8px rgba(0,0,0,.4)
                  `,
                  transition: paused ? 'none' : 'width .04s linear',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    right: -2,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#fff',
                    boxShadow: `0 0 12px ${theme.palette.primary.main}`,
                  }
                }}
              />
              
              {/* Enhanced Dots */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  px: 0.5,
                }}
              >
                {slides.map((s, i) => {
                  const isActive = i === index;
                  return (
                    <Box
                      key={s.id}
                      onClick={() => goTo(i)}
                      sx={{
                        width: isActive ? 14 : 10,
                        height: isActive ? 14 : 10,
                        borderRadius: '50%',
                        background: isActive 
                          ? `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                          : '#fff',
                        opacity: isActive ? 1 : 0.8,
                        border: isActive ? '2px solid rgba(255,255,255,.8)' : '1px solid rgba(255,255,255,.4)',
                        boxShadow: isActive 
                          ? `0 0 20px ${theme.palette.primary.main}, 0 4px 12px rgba(0,0,0,.3)`
                          : '0 2px 8px rgba(0,0,0,.2)',
                        cursor: 'pointer',
                        transition: 'all .25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'scale(1.2)',
                          boxShadow: isActive 
                            ? `0 0 25px ${theme.palette.primary.main}, 0 6px 16px rgba(0,0,0,.4)`
                            : '0 4px 12px rgba(0,0,0,.3)',
                        }
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Enhanced Hold-to-pause circle */}
            <Box
              onMouseDown={() => setPaused(true)}
              onMouseUp={() => setPaused(false)}
              onMouseLeave={() => setPaused(false)}
              onTouchStart={() => setPaused(true)}
              onTouchEnd={() => setPaused(false)}
              sx={{
                display: { xs: 'none', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
                width: 76,
                height: 76,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,.5)',
                position: 'relative',
                cursor: 'pointer',
                userSelect: 'none',
                backgroundColor: 'rgba(255,255,255,.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,.2)',
                transition: 'all .3s ease',
                '&:hover': {
                  boxShadow: '0 0 0 12px rgba(255,255,255,.1), 0 6px 30px rgba(0,0,0,.3)',
                  borderColor: 'rgba(255,255,255,.7)',
                },
              }}
              aria-label="Click and hold to pause"
              title="Click and hold"
            >
              {paused ? (
                <PauseRounded sx={{ color: '#fff', fontSize: 28 }} />
              ) : (
                <PlayArrowRounded sx={{ color: '#fff', fontSize: 28 }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  bottom: -28,
                  whiteSpace: 'nowrap',
                  color: 'rgba(255,255,255,.9)',
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  textShadow: '0 2px 8px rgba(0,0,0,.4)',
                }}
              >
                Click and hold
              </Typography>
            </Box>
          </Box>

          {/* Enhanced Desktop arrows */}
          {!isMdDown && (
            <>
              <IconButton
                onClick={prev}
                aria-label="Previous"
                sx={{
                  position: 'absolute',
                  left: -12,
                  top: 50,
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  border: '1px solid rgba(255,255,255,.4)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,.2)',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,.3)',
                    boxShadow: '0 6px 30px rgba(0,0,0,.3)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton
                onClick={next}
                aria-label="Next"
                sx={{
                  position: 'absolute',
                  right: -12,
                  top: 50,
                  color: '#fff',
                  backgroundColor: 'rgba(255,255,255,.2)',
                  border: '1px solid rgba(255,255,255,.4)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,.2)',
                  width: 48,
                  height: 48,
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,.3)',
                    boxShadow: '0 6px 30px rgba(0,0,0,.3)',
                    transform: 'scale(1.05)',
                  },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Container>
    </Box>
  );
}

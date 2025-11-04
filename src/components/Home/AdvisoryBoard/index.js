// src/components/AdvisoryBoard/AdvisoryBoard.jsx - ULTRA COMPACT WITH LARGER IMAGES & NO CARD ANIMATION
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import {
  CheckCircle,
  Award,
  Users,
  Globe,
  TrendingUp as LucideTrendingUp,
  Zap,
  Shield,
  Settings as LucideSettings,
  LayoutDashboard,
  Activity,
  BarChart3,
  Sparkles,
  BadgeCheck,
  Languages,
  Leaf,
  FlaskConical,
} from 'lucide-react';
import { API_BASE } from '../../../utils/api';

// === API ===
const API_URL = `${API_BASE}/api/advisory-board`;

// Map backend icon strings → lucide components
const ICON_MAP = {
  Globe,
  Award,
  Users,
  Zap,
  Shield,
  CheckCircle,
  BadgeCheck,
  Languages,
  Leaf,
  Activity,
  BarChart3,
  LayoutDashboard,
  Sparkles,
  FlaskConical,
  Dashboard: LayoutDashboard,
  Settings: LucideSettings,
  TrendingUp: LucideTrendingUp,
  AutoAwesome: Sparkles,
  Insights: Activity,
  Assessment: BarChart3,
  Security: Shield,
  Science: FlaskConical,
  Public: Globe,
  Verified: BadgeCheck,
  Language: Languages,
  Nature: Leaf,
};

// Enhanced expertise cleaner for frontend
const cleanExpertiseData = (expertise) => {
  if (!expertise) return [];
  
  let result = [];
  
  if (Array.isArray(expertise)) {
    result = expertise;
  } else if (typeof expertise === 'string') {
    const trimmed = expertise.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        result = JSON.parse(trimmed);
      } catch {
        result = trimmed
          .slice(1, -1)
          .split(',')
          .map(item => item.trim());
      }
    } else if (trimmed.includes(',')) {
      result = trimmed.split(',');
    } else {
      result = [trimmed];
    }
  } else {
    result = [String(expertise)];
  }
  
  return result
    .map(item => {
      if (typeof item !== 'string') return String(item);
      return item
        .replace(/[\[\]"'\\]/g, '')
        .replace(/^,+|,+$/g, '')
        .trim();
    })
    .filter(item => item && item.length > 0)
    .filter((item, index, arr) => arr.indexOf(item) === index);
};

// Helpers
const toImageSrc = (imageUrl) => {
  if (!imageUrl) return '';
  return /^https?:\/\//i.test(imageUrl) ? imageUrl : `${API_BASE}${imageUrl}`;
};
const safeColor = (hex) => (hex && /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex) ? hex : '#1AC99F');

// LinkedIn SVG Icon Component - ULTRA COMPACT
const LinkedInIcon = ({ size = 12, color = '#0077b5' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const AdvisoryBoard = () => {
  const [visibleElements, setVisibleElements] = useState({});
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollScale, setScrollScale] = useState(1);

  // Socket reference
  const socketRef = useRef(null);

  // staged reveals
  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements((p) => ({ ...p, header: true })), 300),
      setTimeout(() => setVisibleElements((p) => ({ ...p, subtitle: true })), 800),
      setTimeout(() => setVisibleElements((p) => ({ ...p, description: true })), 1300),
      setTimeout(() => setVisibleElements((p) => ({ ...p, members: true })), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Scroll scale effect (like TrustedByLeaders)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 200;
      const scale = Math.max(0.9, 1 - (scrollY / maxScroll) * 0.1);
      setScrollScale(scale);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // fetch from backend with real-time updates
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(API_URL);
        if (res.data?.success && Array.isArray(res.data.data)) {
          const normalized = res.data.data.map((m) => ({
            id: m._id || m.id || m.name,
            name: m.name || '',
            title: m.title || '',
            company: m.company || '',
            image: toImageSrc(m.imageUrl || ''),
            expertise: cleanExpertiseData(m.expertise),
            bio: m.bio || '',
            iconName: m.icon || 'Globe',
            color: safeColor(m.color),
            yearsExperience: m.yearsExperience || '',
            linkedinUrl: m.linkedinUrl || '',
          }));
          setMembers(normalized);
        } else {
          setMembers([]);
        }
      } catch (e) {
        console.error('Failed to fetch advisory members', e);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    load();

    // Initialize socket connection for real-time updates
    console.log('🔌 Connecting to Advisory Board Socket.IO (Public)...');
    const socket = io(API_BASE);
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Advisory Public Socket Connected:', socket.id);
      // Join public advisory board room
      socket.emit('join-advisory-room', 'advisoryBoard-public');
    });

    // Listen for real-time updates
    socket.on('advisory-members-updated', (payload) => {
      console.log('🔄 Real-time advisory update received (public):', payload.action);
      
      if (payload?.success && Array.isArray(payload.data)) {
        const normalized = payload.data.map((m) => ({
          id: m._id || m.id || m.name,
          name: m.name || '',
          title: m.title || '',
          company: m.company || '',
          image: toImageSrc(m.imageUrl || ''),
          expertise: cleanExpertiseData(m.expertise),
          bio: m.bio || '',
          iconName: m.icon || 'Globe',
          color: safeColor(m.color),
          yearsExperience: m.yearsExperience || '',
          linkedinUrl: m.linkedinUrl || '',
        }));
        setMembers(normalized);
      }
    });

    socket.on('advisory-error', (error) => {
      console.error('❌ Advisory Public Socket Error:', error);
    });

    socket.on('disconnect', () => {
      console.log('❌ Advisory Public Socket Disconnected');
    });

    // Request initial data
    socket.emit('request-advisory-data');

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Enhanced animations - NO FLOAT ANIMATION FOR CARDS
  const floatAnimation = `
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) rotate(0deg);
      }
      25% { 
        transform: translateY(-8px) rotate(0.3deg);
      }
      50% { 
        transform: translateY(-12px) rotate(0deg);
      }
      75% { 
        transform: translateY(-8px) rotate(-0.3deg);
      }
    }
  `;

  const slideInFromBottom = `
    @keyframes slideInFromBottom {
      0% {
        opacity: 0;
        transform: translateY(20px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;

  const scaleBreath = `
    @keyframes scaleBreath {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.01); }
    }
  `;

  const shimmer = `
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `;

  const pulse = `
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.02); opacity: 0.9; }
    }
  `;

  const glow = `
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 15px rgba(26, 201, 159, 0.2); }
      50% { box-shadow: 0 0 25px rgba(26, 201, 159, 0.4), 0 0 35px rgba(26, 201, 159, 0.2); }
    }
  `;

  // ULTRA COMPACT Typewriter Text Component
  const TypewriterText = ({ text, delay = 0, speed = 50 }) => {
    const [displayText, setDisplayText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setIsTyping(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
      if (!isTyping) return;
      if (currentIndex < text.length) {
        const timer = setTimeout(() => {
          setDisplayText((prev) => prev + text[currentIndex]);
          setCurrentIndex((prev) => prev + 1);
        }, speed);
        return () => clearTimeout(timer);
      }
    }, [currentIndex, text, speed, isTyping]);

    return (
      <span>
        {displayText}
        {isTyping && currentIndex < text.length && (
          <span
            style={{
              borderRight: '1px solid #1AC99F',
              animation: 'blinkCursor 1s infinite',
            }}
          />
        )}
      </span>
    );
  };

  // UPDATED: Animated Word Reveal Component with TrustedByLeaders styling
  const AnimatedWordReveal = ({ text, delay = 0, scrollScale = 1 }) => {
    const [visibleWords, setVisibleWords] = useState(0);
    const words = text.split(' ');

    useEffect(() => {
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          setVisibleWords((prev) => {
            if (prev >= words.length) {
              clearInterval(interval);
              return prev;
            }
            return prev + 1;
          });
        }, 150);
      }, delay);
      return () => clearTimeout(timer);
    }, [words.length, delay]);

    return (
      <div
        style={{
          maxWidth: '95%',
          '@media (min-width: 600px)': {
            maxWidth: '85%',
          },
          '@media (min-width: 900px)': {
            maxWidth: '600px',
          },
          margin: '0 auto',
          color: '#64748b', // text.secondary
          opacity: 0.8,
          lineHeight: 1.4,
          transform: `scale(${scrollScale})`,
          transition: 'transform 0.3s ease',
          padding: '0 4px',
          '@media (min-width: 600px)': {
            padding: '0 8px',
          },
        }}
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            style={{
              opacity: index < visibleWords ? 1 : 0,
              transform: index < visibleWords ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
              display: 'inline-block',
              marginRight: '0.3em',
              fontSize: '0.75rem', // xs
              '@media (min-width: 600px)': {
                fontSize: '0.85rem', // sm
              },
              '@media (min-width: 900px)': {
                fontSize: '0.95rem', // md
              },
              '@media (min-width: 1200px)': {
                fontSize: '1.2rem', // lg
              },
            }}
          >
            {word}
          </span>
        ))}
      </div>
    );
  };

  // ULTRA COMPACT Floating Particle Component
  const FloatingParticle = ({ delay = 0, size = 3, color = '#1AC99F', top, left }) => (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        opacity: 0.4,
        animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: `blur(${size > 4 ? 1 : 0.5}px)`,
      }}
    />
  );

  return (
    <>
      <style>{`
        ${floatAnimation}
        ${slideInFromBottom}
        ${scaleBreath}
        ${shimmer}
        ${pulse}
        ${glow}
        
        @keyframes blinkCursor {
          0%, 50% { border-color: transparent; }
          51%, 100% { border-color: #1AC99F; }
        }
        
        .floating-particle {
          animation: float 8s ease-in-out infinite;
        }
        
        .fade-in {
          opacity: 0;
          animation: fadeIn 1s ease-out forwards;
        }
        
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        
        .slide-in-bottom {
          animation: slideInFromBottom 1s ease-out;
        }
        
        .scale-breath {
          animation: scaleBreath 4s ease-in-out infinite;
        }

        .gradient-text {
          background: linear-gradient(135deg, #1AC99F, #2E8B8B);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hover-glow:hover {
          box-shadow: 0 0 20px rgba(26, 201, 159, 0.2);
        }

        .member-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .member-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
        }

        .member-card:hover .member-avatar {
          animation: pulse 1s ease-in-out infinite;
        }

        .member-card:hover .member-icon {
          transform: rotate(360deg);
        }

        .member-icon {
          transition: transform 0.6s ease;
        }

        .linkedin-btn {
          transition: all 0.3s ease;
        }

        .linkedin-btn:hover {
          background: rgba(0, 119, 181, 0.1) !important;
          transform: scale(1.05);
        }

        /* Responsive styles for AnimatedWordReveal */
        @media (max-width: 599px) {
          .animated-word-reveal {
            max-width: 95% !important;
            padding: 0 4px !important;
          }
          .animated-word-reveal span {
            font-size: 0.75rem !important;
          }
        }

        @media (min-width: 600px) and (max-width: 899px) {
          .animated-word-reveal {
            max-width: 85% !important;
            padding: 0 8px !important;
          }
          .animated-word-reveal span {
            font-size: 0.85rem !important;
          }
        }

        @media (min-width: 900px) and (max-width: 1199px) {
          .animated-word-reveal {
            max-width: 600px !important;
          }
          .animated-word-reveal span {
            font-size: 0.95rem !important;
          }
        }

        @media (min-width: 1200px) {
          .animated-word-reveal span {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
      
      <div
        style={{
          padding: '2rem 0 3rem 0', // MUCH REDUCED: From 4rem 0 6rem 0
          background: `
            radial-gradient(circle at 15% 25%, rgba(26, 201, 159, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(46, 139, 139, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(52, 152, 219, 0.03) 0%, transparent 70%),
            linear-gradient(135deg, #f8f9fa 0%, rgba(248, 249, 250, 0.3) 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '60vh', // MUCH REDUCED: From 100vh
        }}
      >
        {/* Floating particles - MUCH FEWER */}
        {[...Array(10)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            size={Math.random() * 6 + 2}
            color={i % 3 === 0 ? '#1AC99F' : i % 3 === 1 ? '#3498db' : '#e74c3c'}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
          />
        ))}

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem' }}> {/* REDUCED: From 1200px and 2rem */}
          {/* Header Section - ULTRA COMPACT */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}> {/* REDUCED: From 4rem */}
            {/* Badge - ULTRA COMPACT */}
            <div
              style={{
                opacity: visibleElements.header ? 1 : 0,
                transform: visibleElements.header ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.8s ease-out',
                marginBottom: '1.5rem', // REDUCED: From 2rem
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem', // REDUCED: From 0.5rem
                  background: 'linear-gradient(135deg, rgba(26, 201, 159, 0.1), rgba(46, 139, 139, 0.1))',
                  padding: '0.5rem 1rem', // REDUCED: From 0.75rem 1.5rem
                  borderRadius: '30px', // REDUCED: From 50px
                  border: '1px solid rgba(26, 201, 159, 0.3)', // THINNER: From 2px
                  backdropFilter: 'blur(8px)',
                  animation: 'float 6s ease-in-out infinite',
                  transform: `scale(${scrollScale})`,
                  transition: 'transform 0.3s ease',
                }}
              >
                <CheckCircle size={12} style={{ color: '#1AC99F' }} /> {/* REDUCED: From 16 */}
                <span style={{ color: '#1AC99F', fontWeight: 600, fontSize: '0.6rem' }}> {/* REDUCED: From 0.9rem */}
                  Guided by Industry Pioneers
                </span>
              </div>
            </div>

            {/* Main Headline - ULTRA COMPACT */}
            <h1
              style={{
                fontSize: 'clamp(1.5rem, 4vw, 2.8rem)', // MUCH REDUCED: From clamp(2.5rem, 5vw, 4.5rem)
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '1rem', // REDUCED: From 1.5rem
                color: '#1e293b',
                letterSpacing: '-0.02em',
                transform: `scale(${scrollScale})`,
                transition: 'transform 0.3s ease',
              }}
            >
              <TypewriterText text="Meet the GreonXpert" delay={500} speed={80} />
              <br />
              <span className="gradient-text">
                <TypewriterText text="Sustainability Advisory Board" delay={2500} speed={80} />
              </span>
            </h1>

            {/* Subtitle - ULTRA COMPACT */}
            <div
              style={{
                opacity: visibleElements.subtitle ? 1 : 0,
                transform: visibleElements.subtitle ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.8s ease-out',
                marginBottom: '1.5rem', // REDUCED: From 2rem
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', // MUCH REDUCED: From clamp(1.5rem, 3vw, 2rem)
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '0.8rem', // REDUCED: From 1rem
                  transform: `scale(${scrollScale})`,
                  transition: 'transform 0.3s ease',
                }}
              >
                Guided by Industry Pioneers
              </h2>
            </div>

            {/* Description - UPDATED WITH TRUSTEDBYEEADERS STYLING */}
            <div
              style={{
                opacity: visibleElements.description ? 1 : 0,
                transform: visibleElements.description ? 'translateY(0)' : 'translateY(15px)',
                transition: 'all 0.8s ease-out',
                marginBottom: '2rem', // REDUCED: From 3rem
              }}
              className="animated-word-reveal"
            >
              <AnimatedWordReveal 
                text="Led by global experts in carbon strategy, ESG, and sustainable development,
the Greon Xpert Advisory Board ensures every platform feature and consulting solution
is built on proven science, measurable impact, and forward-looking climate insight."
                delay={3500}
                scrollScale={scrollScale}
              />
            </div>
          </div>

          {/* Advisory Members Grid - ULTRA COMPACT WITH NO CARD ANIMATION */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', // REDUCED: From minmax(350px, 1fr)
              gap: '1.5rem', // REDUCED: From 2rem
              opacity: visibleElements.members ? 1 : 0,
              transform: visibleElements.members ? 'translateY(0)' : 'translateY(30px)',
              transition: 'all 1s ease-out',
            }}
          >
            {loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', fontSize: '0.7rem' }}> {/* REDUCED font */}
                Loading advisory board…
              </div>
            )}

            {!loading && members.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#64748b', fontSize: '0.7rem' }}> {/* REDUCED font */}
                No advisory board members yet.
              </div>
            )}

            {members.map((member, index) => {
              const IconComp = ICON_MAP[member.iconName] || Globe;
              const color = member.color;
              const cleanedExpertise = cleanExpertiseData(member.expertise);
              
              return (
                <div
                  key={member.id || `${member.name}-${index}`}
                  className="member-card"
                  style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(12px)', // REDUCED: From blur(15px)
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '0.8rem', // REDUCED: From 1rem
                    padding: '1.5rem', // REDUCED: From 2rem
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    // REMOVED: animation: float - NO CARD ANIMATION
                    transform: `scale(${scrollScale})`,
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {/* Shimmer effect - REDUCED */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: '-150px', // REDUCED: From -200px
                      width: '150px', // REDUCED: From 200px
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: `shimmer 4s infinite`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                  />

                  {/* Avatar Section - ULTRA COMPACT WITH LARGER IMAGE */}
                  <div style={{ marginBottom: '1rem', position: 'relative' }}> {/* REDUCED: From 1.5rem */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      {member.image ? (
                        <img
                          className="member-avatar"
                          src={member.image}
                          alt={member.name}
                          style={{
                            width: '105px', // INCREASED BY 50%: From 70px
                            height: '105px', // INCREASED BY 50%: From 70px
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `3px solid ${color}30`, // REDUCED: From 4px
                            boxShadow: `0 8px 32px ${color}25`, // ENHANCED shadow for larger image
                            marginBottom: '0.8rem', // REDUCED: From 1rem
                          }}
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                      ) : (
                        <div
                          className="member-avatar"
                          style={{
                            width: '105px', // INCREASED BY 50%: From 70px
                            height: '105px', // INCREASED BY 50%: From 70px
                            borderRadius: '50%',
                            background: `${color}22`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.8rem', // REDUCED: From 1rem
                            border: `3px solid ${color}30`, // REDUCED: From 4px
                            boxShadow: `0 8px 32px ${color}25`, // ENHANCED shadow for larger image
                            fontWeight: 700,
                            color: color,
                            fontSize: '1.8rem', // INCREASED font for larger circle
                          }}
                        >
                          {member.name?.charAt(0) || 'A'}
                        </div>
                      )}

                      <div
                        className="member-icon"
                        style={{
                          position: 'absolute',
                          bottom: '0.8rem', // REDUCED: From 1rem
                          right: '-8px', // REDUCED: From -10px
                          background: 'white',
                          borderRadius: '50%',
                          padding: '0.5rem', // SLIGHTLY INCREASED: From 0.4rem
                          boxShadow: `0 4px 12px ${color}30`, // ENHANCED shadow
                          color: color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <IconComp size={18} /> {/* SLIGHTLY INCREASED: From 16 */}
                      </div>
                    </div>
                    
                    {/* Experience Badge - ULTRA COMPACT */}
                    {member.yearsExperience ? (
                      <div
                        style={{
                          position: 'absolute',
                          top: '-8px', // REDUCED: From -10px
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: `linear-gradient(135deg, ${color}15, ${color}25)`,
                          color: color,
                          padding: '0.2rem 0.5rem', // REDUCED: From 0.25rem 0.75rem
                          borderRadius: '30px', // REDUCED: From 50px
                          fontSize: '0.5rem', // MUCH REDUCED: From 0.75rem
                          fontWeight: 600,
                          border: `1px solid ${color}30`,
                        }}
                      >
                        {member.yearsExperience}
                      </div>
                    ) : null}
                  </div>

                  {/* Name and Title - ULTRA COMPACT */}
                  <h3
                    style={{
                      fontSize: '1rem', // MUCH REDUCED: From 1.5rem
                      fontWeight: 700,
                      marginBottom: '0.4rem', // REDUCED: From 0.5rem
                      background: `linear-gradient(45deg, ${color}, ${color}AA)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {member.name}
                  </h3>
                  
                  <p
                    style={{
                      fontSize: '0.7rem', // MUCH REDUCED: From 1.1rem
                      fontWeight: 600,
                      color: '#1e293b',
                      marginBottom: '0.2rem', // REDUCED: From 0.25rem
                    }}
                  >
                    {member.title}
                  </p>
                  
                  <p
                    style={{
                      fontSize: '0.6rem', // MUCH REDUCED: From 0.9rem
                      color: '#64748b',
                      marginBottom: '0.8rem', // REDUCED: From 1rem
                      fontWeight: 500,
                    }}
                  >
                    {member.company}
                  </p>

                  <hr style={{ border: 'none', height: '1px', background: 'rgba(0,0,0,0.1)', margin: '0.8rem 0' }} /> {/* REDUCED margin */}

                  {/* Expertise Tags - ULTRA COMPACT */}
                  <div style={{ marginBottom: '0.8rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}> {/* REDUCED gaps and margins */}
                    {cleanedExpertise.map((skill, idx) => (
                      <span
                        key={`${member.id}-skill-${idx}`}
                        style={{
                          background: `${color}15`,
                          color: color,
                          padding: '0.2rem 0.5rem', // REDUCED: From 0.25rem 0.75rem
                          borderRadius: '30px', // REDUCED: From 50px
                          fontSize: '0.5rem', // MUCH REDUCED: From 0.75rem
                          fontWeight: 500,
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Social Links - ULTRA COMPACT */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}> {/* REDUCED gap */}
                    {/* LinkedIn Link - ULTRA COMPACT */}
                    {member.linkedinUrl ? (
                      <a
                        href={member.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="linkedin-btn"
                        style={{
                          width: '1.5rem', // REDUCED: From 2rem
                          height: '1.5rem', // REDUCED: From 2rem
                          borderRadius: '50%',
                          background: '#0077b5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                        }}
                        title="LinkedIn Profile"
                      >
                        <LinkedInIcon size={12} color="white" /> {/* REDUCED: From 16 */}
                      </a>
                    ) : (
                      <div
                        style={{
                          width: '1.5rem', // REDUCED: From 2rem
                          height: '1.5rem', // REDUCED: From 2rem
                          borderRadius: '50%',
                          background: `${color}10`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = `${color}20`;
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = `${color}10`;
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                        title="LinkedIn"
                      >
                        <LinkedInIcon size={10} color={color} /> {/* REDUCED: From 12 */}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Decorative Elements - ULTRA COMPACT */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: '80px', // REDUCED: From 120px
            height: '80px', // REDUCED: From 120px
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(26, 201, 159, 0.15), rgba(46, 139, 139, 0.15))',
            animation: 'float 10s ease-in-out infinite',
            opacity: 0.3, // REDUCED: From 0.4
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '60px', // REDUCED: From 80px
            height: '60px', // REDUCED: From 80px
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(46, 139, 139, 0.15), rgba(26, 201, 159, 0.15))',
            animation: 'float 8s ease-in-out infinite reverse',
            opacity: 0.3, // REDUCED: From 0.4
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '30px', // REDUCED: From 40px
            height: '30px', // REDUCED: From 40px
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(26, 201, 159, 0.2), rgba(46, 139, 139, 0.2))',
            animation: 'float 6s ease-in-out infinite',
            opacity: 0.25, // REDUCED: From 0.3
          }}
        />
      </div>
    </>
  );
};

export default AdvisoryBoard;

import React, { useState, useEffect } from 'react';
import { CheckCircle, Award, Users, Globe, TrendingUp, Zap, Shield } from 'lucide-react';

// Enhanced animations
const floatAnimation = `
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px) rotate(0deg);
    }
    25% { 
      transform: translateY(-12px) rotate(0.5deg);
    }
    50% { 
      transform: translateY(-20px) rotate(0deg);
    }
    75% { 
      transform: translateY(-12px) rotate(-0.5deg);
    }
  }
`;

const slideInFromBottom = `
  @keyframes slideInFromBottom {
    0% {
      opacity: 0;
      transform: translateY(40px);
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
    50% { transform: scale(1.02); }
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
    50% { transform: scale(1.05); opacity: 0.8; }
  }
`;

const glow = `
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(26, 201, 159, 0.3); }
    50% { box-shadow: 0 0 30px rgba(26, 201, 159, 0.6), 0 0 40px rgba(26, 201, 159, 0.4); }
  }
`;

// Typewriter Text Component
const TypewriterText = ({ text, delay = 0, speed = 50 }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isTyping) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
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
            borderRight: '2px solid #1AC99F',
            animation: 'blinkCursor 1s infinite',
          }}
        />
      )}
    </span>
  );
};

// Animated Word Reveal Component
const AnimatedWordReveal = ({ text, delay = 0 }) => {
  const [visibleWords, setVisibleWords] = useState(0);
  const words = text.split(' ');

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setVisibleWords(prev => {
          if (prev >= words.length) {
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 150);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [words.length, delay]);

  return (
    <span>
      {words.map((word, index) => (
        <span
          key={index}
          style={{
            opacity: index < visibleWords ? 1 : 0,
            transform: index < visibleWords ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            display: 'inline-block',
            marginRight: '0.3em',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
};

// Floating Particle Component
const FloatingParticle = ({ delay = 0, size = 4, color = '#1AC99F', top, left }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: top,
        left: left,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        borderRadius: '50%',
        opacity: 0.6,
        animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        filter: `blur(${size > 6 ? 2 : 1}px)`,
      }}
    />
  );
};

const AdvisoryBoard = () => {
  const [visibleElements, setVisibleElements] = useState({});

  useEffect(() => {
    const timers = [
      setTimeout(() => setVisibleElements(prev => ({ ...prev, header: true })), 300),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, subtitle: true })), 800),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, description: true })), 1300),
      setTimeout(() => setVisibleElements(prev => ({ ...prev, members: true })), 1800),
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  // Advisory board members data
  const advisoryMembers = [
    {
      id: 1,
      name: "Dr. Sarah Mitchell",
      title: "Chief Sustainability Officer",
      company: "Fortune 500 Energy Corp",
      image: "https://m.media-amazon.com/images/S/amzn-author-media-prod/nbgv9ibf9u2f0bs3os7du4lh3t.jpg?w=150&h=150&fit=crop&crop=face",
      expertise: ["Climate Strategy", "Carbon Markets", "ESG Reporting"],
      bio: "Leading sustainability transformations for 15+ years with expertise in carbon credit markets and regulatory compliance.",
      icon: <Globe size={24} />,
      color: '#1AC99F',
      yearsExperience: "15+",
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      title: "Climate Science Research Director",
      company: "MIT Climate Institute",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      expertise: ["Climate Modeling", "Data Analytics", "Research"],
      bio: "Published 200+ papers on climate change impacts and mitigation strategies. Expert in environmental data science.",
      icon: <Award size={24} />,
      color: '#2E8B8B',
      yearsExperience: "20+",
    },
    {
      id: 3,
      name: "James Rodriguez",
      title: "Former VP Sustainable Finance",
      company: "Goldman Sachs",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      expertise: ["Green Finance", "Impact Investing", "Risk Management"],
      bio: "Structured $50B+ in sustainable finance deals and pioneered ESG integration in investment frameworks.",
      icon: <TrendingUp size={24} />,
      color: '#3498db',
      yearsExperience: "18+",
    },
    
  
  ];

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
          box-shadow: 0 0 30px rgba(26, 201, 159, 0.3);
        }

        .member-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .member-card:hover {
          transform: translateY(-12px) scale(1.02);
          animation: glow 2s ease-in-out infinite;
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
      `}</style>
      
      <div
        style={{
          padding: '4rem 0 6rem 0',
          background: `
            radial-gradient(circle at 15% 25%, rgba(26, 201, 159, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 85% 75%, rgba(46, 139, 139, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(52, 152, 219, 0.03) 0%, transparent 70%),
            linear-gradient(135deg, #f8f9fa 0%, rgba(248, 249, 250, 0.3) 100%)
          `,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '100vh',
        }}
      >
        {/* Floating particles */}
        {[...Array(20)].map((_, i) => (
          <FloatingParticle
            key={i}
            delay={i * 0.5}
            size={Math.random() * 8 + 2}
            color={i % 3 === 0 ? '#1AC99F' : i % 3 === 1 ? '#3498db' : '#e74c3c'}
            top={`${Math.random() * 100}%`}
            left={`${Math.random() * 100}%`}
          />
        ))}

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            {/* Badge */}
            <div
              style={{
                opacity: visibleElements.header ? 1 : 0,
                transform: visibleElements.header ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out',
                marginBottom: '2rem',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, rgba(26, 201, 159, 0.1), rgba(46, 139, 139, 0.1))',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '50px',
                  border: '2px solid rgba(26, 201, 159, 0.3)',
                  backdropFilter: 'blur(10px)',
                  animation: 'float 6s ease-in-out infinite',
                }}
              >
                <CheckCircle size={16} style={{ color: '#1AC99F' }} />
                <span style={{ color: '#1AC99F', fontWeight: 600, fontSize: '0.9rem' }}>
                  Guided by Industry Pioneers
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                color: '#1e293b',
                letterSpacing: '-0.02em',
              }}
            >
              <TypewriterText text="Meet the GreonXpert" delay={500} speed={80} />
              <br />
              <span className="gradient-text">
                <TypewriterText text="Sustainability Advisory Board" delay={2500} speed={80} />
              </span>
            </h1>

            {/* Subtitle */}
            <div
              style={{
                opacity: visibleElements.subtitle ? 1 : 0,
                transform: visibleElements.subtitle ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.8s ease-out',
                marginBottom: '2rem',
              }}
            >
              <h2
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 600,
                  color: '#1e293b',
                  marginBottom: '1rem',
                }}
              >
                Guided by Industry Pioneers
              </h2>
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                color: '#64748b',
                marginBottom: '3rem',
                maxWidth: '800px',
                margin: '0 auto 3rem auto',
                lineHeight: 1.6,
              }}
            >
              <AnimatedWordReveal 
                text="Our expert advisory committee guides GreonXpert's platform evolution and rigorously vets our carbon and ESG methodologies. This ensures you rely on the most advanced, high-impact tools for emissions tracking, sustainability reporting, and strategic decarbonization."
                delay={3500}
              />
            </div>
          </div>

          {/* Advisory Members Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '2rem',
              opacity: visibleElements.members ? 1 : 0,
              transform: visibleElements.members ? 'translateY(0)' : 'translateY(40px)',
              transition: 'all 1s ease-out',
            }}
          >
            {advisoryMembers.map((member, index) => (
              <div
                key={member.id}
                className="member-card"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '1rem',
                  padding: '2rem',
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  animation: `float ${8 + index * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.3}s`,
                }}
              >
                {/* Shimmer effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '-200px',
                    width: '200px',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    animation: `shimmer 4s infinite`,
                    animationDelay: `${index * 0.5}s`,
                  }}
                />

                {/* Avatar Section */}
                <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      className="member-avatar"
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: `4px solid ${member.color}30`,
                        boxShadow: `0 8px 32px ${member.color}20`,
                        marginBottom: '1rem',
                      }}
                    />
                    <div
                      className="member-icon"
                      style={{
                        position: 'absolute',
                        bottom: '1rem',
                        right: '-10px',
                        background: 'white',
                        borderRadius: '50%',
                        padding: '0.5rem',
                        boxShadow: `0 4px 12px ${member.color}30`,
                        color: member.color,
                      }}
                    >
                      {member.icon}
                    </div>
                  </div>
                  
                  {/* Experience Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: `linear-gradient(135deg, ${member.color}15, ${member.color}25)`,
                      color: member.color,
                      padding: '0.25rem 0.75rem',
                      borderRadius: '50px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      border: `1px solid ${member.color}30`,
                    }}
                  >
                    {member.yearsExperience} Years
                  </div>
                </div>

                {/* Name and Title */}
                <h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    background: `linear-gradient(45deg, ${member.color}, ${member.color}AA)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {member.name}
                </h3>
                
                <p
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#1e293b',
                    marginBottom: '0.25rem',
                  }}
                >
                  {member.title}
                </p>
                
                <p
                  style={{
                    fontSize: '0.9rem',
                    color: '#64748b',
                    marginBottom: '1rem',
                    fontWeight: 500,
                  }}
                >
                  {member.company}
                </p>

                <hr style={{ border: 'none', height: '1px', background: 'rgba(0,0,0,0.1)', margin: '1rem 0' }} />

                {/* Expertise Tags */}
                <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                  {member.expertise.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      style={{
                        background: `${member.color}15`,
                        color: member.color,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '50px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>

               

                {/* Social Links Placeholder */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: `${member.color}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = `${member.color}20`;
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = `${member.color}10`;
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <span style={{ color: member.color, fontSize: '0.8rem' }}>in</span>
                  </div>
                  <div
                    style={{
                      width: '2rem',
                      height: '2rem',
                      borderRadius: '50%',
                      background: `${member.color}10`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = `${member.color}20`;
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = `${member.color}10`;
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <span style={{ color: member.color, fontSize: '0.8rem' }}>@</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            right: '8%',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(26, 201, 159, 0.15), rgba(46, 139, 139, 0.15))',
            animation: 'float 10s ease-in-out infinite',
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(46, 139, 139, 0.15), rgba(26, 201, 159, 0.15))',
            animation: 'float 8s ease-in-out infinite reverse',
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60%',
            right: '15%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, rgba(26, 201, 159, 0.2), rgba(46, 139, 139, 0.2))',
            animation: 'float 6s ease-in-out infinite',
            opacity: 0.3,
          }}
        />
      </div>
    </>
  );
};

export default AdvisoryBoard;
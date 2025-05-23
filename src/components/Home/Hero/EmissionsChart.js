// src/components/Hero/EmissionsChart.js
import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  BarChart,
  AreaChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Sample emissions data
const SAMPLE_EMISSIONS_DATA = [
  { year: 2019, scope1: 125.0, scope2: 110, scope3: 200, total: 435 },
  { year: 2020, scope1: 115.0, scope2: 100, scope3: 190, total: 405 },
  { year: 2021, scope1: 105.0, scope2: 90, scope3: 175, total: 370 },
  { year: 2022, scope1: 95.0, scope2: 80, scope3: 160, total: 335 },
  { year: 2023, scope1: 84.8, scope2: 70, scope3: 143, total: 297.8 }
];

const EmissionsChart = () => {
  const [toggles, setToggles] = useState({
    scope1: true,
    scope2: true,
    scope3: true,
    total: false
  });

  const [chartType, setChartType] = useState('line');
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleChange = (scope) => {
    setToggles(prev => ({ ...prev, [scope]: !prev[scope] }));
  };

  const chartColors = {
    scope1: '#1AC99F',
    scope2: '#2E8B8B',
    scope3: '#3498db',
    total: '#6c757d'
  };

  // Responsive breakpoints
  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  // Responsive values
  const fontSize = {
    title: isMobile ? '25px' : isTablet ? '32px' : '20px',
    subtitle: isMobile ? '14px' : isTablet ? '15px' : '12px',
    legend: isMobile ? '12px' : isTablet ? '13px' : '11px',
    stats: isMobile ? '18px' : isTablet ? '20px' : '16px',
    statsLabel: isMobile ? '12px' : isTablet ? '13px' : '11px',
    button: isMobile ? '12px' : isTablet ? '13px' : '11px',
    axis: isMobile ? 12 : isTablet ? 13 : 11
  };

  const spacing = {
    padding: isMobile ? '20px' : isTablet ? '18px' : '16px',
    gap: isMobile ? '6px' : isTablet ? '5px' : '4px',
    marginBottom: isMobile ? '20px' : isTablet ? '18px' : '16px'
  };

  const chartHeight = isMobile ? '320px' : isTablet ? '300px' : '300px';
  const buttonHeight = isMobile ? '28px' : isTablet ? '26px' : '24px';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div style={{
        padding: isMobile ? '16px' : isTablet ? '14px' : '12px',
        fontSize: fontSize.legend,
        maxWidth: isMobile ? '250px' : isTablet ? '220px' : '200px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
          Year: {label}
        </div>
        {payload.map((entry, index) => (
          <div key={index} style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '4px',
            color: entry.color
          }}>
            <span>{entry.name}:</span>
            <span style={{ fontWeight: 'bold', marginLeft: '8px' }}>
              {entry.value} tCO₂e
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    const props = {
      data: SAMPLE_EMISSIONS_DATA,
      margin: { 
        top: 5, 
        right: isMobile ? 5 : 10, 
        left: isMobile ? 5 : 0, 
        bottom: 5 
      }
    };

    const commonLines = (
      <>
        {toggles.scope1 && (
          <Line type="monotone" dataKey="scope1" stroke={chartColors.scope1} strokeWidth={2} dot={{ r: isMobile ? 4 : 3 }} name="Scope 1" />
        )}
        {toggles.scope2 && (
          <Line type="monotone" dataKey="scope2" stroke={chartColors.scope2} strokeWidth={2} dot={{ r: isMobile ? 4 : 3 }} name="Scope 2" />
        )}
        {toggles.scope3 && (
          <Line type="monotone" dataKey="scope3" stroke={chartColors.scope3} strokeWidth={2} dot={{ r: isMobile ? 4 : 3 }} name="Scope 3" />
        )}
        {toggles.total && (
          <Line type="monotone" dataKey="total" stroke={chartColors.total} strokeWidth={2} dot={{ r: isMobile ? 4 : 3 }} name="Total" strokeDasharray="5 5" />
        )}
      </>
    );

    const commonBars = (
      <>
        {toggles.scope1 && <Bar dataKey="scope1" fill={chartColors.scope1} name="Scope 1" />}
        {toggles.scope2 && <Bar dataKey="scope2" fill={chartColors.scope2} name="Scope 2" />}
        {toggles.scope3 && <Bar dataKey="scope3" fill={chartColors.scope3} name="Scope 3" />}
        {toggles.total && <Bar dataKey="total" fill={chartColors.total} name="Total" />}
      </>
    );

    const commonAreas = (
      <>
        {toggles.scope1 && <Area type="monotone" dataKey="scope1" fill={chartColors.scope1} stroke={chartColors.scope1} name="Scope 1" />}
        {toggles.scope2 && <Area type="monotone" dataKey="scope2" fill={chartColors.scope2} stroke={chartColors.scope2} name="Scope 2" />}
        {toggles.scope3 && <Area type="monotone" dataKey="scope3" fill={chartColors.scope3} stroke={chartColors.scope3} name="Scope 3" />}
        {toggles.total && <Area type="monotone" dataKey="total" fill={chartColors.total} stroke={chartColors.total} name="Total" />}
      </>
    );

    const axisProps = {
      tick: { fill: 'rgba(15, 15, 15, 0.8)', fontSize: fontSize.axis },
      axisLine: { stroke: 'rgba(255, 255, 255, 0.2)' }
    };

    const legendProps = {
      wrapperStyle: { 
        fontSize: fontSize.legend, 
        color: 'rgba(255, 255, 255, 0.8)' 
      }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...props}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend {...legendProps} />
            {commonBars}
          </BarChart>
        );
      case 'area':
        return (
          <AreaChart {...props}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend {...legendProps} />
            {commonAreas}
          </AreaChart>
        );
      default:
        return (
          <LineChart {...props}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="year" {...axisProps} />
            <YAxis {...axisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Legend {...legendProps} />
            {commonLines}
          </LineChart>
        );
    }
  };

  return (
    <div style={{
      padding: spacing.padding,
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ marginBottom: spacing.marginBottom }}>
        <h3 style={{
          color: 'black',
          fontSize: fontSize.title,
          margin: '0 0 8px 0',
          fontWeight: '400'
        }}>
          Emissions Tracking
        </h3>
        <p style={{
          color: '#000',
          fontSize: fontSize.subtitle,
          margin: '0'
        }}>
          Real-time carbon footprint monitoring
        </p>
      </div>

      {/* Dropdown for Chart Type */}
      <div style={{ 
        marginBottom: '12px', 
        textAlign: isMobile ? 'center' : 'right' 
      }}>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'black',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: isMobile ? '6px 12px' : '4px 8px',
            fontSize: fontSize.legend,
            cursor: 'pointer'
          }}
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="area">Area</option>
        </select>
      </div>

      {/* Chart */}
      <div style={{ 
        height: chartHeight, 
        marginBottom: spacing.marginBottom,
        flex: '1 1 auto'
      }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Toggle Controls */}
      <div style={{ marginBottom: spacing.marginBottom }}>
        <div style={{
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: '8px',
          fontSize: fontSize.legend,
          textAlign: isMobile ? 'center' : 'left'
        }}>
          Toggle Data Series:
        </div>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: spacing.gap,
          justifyContent: isMobile ? 'center' : 'flex-start'
        }}>
          {Object.keys(toggles).map((scope) => (
            <button
              key={scope}
              onClick={() => handleToggleChange(scope)}
              style={{
                fontSize: fontSize.button,
                height: buttonHeight,
                padding: isMobile ? '0 12px' : '0 8px',
                borderRadius: '12px',
                border: `1px solid ${chartColors[scope]}`,
                backgroundColor: toggles[scope] ? chartColors[scope] : 'transparent',
                color: toggles[scope] ? 'white' : chartColors[scope],
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {scope === 'scope1' ? 'Scope 1' :
               scope === 'scope2' ? 'Scope 2' :
               scope === 'scope3' ? 'Scope 3' : 'Total'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: 'auto',
        gap: isMobile ? '16px' : '8px'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            color: '#1AC99F',
            fontSize: fontSize.stats,
            fontWeight: '600'
          }}>
            298
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: fontSize.statsLabel
          }}>
            Current tCO₂e
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            color: '#2ECC71',
            fontSize: fontSize.stats,
            fontWeight: '600'
          }}>
            -31.5%
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: fontSize.statsLabel
          }}>
            vs 2019
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            color: '#3498db',
            fontSize: fontSize.stats,
            fontWeight: '600'
          }}>
            3
          </div>
          <div style={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: fontSize.statsLabel
          }}>
            Scopes
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionsChart;
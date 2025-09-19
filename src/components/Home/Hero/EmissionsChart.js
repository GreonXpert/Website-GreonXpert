import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
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
import emissionService from '../../../services/emissionService'; // Corrected import
import { API_BASE } from '../../../utils/api';

const API_URL = `${API_BASE}`; // Use the imported API_BASE

const EmissionsChart = () => {
  const [emissionsData, setEmissionsData] = useState([]);
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
    // 1. Fetch initial data from the backend
    const getInitialData = async () => {
      // Call the function from the imported service object
      const data = await emissionService.getAllEmissions(); 
      // Sort data by year ascending for the chart
      data.sort((a, b) => a.year - b.year);
      setEmissionsData(data);
    };

    getInitialData();

    // 2. Set up Socket.IO for real-time updates
    const socket = io(API_URL);

    // Listen for the 'emissions-updated' event from the server
    socket.on('emissions-updated', (data) => {
      if (data.success) {
        console.log('Real-time emissions update received:', data.data);
        const sortedData = [...data.data].sort((a, b) => a.year - b.year);
        setEmissionsData(sortedData);
      }
    });

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // 3. Cleanup on component unmount
    return () => {
        window.removeEventListener('resize', handleResize);
        socket.disconnect(); // Disconnect the socket
    };
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

  const isMobile = windowSize.width < 768;
  const isTablet = windowSize.width >= 768 && windowSize.width < 1024;

  const containerWidth = '100%'; // Let the parent container control the width

  const fontSize = {
    title: isMobile ? '22px' : '20px',
    subtitle: isMobile ? '14px' : '12px',
    legend: isMobile ? '12px' : '11px',
    stats: isMobile ? '18px' : '16px',
    statsLabel: isMobile ? '12px' : '11px',
    button: isMobile ? '12px' : '11px',
    axis: isMobile ? 12 : 11
  };

  const spacing = {
    padding: isMobile ? '20px' : '16px',
    gap: isMobile ? '6px' : '4px',
    marginBottom: isMobile ? '20px' : '16px'
  };

  const chartHeight = isMobile ? '320px' : '300px';
  const buttonHeight = isMobile ? '28px' : '24px';

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div style={{
        padding: isMobile ? '16px' : '12px',
        fontSize: fontSize.legend,
        maxWidth: '200px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: '8px',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
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
              {entry.value.toLocaleString()} tCO₂e
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    const props = {
      data: emissionsData,
      margin: { top: 5, right: 10, left: 0, bottom: 5 }
    };

    const commonLines = (
        <>
          {toggles.scope1 && <Line type="monotone" dataKey="scope1" stroke={chartColors.scope1} strokeWidth={2} dot={{ r: 3 }} name="Scope 1" />}
          {toggles.scope2 && <Line type="monotone" dataKey="scope2" stroke={chartColors.scope2} strokeWidth={2} dot={{ r: 3 }} name="Scope 2" />}
          {toggles.scope3 && <Line type="monotone" dataKey="scope3" stroke={chartColors.scope3} strokeWidth={2} dot={{ r: 3 }} name="Scope 3" />}
          {toggles.total && <Line type="monotone" dataKey="total" stroke={chartColors.total} strokeWidth={2} dot={{ r: 3 }} name="Total" strokeDasharray="5 5" />}
        </>
    );

    const commonBars = (
        <>
          {toggles.scope1 && <Bar dataKey="scope1" fill={chartColors.scope1} name="Scope 1" stackId="a" />}
          {toggles.scope2 && <Bar dataKey="scope2" fill={chartColors.scope2} name="Scope 2" stackId="a" />}
          {toggles.scope3 && <Bar dataKey="scope3" fill={chartColors.scope3} name="Scope 3" stackId="a" />}
          {toggles.total && <Bar dataKey="total" fill={chartColors.total} name="Total" />}
        </>
    );

    const commonAreas = (
        <>
          {toggles.scope1 && <Area type="monotone" dataKey="scope1" fill={chartColors.scope1} stroke={chartColors.scope1} name="Scope 1" stackId="1" />}
          {toggles.scope2 && <Area type="monotone" dataKey="scope2" fill={chartColors.scope2} stroke={chartColors.scope2} name="Scope 2" stackId="1" />}
          {toggles.scope3 && <Area type="monotone" dataKey="scope3" fill={chartColors.scope3} stroke={chartColors.scope3} name="Scope 3" stackId="1" />}
          {toggles.total && <Area type="monotone" dataKey="total" fill={chartColors.total} stroke={chartColors.total} name="Total" />}
        </>
    );

    const axisProps = {
      tick: { fill: '#333', fontSize: fontSize.axis },
      axisLine: { stroke: 'rgba(0, 0, 0, 0.1)' }
    };

    const legendProps = {
      wrapperStyle: { 
        fontSize: fontSize.legend, 
        color: '#555' 
      }
    };

    switch (chartType) {
      case 'bar': return <BarChart {...props}><CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" /><XAxis dataKey="year" {...axisProps} /><YAxis {...axisProps} /><Tooltip content={<CustomTooltip />} /><Legend {...legendProps} />{commonBars}</BarChart>;
      case 'area': return <AreaChart {...props}><CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" /><XAxis dataKey="year" {...axisProps} /><YAxis {...axisProps} /><Tooltip content={<CustomTooltip />} /><Legend {...legendProps} />{commonAreas}</AreaChart>;
      default: return <LineChart {...props}><CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.1)" /><XAxis dataKey="year" {...axisProps} /><YAxis {...axisProps} /><Tooltip content={<CustomTooltip />} /><Legend {...legendProps} />{commonLines}</LineChart>;
    }
  };
  
  const lastEmissionYear = emissionsData.length > 0 ? emissionsData[emissionsData.length - 1] : {};
  const firstEmissionYear = emissionsData.length > 0 ? emissionsData[0] : {};
  const percentageChange = firstEmissionYear.total > 0 
    ? (((lastEmissionYear.total - firstEmissionYear.total) / firstEmissionYear.total) * 100).toFixed(1)
    : 0;

  return (
    <div style={{
      padding: spacing.padding,
      height: '100%',
      width: containerWidth,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(12px)',
      border: '1px solid rgba(0, 0, 0, 0.05)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{ marginBottom: spacing.marginBottom }}>
        <h3 style={{
          color: 'black',
          fontSize: fontSize.title,
          margin: '0 0 8px 0',
          fontWeight: '600'
        }}>
          Emissions Tracking
        </h3>
        <p style={{
          color: '#333',
          fontSize: fontSize.subtitle,
          margin: '0'
        }}>
          Live carbon footprint monitoring across all scopes.
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
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            color: 'black',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: fontSize.legend,
            cursor: 'pointer'
          }}
        >
          <option value="line">Line</option>
          <option value="bar">Bar (Stacked)</option>
          <option value="area">Area (Stacked)</option>
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
          color: '#555',
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
                padding: '0 12px',
                borderRadius: '12px',
                border: `1px solid ${toggles[scope] ? 'transparent' : chartColors[scope]}`,
                backgroundColor: toggles[scope] ? chartColors[scope] : 'transparent',
                color: toggles[scope] ? 'white' : chartColors[scope],
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontWeight: '600'
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
        gap: '8px',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        paddingTop: '16px'
      }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            color: '#1AC99F',
            fontSize: fontSize.stats,
            fontWeight: '600'
          }}>
            {lastEmissionYear.total ? lastEmissionYear.total.toLocaleString() : 'N/A'}
          </div>
          <div style={{
            color: '#555',
            fontSize: fontSize.statsLabel
          }}>
            Latest tCO₂e
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            color: percentageChange > 0 ? '#E74C3C' : '#2ECC71',
            fontSize: fontSize.stats,
            fontWeight: '600'
          }}>
            {percentageChange}%
          </div>
          <div style={{
            color: '#555',
            fontSize: fontSize.statsLabel
          }}>
            vs {firstEmissionYear.year || 'Start'}
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{
            color: '#3498db',
            fontSize: fontSize.stats,
            fontWeight: '600'
          }}>
            {emissionsData.length}
          </div>
          <div style={{
            color: '#555',
            fontSize: fontSize.statsLabel
          }}>
            Years
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmissionsChart;


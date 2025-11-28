import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { scale, scaleFont } from './utils';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LogGraph = ({ events, currentHour }) => {
  const graphWidth = SCREEN_WIDTH - scale(180); // More room for labels on left/right
  const graphHeight = scale(240);
  const hourWidth = graphWidth / 24;
  const lineHeight = graphHeight / 4;
  
  const statusColors = {
    OFF_DUTY: '#60a5fa',
    SLEEPER: '#3B82F6',
    DRIVING: '#10B981',
    ON_DUTY: '#F59E0B'
  };
  
  const statusYPositions = {
    OFF_DUTY: 0,
    SLEEPER: lineHeight,
    DRIVING: lineHeight * 2,
    ON_DUTY: lineHeight * 3
  };

  const statusLabels = ['OFF', 'SLEEPER', 'DRIVING', 'ON'];

  // Calculate total time for each status
  const calculateTotalTime = (status) => {
    const total = events
      .filter(e => e.status === status)
      .reduce((sum, e) => sum + e.duration, 0);
    
    const hours = Math.floor(total);
    const minutes = Math.floor((total % 1) * 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <View style={styles.logGraphWrapper}>
      {/* Left side - Status labels */}
      <View style={styles.logGraphLeftLabels}>
        {statusLabels.map((label, idx) => (
          <View key={label} style={[styles.logGraphLeftLabel, { height: lineHeight }]}>
            <Text style={[styles.logGraphLeftLabelText, { fontSize: scaleFont(10) }]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Main graph container */}
      <View style={styles.logGraphMainContainer}>
        <Svg width={graphWidth} height={graphHeight}>
          {/* Vertical hour grid lines (main lines) */}
          {[...Array(25)].map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={i * hourWidth}
              y1={0}
              x2={i * hourWidth}
              y2={graphHeight}
              stroke="#334155"
              strokeWidth="2"
            />
          ))}
          
          {/* 15-minute increment tick marks */}
          {[...Array(24)].map((_, hour) => 
            [0.25, 0.5, 0.75].map((fraction) => (
              <Line
                key={`tick-${hour}-${fraction}`}
                x1={(hour + fraction) * hourWidth}
                y1={graphHeight - scale(10)}
                x2={(hour + fraction) * hourWidth}
                y2={graphHeight}
                stroke="#475569"
                strokeWidth="1"
              />
            ))
          )}
          
          {/* Horizontal status separator lines */}
          {[1, 2, 3].map(i => (
            <Line
              key={`h-line-${i}`}
              x1={0}
              y1={lineHeight * i}
              x2={graphWidth}
              y2={lineHeight * i}
              stroke="#475569"
              strokeWidth="1"
            />
          ))}
          
          {/* Event blocks - Fill the entire row height */}
          {events.map((event, idx) => {
            const startX = (event.startHour + (event.startMinute || 0) / 60) * hourWidth;
            const blockWidth = event.duration * hourWidth;
            const y = statusYPositions[event.status];
            const blockHeight = lineHeight;
            
            return (
              <Rect
                key={`event-${idx}`}
                x={startX}
                y={y}
                width={blockWidth}
                height={blockHeight}
                fill={statusColors[event.status]}
                opacity={0.8}
              />
            );
          })}
          
          {/* Current time indicator - White vertical line */}
          {currentHour !== undefined && (
            <Line
              x1={currentHour * hourWidth}
              y1={0}
              x2={currentHour * hourWidth}
              y2={graphHeight}
              stroke="#ffffff"
              strokeWidth="2"
            />
          )}
        </Svg>
        
        {/* Bottom hour markers - Military time */}
        <View style={styles.logGraphHourMarkers}>
          {[...Array(25)].map((_, i) => (
            <Text key={`hour-${i}`} style={[styles.logGraphHourMarker, { fontSize: scaleFont(9) }]}>
              {i === 24 ? '0' : i}
            </Text>
          ))}
        </View>
      </View>

      {/* Right side - Total times */}
      <View style={styles.logGraphRightTimes}>
        <View style={[styles.logGraphRightTime, { height: lineHeight }]}>
          <Text style={[styles.logGraphRightTimeText, { fontSize: scaleFont(10) }]}>{calculateTotalTime('OFF_DUTY')}</Text>
        </View>
        <View style={[styles.logGraphRightTime, { height: lineHeight }]}>
          <Text style={[styles.logGraphRightTimeText, { fontSize: scaleFont(10) }]}>{calculateTotalTime('SLEEPER')}</Text>
        </View>
        <View style={[styles.logGraphRightTime, { height: lineHeight }]}>
          <Text style={[styles.logGraphRightTimeText, { fontSize: scaleFont(10) }]}>{calculateTotalTime('DRIVING')}</Text>
        </View>
        <View style={[styles.logGraphRightTime, { height: lineHeight }]}>
          <Text style={[styles.logGraphRightTimeText, { fontSize: scaleFont(10) }]}>{calculateTotalTime('ON_DUTY')}</Text>
        </View>
      </View>
    </View>
  );
};
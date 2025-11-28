import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { scale, scaleFont } from './utils';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LogGraph = ({ events, currentHour }) => {
  const graphWidth = SCREEN_WIDTH - scale(100);
  const graphHeight = scale(240);
  const hourWidth = graphWidth / 24;
  const lineHeight = graphHeight / 4; // Each status gets exactly 1/4 of height
  
  const statusColors = {
    OFF_DUTY: '#60a5fa',    // Light blue
    SLEEPER: '#3B82F6',     // Blue
    DRIVING: '#10B981',     // Green
    ON_DUTY: '#F59E0B'      // Orange/Yellow
  };
  
  // Y positions - each status starts at exact multiples of lineHeight
  const statusYPositions = {
    OFF_DUTY: 0,
    SLEEPER: lineHeight,
    DRIVING: lineHeight * 2,
    ON_DUTY: lineHeight * 3
  };

  const statusLabels = ['OFF', 'SLEEPER', 'DRIVING', 'ON'];

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
          {/* Vertical hour grid lines */}
          {[...Array(25)].map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={i * hourWidth}
              y1={0}
              x2={i * hourWidth}
              y2={graphHeight}
              stroke="#334155"
              strokeWidth="1"
            />
          ))}
          
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
          
          {/* Event blocks - FILL ENTIRE ROW HEIGHT WITH NO GAPS */}
          {events.map((event, idx) => {
            const startX = (event.startHour + (event.startMinute || 0) / 60) * hourWidth;
            const blockWidth = event.duration * hourWidth;
            const y = statusYPositions[event.status];
            
            return (
              <Rect
                key={`event-${idx}`}
                x={startX}
                y={y}
                width={blockWidth}
                height={lineHeight}  // EXACTLY lineHeight - fills the row completely
                fill={statusColors[event.status]}
                opacity={0.9}
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
        
        {/* Bottom hour markers */}
        <View style={styles.logGraphHourMarkers}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24].map((hour) => (
            <View key={`hour-${hour}`} style={{ width: hourWidth, alignItems: 'center' }}>
              {hour % 3 === 0 && (
                <Text style={[styles.logGraphHourMarker, { fontSize: scaleFont(9) }]}>
                  {hour === 0 ? '0' : hour}
                </Text>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Right side - Total times */}
      <View style={styles.logGraphRightTimes}>
        <View style={[styles.logGraphRightTime, { height: lineHeight }]}>
          <Text style={[styles.logGraphRightTimeText, { fontSize: scaleFont(10) }]}>05:30</Text>
        </View>
        <View style={[styles.logGraphRightTime, { height: lineHeight }]}>
          <Text style={[styles.logGraphRightTimeText, { fontSize: scaleFont(10) }]}>07:00</Text>
        </View>
        <View style={[styles.logGraphRightTime, { height: lineHeight }]}>
          <Text style={[styles.logGraphRightTimeText, { fontSize: scaleFont(10) }]}>10:45</Text>
        </View>
        <View style={[styles.logGraphRightTime, { height: lineHeight }]}>
          <Text style={[styles.logGraphRightTimeText, { fontSize: scaleFont(10) }]}>00:45</Text>
        </View>
      </View>
    </View>
  );
};
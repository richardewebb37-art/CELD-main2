import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';
import { scale, scaleFont } from './utils';
import { styles } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const LogGraph = ({ events, currentHour }) => {
  const graphWidth = SCREEN_WIDTH - scale(40);
  const graphHeight = scale(200);
  const hourWidth = graphWidth / 24;
  const lineHeight = graphHeight / 4;
  
  const statusColors = {
    OFF_DUTY: '#6B7280',
    SLEEPER: '#3B82F6',
    DRIVING: '#10B981',
    ON_DUTY: '#F59E0B'
  };
  
  const statusYPositions = {
    OFF_DUTY: lineHeight * 0.5,
    SLEEPER: lineHeight * 1.5,
    DRIVING: lineHeight * 2.5,
    ON_DUTY: lineHeight * 3.5
  };

  const statusLabels = ['OFF', 'SB', 'D', 'ON'];

  return (
    <View style={styles.logGraphWrapper}>
      {/* Status labels on left */}
      <View style={styles.logGraphStatusLabels}>
        {statusLabels.map((label, idx) => (
          <View key={label} style={[styles.logGraphStatusLabel, { height: lineHeight }]}>
            <Text style={[styles.logGraphStatusLabelText, { fontSize: scaleFont(11) }]}>{label}</Text>
          </View>
        ))}
      </View>

      {/* Main graph */}
      <View style={styles.logGraphContainer}>
        <Svg width={graphWidth} height={graphHeight}>
          {/* Hour grid lines */}
          {[...Array(25)].map((_, i) => (
            <Line
              key={`grid-${i}`}
              x1={i * hourWidth}
              y1={0}
              x2={i * hourWidth}
              y2={graphHeight}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray={i % 6 === 0 ? "0" : "4,4"}
            />
          ))}
          
          {/* Status lines */}
          {[0, 1, 2, 3].map(i => (
            <Line
              key={`status-line-${i}`}
              x1={0}
              y1={lineHeight * (i + 0.5)}
              x2={graphWidth}
              y2={lineHeight * (i + 0.5)}
              stroke="#475569"
              strokeWidth="2"
            />
          ))}
          
          {/* Event blocks */}
          {events.map((event, idx) => {
            const startX = (event.startHour + event.startMinute / 60) * hourWidth;
            const width = event.duration * hourWidth;
            const y = statusYPositions[event.status] - scale(15);
            
            return (
              <Rect
                key={`event-${idx}`}
                x={startX}
                y={y}
                width={width}
                height={scale(30)}
                fill={statusColors[event.status]}
                rx={scale(4)}
              />
            );
          })}
          
          {/* Current time indicator */}
          <Line
            x1={currentHour * hourWidth}
            y1={0}
            x2={currentHour * hourWidth}
            y2={graphHeight}
            stroke="#ef4444"
            strokeWidth="3"
          />
        </Svg>
        
        {/* Hour labels */}
        <View style={styles.hourLabels}>
          {[0, 6, 12, 18, 24].map(hour => (
            <Text key={`hour-${hour}`} style={[styles.hourLabel, { fontSize: scaleFont(10) }]}>
              {hour === 0 ? '12AM' : hour === 12 ? '12PM' : hour > 12 ? `${hour-12}PM` : `${hour}AM`}
            </Text>
          ))}
        </View>
      </View>

      {/* Total times on right */}
      <View style={styles.logGraphTotalTimes}>
        {['08:45:30', '07:00:00', '06:15:20', '01:59:10'].map((time, idx) => (
          <View key={idx} style={[styles.logGraphTotalTime, { height: lineHeight }]}>
            <Text style={[styles.logGraphTotalTimeText, { fontSize: scaleFont(10) }]}>{time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
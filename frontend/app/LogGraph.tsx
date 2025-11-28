import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Svg, { Rect, Line, Text as SvgText } from 'react-native-svg';
import { scale, scaleFont, SCREEN_WIDTH } from './utils';
import { styles } from './styles';

interface LogEvent {
  id: number;
  status: string;
  startHour: number;
  startMinute: number;
  duration: number;
  activity?: string | null;
  editable: boolean;
  inspectionDuration?: number;
}

interface LogGraphProps {
  events: LogEvent[];
  currentHour: number;
}

const statusColors: Record<string, string> = {
  OFF_DUTY: '#6B7280',
  SLEEPER: '#3B82F6',
  DRIVING: '#10B981',
  ON_DUTY: '#F59E0B'
};

export const LogGraph = ({ events, currentHour }: LogGraphProps) => {
  const graphWidth = SCREEN_WIDTH - scale(64);
  const graphHeight = scale(200);
  const hourWidth = graphWidth / 24;

  return (
    <View style={styles.logGraph}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Time labels */}
          <View style={{ flexDirection: 'row', marginBottom: scale(8) }}>
            {Array.from({ length: 25 }).map((_, i) => (
              <View key={i} style={{ width: hourWidth, alignItems: 'center' }}>
                <Text style={[styles.logGraphTime, { fontSize: scaleFont(10) }]}>
                  {i}:00
                </Text>
              </View>
            ))}
          </View>

          {/* Graph SVG */}
          <Svg width={graphWidth} height={graphHeight}>
            {/* Grid lines */}
            {Array.from({ length: 25 }).map((_, i) => (
              <Line
                key={i}
                x1={i * hourWidth}
                y1={0}
                x2={i * hourWidth}
                y2={graphHeight}
                stroke="#334155"
                strokeWidth="1"
              />
            ))}

            {/* Status bars */}
            {events.map((event) => {
              const x = event.startHour * hourWidth;
              const width = event.duration * hourWidth;
              const statusIndex = Object.keys(statusColors).indexOf(event.status);
              const y = statusIndex * (graphHeight / 4);
              const height = graphHeight / 4;

              return (
                <Rect
                  key={event.id}
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill={statusColors[event.status]}
                  opacity={0.8}
                />
              );
            })}

            {/* Current time indicator */}
            <Line
              x1={currentHour * hourWidth}
              y1={0}
              x2={currentHour * hourWidth}
              y2={graphHeight}
              stroke="#60a5fa"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </Svg>

          {/* Status labels */}
          <View style={styles.logGraphLabels}>
            {Object.entries(statusColors).map(([status, color]) => (
              <View key={status} style={styles.logGraphLabelRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View 
                    style={{ 
                      width: scale(12), 
                      height: scale(12), 
                      backgroundColor: color, 
                      marginRight: scale(8),
                      borderRadius: scale(2)
                    }} 
                  />
                  <Text style={[styles.logGraphLabel, { fontSize: scaleFont(12) }]}>
                    {status.replace('_', ' ')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
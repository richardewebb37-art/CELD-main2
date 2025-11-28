import React from 'react';
import { View, Text, Platform } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { scale, scaleFont } from './utils';
import { styles } from './styles';

export const GaugeDisplay = ({ hours, minutes, seconds, max, color, label }) => {
  const totalHours = hours + (minutes / 60) + (seconds / 3600);
  const percentage = (totalHours / max) * 100;
  const size = scale(120);
  const strokeWidth = scale(12);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const formatTime = (h, m, s) => 
    `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <View style={styles.gaugeWrapper}>
      <Text style={[styles.gaugeLabel, { fontSize: scaleFont(10) }]}>{label}</Text>
      <View style={styles.gaugeContainer}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <Circle 
            cx={size/2} 
            cy={size/2} 
            r={radius} 
            stroke="#1F2937" 
            strokeWidth={strokeWidth} 
            fill="none"
          />
          <Circle 
            cx={size/2} 
            cy={size/2} 
            r={radius} 
            stroke={color} 
            strokeWidth={strokeWidth} 
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`} 
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round" 
            transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        </Svg>
        <View style={styles.gaugeCenter}>
          <Text style={[styles.gaugeTimeText, { fontSize: scaleFont(14) }]}>
            {formatTime(hours, minutes, seconds)}
          </Text>
        </View>
      </View>
    </View>
  );
};
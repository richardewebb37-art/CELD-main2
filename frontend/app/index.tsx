import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_SCREEN_SIZE = 8.5;
const currentScreenSize = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 160;
const SCALE_FACTOR = Math.min(Math.max(currentScreenSize / BASE_SCREEN_SIZE, 0.8), 1.2);

const scale = (size) => Math.round(size * SCALE_FACTOR);
const scaleFont = (size) => Math.round(size * SCALE_FACTOR * 0.9);

const ELDDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentStatus, setCurrentStatus] = useState('OFF_DUTY');
  const [showOnDutyMenu, setShowOnDutyMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHamburgerMenu, setShowHamburgerMenu] = useState(false);
  const [statusDuration, setStatusDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [location, setLocation] = useState('Dallas, TX');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('hours');

  const driverInfo = {
    name: 'John Cooper',
    driverId: 'DRV-12345',
    truckNumber: 'TRK-789',
    companyId: 'CMP-001'
  };

  const [ruleSet, setRuleSet] = useState('60/7 Day Rule');
  const [gauges, setGauges] = useState({
    break8: { hours: 7, minutes: 59, seconds: 45, max: 8 },
    drive11: { hours: 10, minutes: 45, seconds: 20, max: 11 },
    shift14: { hours: 13, minutes: 30, seconds: 10, max: 14 }
  });

  const statuses = {
    OFF_DUTY: { code: 'OD', color: '#6B7280', active: '#9CA3AF' },
    SLEEPER: { code: 'SB', color: '#3B82F6', active: '#60A5FA' },
    DRIVING: { code: 'D', color: '#10B981', active: '#34D399' },
    ON_DUTY: { code: 'ON', color: '#F59E0B', active: '#FBBF24' }
  };

  const onDutyActivities = [
    'Fueling',
    'Loading',
    'Unloading',
    'Pre-Trip Inspection',
    'Post-Trip Inspection',
    'Yard Move',
    'Personal Conveyance (PC)'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setStatusDuration(prev => {
        let newSeconds = prev.seconds + 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        if (newSeconds >= 60) {
          newSeconds = 0;
          newMinutes += 1;
        }
        if (newMinutes >= 60) {
          newMinutes = 0;
          newHours += 1;
        }
        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });

      if (currentStatus === 'DRIVING' || currentStatus === 'ON_DUTY') {
        setGauges(prev => {
          const updateGauge = (gauge) => {
            let newSeconds = gauge.seconds - 1;
            let newMinutes = gauge.minutes;
            let newHours = gauge.hours;
            if (newSeconds < 0) {
              newSeconds = 59;
              newMinutes -= 1;
            }
            if (newMinutes < 0) {
              newMinutes = 59;
              newHours -= 1;
            }
            if (newHours < 0) {
              newHours = 0;
              newMinutes = 0;
              newSeconds = 0;
            }
            return { ...gauge, hours: newHours, minutes: newMinutes, seconds: newSeconds };
          };
          return {
            break8: currentStatus === 'DRIVING' ? updateGauge(prev.break8) : prev.break8,
            drive11: currentStatus === 'DRIVING' ? updateGauge(prev.drive11) : prev.drive11,
            shift14: updateGauge(prev.shift14)
          };
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentStatus]);

  const handleStatusChange = (status) => {
    if (status === 'ON_DUTY') {
      setShowOnDutyMenu(true);
    } else {
      setCurrentStatus(status);
      setStatusDuration({ hours: 0, minutes: 0, seconds: 0 });
    }
  };

  const handleOnDutyActivity = (activity) => {
    setCurrentStatus('ON_DUTY');
    setShowOnDutyMenu(false);
    setStatusDuration({ hours: 0, minutes: 0, seconds: 0 });
  };

  const formatTime = (hours, minutes, seconds) => {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const GaugeDisplay = ({ hours, minutes, seconds, max, color, label }) => {
    const totalHours = hours + (minutes / 60) + (seconds / 3600);
    const percentage = (totalHours / max) * 100;
    const size = scale(140);
    const strokeWidth = scale(14);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.gaugeWrapper}>
        <Text style={[styles.gaugeLabel, { fontSize: scaleFont(11) }]}>{label}</Text>
        <View style={styles.gaugeContainer}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#1F2937"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          <View style={styles.gaugeCenter}>
            <Text style={[styles.gaugeTimeText, { fontSize: scaleFont(16) }]}>
              {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <View style={styles.topToolbar}>
        <TouchableOpacity 
          onPress={() => setShowHamburgerMenu(!showHamburgerMenu)} 
          style={styles.menuButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.menuIcon, { fontSize: scale(24) }]}>☰</Text>
        </TouchableOpacity>
        
        <Text style={[styles.toolbarTitle, { fontSize: scaleFont(18) }]}>LogMaster ELD</Text>
        
        <TouchableOpacity 
          onPress={() => setShowUserMenu(!showUserMenu)} 
          style={styles.userButton}
          activeOpacity={0.7}
        >
          <Text style={[styles.userIcon, { fontSize: scaleFont(20) }]}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.mainContent} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
        {activeScreen === 'dashboard' && (
          <>
            <View style={styles.driverInfoContainer}>
              <Text style={[styles.driverName, { fontSize: scaleFont(20) }]}>{driverInfo.name}</Text>
              <Text style={[styles.driverDetails, { fontSize: scaleFont(12) }]}>
                Driver: {driverInfo.driverId} | Truck: {driverInfo.truckNumber} | Company: {driverInfo.companyId}
              </Text>
            </View>

            <View style={styles.statusCard}>
              <View style={styles.statusRow}>
                <View style={styles.infoSection}>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoIcon, { fontSize: scale(16) }]}>⏱️</Text>
                    <Text style={[styles.infoText, { fontSize: scaleFont(11) }]}>
                      {currentTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoIcon, { fontSize: scale(16) }]}>☁️</Text>
                    <Text style={[styles.infoText, { fontSize: scaleFont(11) }]}>72°F</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoIcon, { fontSize: scale(16) }]}>📍</Text>
                    <Text style={[styles.infoText, { fontSize: scaleFont(11) }]}>{location}</Text>
                  </View>
                </View>

                <View style={styles.statusDisplayContainer}>
                  <View style={styles.statusDisplay}>
                    <Text style={[styles.statusTextLabel, { fontSize: scaleFont(10) }]}>STATUS</Text>
                    <Text style={[styles.statusText, { color: statuses[currentStatus].active, fontSize: scaleFont(16) }]}>
                      {currentStatus.replace('_', ' ')}
                    </Text>
                    <Text style={[styles.statusDuration, { fontSize: scaleFont(26) }]}>
                      {formatTime(statusDuration.hours, statusDuration.minutes, statusDuration.seconds)}
                    </Text>
                  </View>
                </View>

                <View style={styles.statusButtonsContainer}>
                  <View style={styles.statusButtons}>
                    {Object.entries(statuses).map(([key, value]) => (
                      <TouchableOpacity
                        key={key}
                        onPress={() => handleStatusChange(key)}
                        style={[styles.statusButton, currentStatus === key && styles.activeStatusButton]}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.statusButtonText, { 
                          color: currentStatus === key ? value.active : value.color,
                          fontSize: scaleFont(11)
                        }]}>
                          {value.code}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            <Modal visible={showOnDutyMenu} transparent animationType="fade" onRequestClose={() => setShowOnDutyMenu(false)}>
              <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                  <Text style={[styles.modalTitle, { fontSize: scaleFont(18) }]}>Select On-Duty Activity</Text>
                  <ScrollView style={styles.modalScrollView}>
                    {onDutyActivities.map((activity) => (
                      <TouchableOpacity
                        key={activity}
                        onPress={() => handleOnDutyActivity(activity)}
                        style={styles.activityButton}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.activityText, { fontSize: scaleFont(15) }]}>{activity}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  <TouchableOpacity onPress={() => setShowOnDutyMenu(false)} style={styles.cancelButton} activeOpacity={0.7}>
                    <Text style={[styles.cancelText, { fontSize: scaleFont(15) }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <View style={styles.ruleContainer}>
              <Text style={[styles.ruleLabel, { fontSize: scaleFont(12) }]}>Active Rule: </Text>
              <TouchableOpacity onPress={() => {
                const rules = ['60/7 Day Rule', '70/8 Day Rule', '8/2 Split', '7/3 Split'];
                const currentIndex = rules.indexOf(ruleSet);
                setRuleSet(rules[(currentIndex + 1) % rules.length]);
              }} activeOpacity={0.7}>
                <Text style={[styles.ruleValue, { fontSize: scaleFont(14) }]}>{ruleSet}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gaugesContainer}>
              <GaugeDisplay hours={gauges.break8.hours} minutes={gauges.break8.minutes} seconds={gauges.break8.seconds} max={gauges.break8.max} color="#EF4444" label="8-Hour Break" />
              <GaugeDisplay hours={gauges.drive11.hours} minutes={gauges.drive11.minutes} seconds={gauges.drive11.seconds} max={gauges.drive11.max} color="#10B981" label="11-Hour Drive" />
              <GaugeDisplay hours={gauges.shift14.hours} minutes={gauges.shift14.minutes} seconds={gauges.shift14.seconds} max={gauges.shift14.max} color="#F59E0B" label="14-Hour Shift" />
            </View>
          </>
        )}

        {activeScreen !== 'dashboard' && (
          <View style={styles.placeholderScreen}>
            <Text style={[styles.placeholderText, { fontSize: scaleFont(18) }]}>
              {activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)} Screen
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => { setActiveScreen('dashboard'); }} style={[styles.navItem, activeScreen === 'dashboard' && styles.activeNavItem]} activeOpacity={0.7}>
          <Text style={[styles.navIcon, { fontSize: scale(24) }]}>🏠</Text>
          <Text style={[styles.navLabel, { fontSize: scaleFont(10) }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setActiveScreen('hours'); }} style={[styles.navItem, activeScreen === 'hours' && styles.activeNavItem]} activeOpacity={0.7}>
          <Text style={[styles.navIcon, { fontSize: scale(24) }]}>⏱️</Text>
          <Text style={[styles.navLabel, { fontSize: scaleFont(10) }]}>Hours</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setActiveScreen('roadside'); }} style={[styles.navItem, activeScreen === 'roadside' && styles.activeNavItem]} activeOpacity={0.7}>
          <Text style={[styles.navIcon, { fontSize: scale(24) }]}>🛡️</Text>
          <Text style={[styles.navLabel, { fontSize: scaleFont(10) }]}>Roadside</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setActiveScreen('communications'); }} style={[styles.navItem, activeScreen === 'communications' && styles.activeNavItem]} activeOpacity={0.7}>
          <Text style={[styles.navIcon, { fontSize: scale(24) }]}>💬</Text>
          <Text style={[styles.navLabel, { fontSize: scaleFont(10) }]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setActiveScreen('navigation'); }} style={[styles.navItem, activeScreen === 'navigation' && styles.activeNavItem]} activeOpacity={0.7}>
          <Text style={[styles.navIcon, { fontSize: scale(24) }]}>🗺️</Text>
          <Text style={[styles.navLabel, { fontSize: scaleFont(10) }]}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  topToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(16), paddingVertical: scale(12), backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  menuButton: { padding: scale(8) },
  menuIcon: { color: '#94a3b8' },
  toolbarTitle: { fontWeight: 'bold', color: '#60a5fa' },
  userButton: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' },
  userIcon: { color: '#cbd5e1' },
  mainContent: { flex: 1 },
  contentContainer: { padding: scale(16), paddingBottom: scale(100) },
  driverInfoContainer: { marginBottom: scale(16) },
  driverName: { fontWeight: '600', color: '#f1f5f9' },
  driverDetails: { color: '#94a3b8', marginTop: scale(4) },
  statusCard: { backgroundColor: '#1e293b', borderRadius: scale(12), padding: scale(16), marginBottom: scale(20), borderWidth: 1, borderColor: '#334155' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoSection: { flex: 1, gap: scale(6) },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  infoIcon: {},
  infoText: { color: '#cbd5e1' },
  statusDisplayContainer: { flex: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(12) },
  statusDisplay: { alignItems: 'center', justifyContent: 'center' },
  statusTextLabel: { textTransform: 'uppercase', letterSpacing: 1.2, color: '#94a3b8', marginBottom: scale(2), fontWeight: '600' },
  statusText: { fontWeight: 'bold', marginBottom: scale(2), textAlign: 'center' },
  statusDuration: { fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#f1f5f9', letterSpacing: 1 },
  statusButtonsContainer: { flex: 1, alignItems: 'flex-end' },
  statusButtons: { flexDirection: 'column', gap: scale(3), backgroundColor: '#0f172a', borderRadius: scale(8), padding: scale(4) },
  statusButton: { paddingHorizontal: scale(10), paddingVertical: scale(5), borderRadius: scale(6), minWidth: scale(45) },
  activeStatusButton: { backgroundColor: 'rgba(255,255,255,0.1)' },
  statusButtonText: { fontWeight: 'bold', textAlign: 'center' },
  gaugesContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: scale(20), flexWrap: 'wrap', gap: scale(10) },
  gaugeWrapper: { alignItems: 'center', marginBottom: scale(10) },
  gaugeLabel: { color: '#94a3b8', marginBottom: scale(8), textAlign: 'center', fontWeight: '600' },
  gaugeContainer: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gaugeCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  gaugeTimeText: { fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#f1f5f9' },
  ruleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: scale(20), backgroundColor: '#1e293b', padding: scale(12), borderRadius: scale(8), borderWidth: 1, borderColor: '#334155' },
  ruleLabel: { color: '#94a3b8' },
  ruleValue: { fontWeight: 'bold', color: '#60a5fa' },
  bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#1e293b', borderTopWidth: 1, borderTopColor: '#334155', paddingVertical: scale(8), paddingBottom: Platform.OS === 'ios' ? scale(24) : scale(8), position: 'absolute', bottom: 0, left: 0, right: 0 },
  navItem: { alignItems: 'center', justifyContent: 'center', padding: scale(6), borderRadius: scale(8), minWidth: scale(60) },
  activeNavItem: { backgroundColor: 'rgba(96, 165, 250, 0.2)' },
  navIcon: { marginBottom: scale(2) },
  navLabel: { color: '#94a3b8', fontWeight: '500', marginTop: scale(2) },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: scale(20) },
  modalContent: { backgroundColor: '#1e293b', borderRadius: scale(12), padding: scale(20), width: SCREEN_WIDTH * 0.85, maxHeight: SCREEN_HEIGHT * 0.7, borderWidth: 1, borderColor: '#334155' },
  modalTitle: { fontWeight: 'bold', color: '#f1f5f9', marginBottom: scale(16), textAlign: 'center' },
  modalScrollView: { maxHeight: SCREEN_HEIGHT * 0.5 },
  activityButton: { backgroundColor: '#334155', padding: scale(14), borderRadius: scale(8), marginBottom: scale(8) },
  activityText: { color: '#f1f5f9', textAlign: 'center' },
  cancelButton: { backgroundColor: '#dc2626', padding: scale(14), borderRadius: scale(8), marginTop: scale(12) },
  cancelText: { color: '#f1f5f9', textAlign: 'center', fontWeight: 'bold' },
  placeholderScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: scale(100) },
  placeholderText: { color: '#94a3b8', fontWeight: '600' },
});

export default ELDDashboard;

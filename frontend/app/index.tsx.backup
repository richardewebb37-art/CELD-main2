import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, SafeAreaView,
  Dimensions, Platform, StatusBar, TextInput, Alert, BackHandler,
} from 'react-native';
import Svg, { Circle, Path, Line } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BASE_SCREEN_SIZE = 8.5;
const currentScreenSize = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 160;
const SCALE_FACTOR = Math.min(Math.max(currentScreenSize / BASE_SCREEN_SIZE, 0.8), 1.2);
const scale = (size: number) => Math.round(size * SCALE_FACTOR);
const scaleFont = (size: number) => Math.round(size * SCALE_FACTOR * 0.9);

// SVG Icons
const HamburgerIcon = ({ size = 24, color = '#94a3b8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="3" y1="6" x2="21" y2="6" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <Line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const UserIcon = ({ size = 24, color = '#cbd5e1' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2"/>
    <Path d="M5 20c0-4 3-7 7-7s7 3 7 7" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const HomeIcon = ({ size = 24, color = '#94a3b8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 12l9-9 9 9M5 10v10h14V10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const ClockIcon = ({ size = 24, color = '#94a3b8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2"/>
    <Path d="M12 7v5l3 3" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </Svg>
);

const ShieldIcon = ({ size = 24, color = '#94a3b8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Path d="M9 12l2 2 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MessageIcon = ({ size = 24, color = '#94a3b8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </Svg>
);

const MapIcon = ({ size = 24, color = '#94a3b8' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <Line x1="9" y1="3" x2="9" y2="18" stroke={color} strokeWidth="2"/>
    <Line x1="15" y1="6" x2="15" y2="21" stroke={color} strokeWidth="2"/>
  </Svg>
);

const ELDDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentStatus, setCurrentStatus] = useState('OFF_DUTY');
  const [showOnDutyMenu, setShowOnDutyMenu] = useState(false);
  const [statusDuration, setStatusDuration] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [location, setLocation] = useState('Dallas, TX');
  const [activeScreen, setActiveScreen] = useState('dashboard');
  
  // DVIR Lock States
  const [dvirLocked, setDvirLocked] = useState(false);
  const [dvirType, setDvirType] = useState('');
  const [dvirTimer, setDvirTimer] = useState(0);
  const [dvirChecklist, setDvirChecklist] = useState<Record<string, boolean>>({});
  const [showDefectModal, setShowDefectModal] = useState(false);
  const [currentDefectItem, setCurrentDefectItem] = useState('');
  
  // Roadside Lock States
  const [roadsideLocked, setRoadsideLocked] = useState(false);
  const [roadsidePin, setRoadsidePin] = useState('');
  const [showRoadsidePinModal, setShowRoadsidePinModal] = useState(false);
  const [showExitPinModal, setShowExitPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');

  // Hours Screen States
  const [hoursTab, setHoursTab] = useState('hos');
  const [logDate, setLogDate] = useState(new Date());

  const driverInfo = {
    name: 'John Cooper',
    driverId: 'DRV-12345',
    truckNumber: 'TRK-789',
    trailerNumber: 'TRL-456',
    companyId: 'CMP-001'
  };

  const [ruleSet, setRuleSet] = useState('60/7 Day Rule');
  const [gauges, setGauges] = useState({
    break8: { hours: 7, minutes: 59, seconds: 45, max: 8 },
    drive11: { hours: 10, minutes: 45, seconds: 20, max: 11 },
    shift14: { hours: 13, minutes: 30, seconds: 10, max: 14 },
    weekly70: { hours: 65, minutes: 30, seconds: 0, max: 70 }
  });

  const [recapInfo, setRecapInfo] = useState({
    recapStartsDate: 'Dec 5, 2024',
    timeRegained: '02:15:00',
    nextRecapDate: 'Dec 6, 2024',
    timeToGain: '03:45:00'
  });

  const statuses: Record<string, { code: string; color: string; active: string }> = {
    OFF_DUTY: { code: 'OD', color: '#6B7280', active: '#9CA3AF' },
    SLEEPER: { code: 'SB', color: '#3B82F6', active: '#60A5FA' },
    DRIVING: { code: 'D', color: '#10B981', active: '#34D399' },
    ON_DUTY: { code: 'ON', color: '#F59E0B', active: '#FBBF24' }
  };

  const onDutyActivities = [
    'Pre-Trip Inspection',
    'En-Route Inspection',
    'Post-Trip Inspection',
    'Fueling',
    'Loading',
    'Unloading',
    'Yard Move',
    'Personal Conveyance (PC)'
  ];

  const dvirItems: Record<string, string[]> = {
    'Tires': ['Front Left', 'Front Right', 'Rear Left', 'Rear Right', 'Other'],
    'Brakes': ['Air Pressure', 'Function', 'Parking Brake', 'Other'],
    'Lights': ['Headlights', 'Turn Signals', 'Brake Lights', 'Clearance Lights', 'Other'],
    'Mirrors': ['Driver Side', 'Passenger Side', 'Adjustment', 'Other'],
    'Horn': ['Function', 'Other'],
    'Wipers & Washers': ['Wiper Left Arm', 'Wiper Right Arm', 'Nozzle', 'Sprayer', 'Washer Fluid Line', 'Other'],
    'Steering': ['Play/Looseness', 'Alignment', 'Other'],
    'Coupling Devices': ['Fifth Wheel', 'Kingpin', 'Safety Chains', 'Other'],
    'Cargo Securement': ['Straps', 'Chains', 'Load Distribution', 'Other'],
    'Emergency Equipment': ['Fire Extinguisher', 'Warning Triangles', 'First Aid Kit', 'Other'],
    'Fluid Levels': ['Engine Oil', 'Coolant', 'Washer Fluid', 'Other'],
    'Body/Exterior': ['Damage', 'Leaks', 'Doors', 'Other']
  };

  // BLOCK ANDROID BACK BUTTON WHEN LOCKED
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (dvirLocked || roadsideLocked) {
        Alert.alert('Screen Locked', 'You must complete this process before exiting.');
        return true; // Block back button
      }
      return false; // Allow back button
    });

    return () => backHandler.remove();
  }, [dvirLocked, roadsideLocked]);

  const generatePin = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleRoadsideOneTap = () => {
    const newPin = generatePin();
    setRoadsidePin(newPin);
    setShowRoadsidePinModal(true);
  };

  const continueToRoadside = () => {
    setShowRoadsidePinModal(false);
    setRoadsideLocked(true); // LOCK THE SCREEN
  };

  const attemptExitRoadside = () => {
    setShowExitPinModal(true);
    setEnteredPin('');
  };

  const verifyPinAndExit = () => {
    if (enteredPin === roadsidePin) {
      setShowExitPinModal(false);
      setRoadsideLocked(false); // UNLOCK
      setActiveScreen('dashboard');
      setEnteredPin('');
      setRoadsidePin('');
    } else {
      Alert.alert('Incorrect PIN', 'The PIN you entered is incorrect.');
      setEnteredPin('');
    }
  };

  const changeLogDate = (days: number) => {
    const newDate = new Date(logDate);
    newDate.setDate(newDate.getDate() + days);
    const daysDiff = Math.floor((new Date().getTime() - newDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 0 && daysDiff <= 8) {
      setLogDate(newDate);
    }
  };

  const handleOnDutyActivity = (activity: string) => {
    if (activity === 'Pre-Trip Inspection' || activity === 'En-Route Inspection' || activity === 'Post-Trip Inspection') {
      setDvirType(activity === 'Pre-Trip Inspection' ? 'pre' : activity === 'En-Route Inspection' ? 'enroute' : 'post');
      setCurrentStatus('ON_DUTY');
      setShowOnDutyMenu(false);
      setDvirTimer(0);
      setDvirChecklist({});
      setDvirLocked(true); // LOCK THE SCREEN
    } else {
      setCurrentStatus('ON_DUTY');
      setShowOnDutyMenu(false);
      setStatusDuration({ hours: 0, minutes: 0, seconds: 0 });
    }
  };

  const completeDVIR = () => {
    if (dvirTimer < 900) {
      Alert.alert('Minimum Time Required', 'You must complete at least 15 minutes of inspection.');
      return;
    }
    
    Alert.alert(
      'Review Previous Day',
      'Would you like to review the previous day\'s log for verification?',
      [
        {
          text: 'No',
          onPress: () => {
            finalizeDVIR();
          }
        },
        {
          text: 'Yes',
          onPress: () => {
            const prevDate = new Date(logDate);
            prevDate.setDate(prevDate.getDate() - 1);
            setLogDate(prevDate);
            setHoursTab('logs');
            setActiveScreen('hours');
            setDvirLocked(false); // UNLOCK
            setDvirType('');
            setDvirTimer(0);
          }
        }
      ]
    );
  };

  const finalizeDVIR = () => {
    if (dvirType === 'pre') {
      setStatusDuration({ hours: 0, minutes: 0, seconds: 0 });
    }
    setActiveScreen('dashboard');
    setDvirLocked(false); // UNLOCK
    setDvirType('');
    setDvirTimer(0);
  };

  const toggleDefect = (item: string) => {
    setCurrentDefectItem(item);
    setShowDefectModal(true);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setStatusDuration(prev => {
        let newSeconds = prev.seconds + 1;
        let newMinutes = prev.minutes;
        let newHours = prev.hours;
        if (newSeconds >= 60) { newSeconds = 0; newMinutes += 1; }
        if (newMinutes >= 60) { newMinutes = 0; newHours += 1; }
        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });

      if (dvirLocked && dvirType) {
        setDvirTimer(prev => prev + 1);
      }

      if (currentStatus === 'DRIVING' || currentStatus === 'ON_DUTY') {
        setGauges(prev => {
          const updateGauge = (gauge: { hours: number; minutes: number; seconds: number; max: number }) => {
            let newSeconds = gauge.seconds - 1;
            let newMinutes = gauge.minutes;
            let newHours = gauge.hours;
            if (newSeconds < 0) { newSeconds = 59; newMinutes -= 1; }
            if (newMinutes < 0) { newMinutes = 59; newHours -= 1; }
            if (newHours < 0) { newHours = 0; newMinutes = 0; newSeconds = 0; }
            return { ...gauge, hours: newHours, minutes: newMinutes, seconds: newSeconds };
          };
          return {
            break8: currentStatus === 'DRIVING' ? updateGauge(prev.break8) : prev.break8,
            drive11: currentStatus === 'DRIVING' ? updateGauge(prev.drive11) : prev.drive11,
            shift14: updateGauge(prev.shift14),
            weekly70: updateGauge(prev.weekly70)
          };
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [currentStatus, dvirLocked, dvirType]);

  const handleStatusChange = (status: string) => {
    if (status === 'ON_DUTY') {
      setShowOnDutyMenu(true);
    } else {
      setCurrentStatus(status);
      setStatusDuration({ hours: 0, minutes: 0, seconds: 0 });
    }
  };

  const formatTime = (h: number, m: number, s: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const GaugeDisplay = ({ hours, minutes, seconds, max, color, label }: { hours: number; minutes: number; seconds: number; max: number; color: string; label: string }) => {
    const totalHours = hours + (minutes / 60) + (seconds / 3600);
    const percentage = (totalHours / max) * 100;
    const size = scale(120);
    const strokeWidth = scale(12);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.gaugeWrapper}>
        <Text style={[styles.gaugeLabel, { fontSize: scaleFont(10) }]}>{label}</Text>
        <View style={styles.gaugeContainer}>
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <Circle cx={size/2} cy={size/2} r={radius} stroke="#1F2937" strokeWidth={strokeWidth} fill="none"/>
            <Circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={strokeWidth} fill="none"
              strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={strokeDashoffset}
              strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}/>
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

  // FULL-SCREEN ROADSIDE LOCK
  if (roadsideLocked) {
    return (
      <View style={styles.fullscreenLock}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ScrollView style={styles.lockedContent} contentContainerStyle={{ padding: scale(20) }}>
          <Text style={[styles.roadsideTitle, { fontSize: scaleFont(24) }]}>Roadside Inspection</Text>
          <Text style={[styles.roadsideSubtitle, { fontSize: scaleFont(14) }]}>Hours of Service Overview</Text>
          
          <View style={styles.roadsideInfo}>
            <Text style={[styles.roadsideLabel, { fontSize: scaleFont(12) }]}>Driver: {driverInfo.name}</Text>
            <Text style={[styles.roadsideLabel, { fontSize: scaleFont(12) }]}>ID: {driverInfo.driverId}</Text>
            <Text style={[styles.roadsideLabel, { fontSize: scaleFont(12) }]}>Truck: {driverInfo.truckNumber}</Text>
            <Text style={[styles.roadsideLabel, { fontSize: scaleFont(12) }]}>Company: {driverInfo.companyId}</Text>
            <Text style={[styles.roadsideLabel, { fontSize: scaleFont(12) }]}>Rule Set: {ruleSet}</Text>
            <Text style={[styles.roadsideLabel, { fontSize: scaleFont(12) }]}>Current Status: {currentStatus.replace('_', ' ')}</Text>
          </View>

          <View style={styles.roadsideHOS}>
            <Text style={[styles.hosTitle, { fontSize: scaleFont(16) }]}>Hours Remaining:</Text>
            <Text style={[styles.hosText, { fontSize: scaleFont(14) }]}>8-Hour Break: {formatTime(gauges.break8.hours, gauges.break8.minutes, gauges.break8.seconds)}</Text>
            <Text style={[styles.hosText, { fontSize: scaleFont(14) }]}>11-Hour Drive: {formatTime(gauges.drive11.hours, gauges.drive11.minutes, gauges.drive11.seconds)}</Text>
            <Text style={[styles.hosText, { fontSize: scaleFont(14) }]}>14-Hour Shift: {formatTime(gauges.shift14.hours, gauges.shift14.minutes, gauges.shift14.seconds)}</Text>
          </View>

          <View style={styles.roadsideOptions}>
            <Text style={[styles.optionsTitle, { fontSize: scaleFont(16) }]}>Send Logs To Officer:</Text>
            <TouchableOpacity style={styles.optionButton} activeOpacity={0.7}>
              <Text style={[styles.optionText, { fontSize: scaleFont(14) }]}>Email Logs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} activeOpacity={0.7}>
              <Text style={[styles.optionText, { fontSize: scaleFont(14) }]}>Web Portal Access</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton} activeOpacity={0.7}>
              <Text style={[styles.optionText, { fontSize: scaleFont(14) }]}>Print Logs</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={attemptExitRoadside} style={styles.exitRoadsideButton} activeOpacity={0.7}>
            <Text style={[styles.exitRoadsideText, { fontSize: scaleFont(16) }]}>Complete Inspection</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={showExitPinModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.pinModalContent}>
              <Text style={[styles.pinTitle, { fontSize: scaleFont(20) }]}>Enter PIN to Exit</Text>
              <TextInput
                style={[styles.pinInput, { fontSize: scaleFont(24) }]}
                value={enteredPin}
                onChangeText={setEnteredPin}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="000000"
                placeholderTextColor="#475569"
                autoFocus
              />
              <TouchableOpacity onPress={verifyPinAndExit} style={styles.pinVerifyButton} activeOpacity={0.7}>
                <Text style={[styles.pinVerifyText, { fontSize: scaleFont(16) }]}>Verify PIN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowExitPinModal(false)} style={styles.pinCancelButton} activeOpacity={0.7}>
                <Text style={[styles.pinCancelText, { fontSize: scaleFont(14) }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // FULL-SCREEN DVIR LOCK
  if (dvirLocked) {
    return (
      <View style={styles.fullscreenLock}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ScrollView style={styles.lockedContent} contentContainerStyle={{ padding: scale(20), paddingBottom: scale(100) }}>
          <Text style={[styles.dvirTitle, { fontSize: scaleFont(20) }]}>
            {dvirType === 'pre' ? 'Pre-Trip' : dvirType === 'enroute' ? 'En-Route' : 'Post-Trip'} Inspection
          </Text>

          <View style={styles.dvirHeader}>
            <Text style={[styles.dvirHeaderText, { fontSize: scaleFont(12) }]}>Driver: {driverInfo.name} ({driverInfo.driverId})</Text>
            <Text style={[styles.dvirHeaderText, { fontSize: scaleFont(12) }]}>Company: {driverInfo.companyId}</Text>
            <Text style={[styles.dvirHeaderText, { fontSize: scaleFont(12) }]}>Truck: {driverInfo.truckNumber} | Trailer: {driverInfo.trailerNumber}</Text>
            
            <View style={styles.dvirTimerContainer}>
              <Text style={[styles.dvirTimer, { fontSize: scaleFont(24) }]}>
                {Math.floor(dvirTimer / 60).toString().padStart(2, '0')}:{(dvirTimer % 60).toString().padStart(2, '0')} / 15:00
              </Text>
              <Text style={[styles.dvirTimerLabel, { fontSize: scaleFont(10) }]}>
                {dvirTimer < 900 ? `${Math.floor((900 - dvirTimer) / 60)} min ${(900 - dvirTimer) % 60} sec remaining` : 'Minimum time met ✓'}
              </Text>
            </View>
          </View>

          <View style={styles.dvirChecklistContainer}>
            {Object.entries(dvirItems).map(([item, subitems]) => (
              <View key={item} style={styles.dvirChecklistItem}>
                <View style={styles.dvirChecklistRow}>
                  <TouchableOpacity
                    onPress={() => setDvirChecklist(prev => ({ ...prev, [item]: !prev[item] }))}
                    style={styles.dvirCheckbox}
                  >
                    {dvirChecklist[item] && <Text style={{ fontSize: scaleFont(14), color: '#10b981' }}>✓</Text>}
                  </TouchableOpacity>
                  <Text style={[styles.dvirChecklistText, { fontSize: scaleFont(14) }]}>{item}</Text>
                  <TouchableOpacity onPress={() => toggleDefect(item)} style={styles.dvirDefectButton}>
                    <Text style={[styles.dvirDefectButtonText, { fontSize: scaleFont(12) }]}>Defect</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={completeDVIR}
            style={[styles.dvirCompleteButton, dvirTimer < 900 && styles.dvirCompleteButtonDisabled]}
            disabled={dvirTimer < 900}
            activeOpacity={0.7}
          >
            <Text style={[styles.dvirCompleteText, { fontSize: scaleFont(16) }]}>
              {dvirTimer < 900 ? 'Complete Inspection (Minimum time required)' : 'Complete Inspection'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal visible={showDefectModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { fontSize: scaleFont(18) }]}>Report Defect: {currentDefectItem}</Text>
              <ScrollView style={styles.modalScrollView}>
                {currentDefectItem && dvirItems[currentDefectItem]?.map(subitem => (
                  <TouchableOpacity key={subitem} style={styles.activityButton} activeOpacity={0.7}>
                    <Text style={[styles.activityText, { fontSize: scaleFont(14) }]}>{subitem}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity onPress={() => setShowDefectModal(false)} style={styles.cancelButton} activeOpacity={0.7}>
                <Text style={[styles.cancelText, { fontSize: scaleFont(15) }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // NORMAL APP (UNLOCKED)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e293b" />
      
      <View style={styles.topToolbar}>
        <TouchableOpacity onPress={() => {}} style={styles.menuButton} activeOpacity={0.7}>
          <HamburgerIcon size={scale(24)} color="#94a3b8" />
        </TouchableOpacity>
        <Text style={[styles.toolbarTitle, { fontSize: scaleFont(18) }]}>LogMaster ELD</Text>
        <TouchableOpacity onPress={() => {}} style={styles.userButton} activeOpacity={0.7}>
          <UserIcon size={scale(20)} color="#cbd5e1" />
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
                    <Text style={[styles.infoText, { fontSize: scaleFont(11) }]}>
                      {currentTime.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={[styles.infoText, { fontSize: scaleFont(11) }]}>72°F</Text>
                  </View>
                  <View style={styles.infoItem}>
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
                      <TouchableOpacity key={key} onPress={() => handleStatusChange(key)}
                        style={[styles.statusButton, currentStatus === key && styles.activeStatusButton]} activeOpacity={0.7}>
                        <Text style={[styles.statusButtonText, { color: currentStatus === key ? value.active : value.color, fontSize: scaleFont(11) }]}>
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
                    {onDutyActivities.map(act => (
                      <TouchableOpacity key={act} onPress={() => handleOnDutyActivity(act)} style={styles.activityButton} activeOpacity={0.7}>
                        <Text style={[styles.activityText, { fontSize: scaleFont(15) }]}>{act}</Text>
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
                const idx = rules.indexOf(ruleSet);
                setRuleSet(rules[(idx + 1) % rules.length]);
              }} activeOpacity={0.7}>
                <Text style={[styles.ruleValue, { fontSize: scaleFont(14) }]}>{ruleSet}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gaugesContainer}>
              <GaugeDisplay hours={gauges.break8.hours} minutes={gauges.break8.minutes} seconds={gauges.break8.seconds} max={gauges.break8.max} color="#EF4444" label="8-Hr Break" />
              <GaugeDisplay hours={gauges.drive11.hours} minutes={gauges.drive11.minutes} seconds={gauges.drive11.seconds} max={gauges.drive11.max} color="#10B981" label="11-Hr Drive" />
              <GaugeDisplay hours={gauges.shift14.hours} minutes={gauges.shift14.minutes} seconds={gauges.shift14.seconds} max={gauges.shift14.max} color="#F59E0B" label="14-Hr Shift" />
            </View>
          </>
        )}

        {activeScreen === 'hours' && (
          <>
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setHoursTab('hos')} style={[styles.tab, hoursTab === 'hos' && styles.activeTab]}>
                <Text style={[styles.tabText, { fontSize: scaleFont(14) }, hoursTab === 'hos' && styles.activeTabText]}>HOS</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setHoursTab('logs')} style={[styles.tab, hoursTab === 'logs' && styles.activeTab]}>
                <Text style={[styles.tabText, { fontSize: scaleFont(14) }, hoursTab === 'logs' && styles.activeTabText]}>Logs</Text>
              </TouchableOpacity>
            </View>

            {hoursTab === 'hos' && (
              <>
                <View style={styles.hosGaugesContainer}>
                  <GaugeDisplay hours={gauges.break8.hours} minutes={gauges.break8.minutes} seconds={gauges.break8.seconds} max={gauges.break8.max} color="#EF4444" label="8-Hour Break" />
                  <GaugeDisplay hours={gauges.drive11.hours} minutes={gauges.drive11.minutes} seconds={gauges.drive11.seconds} max={gauges.drive11.max} color="#10B981" label="11-Hour Drive" />
                  <GaugeDisplay hours={gauges.shift14.hours} minutes={gauges.shift14.minutes} seconds={gauges.shift14.seconds} max={gauges.shift14.max} color="#F59E0B" label="14-Hour Shift" />
                  <GaugeDisplay hours={gauges.weekly70.hours} minutes={gauges.weekly70.minutes} seconds={gauges.weekly70.seconds} max={gauges.weekly70.max} color="#8B5CF6" label="70-Hour Week" />
                </View>

                <View style={styles.hosStatusButtons}>
                  <Text style={[styles.hosStatusLabel, { fontSize: scaleFont(12) }]}>Current Status: {currentStatus.replace('_', ' ')}</Text>
                  <View style={styles.statusButtons}>
                    {Object.entries(statuses).map(([key, value]) => (
                      <TouchableOpacity key={key} onPress={() => handleStatusChange(key)}
                        style={[styles.statusButton, currentStatus === key && styles.activeStatusButton]} activeOpacity={0.7}>
                        <Text style={[styles.statusButtonText, { color: currentStatus === key ? value.active : value.color, fontSize: scaleFont(11) }]}>
                          {value.code}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.recapContainer}>
                  <Text style={[styles.recapTitle, { fontSize: scaleFont(14) }]}>Recap Information</Text>
                  <Text style={[styles.recapText, { fontSize: scaleFont(12) }]}>Recap Starts: {recapInfo.recapStartsDate}</Text>
                  <Text style={[styles.recapText, { fontSize: scaleFont(12) }]}>Time Regained: {recapInfo.timeRegained}</Text>
                  <Text style={[styles.recapText, { fontSize: scaleFont(12) }]}>Next Recap: {recapInfo.nextRecapDate}</Text>
                  <Text style={[styles.recapText, { fontSize: scaleFont(12) }]}>Time to Gain: {recapInfo.timeToGain}</Text>
                </View>
              </>
            )}

            {hoursTab === 'logs' && (
              <>
                <View style={styles.logDateNav}>
                  <TouchableOpacity onPress={() => changeLogDate(-1)} style={styles.logDateButton}>
                    <Text style={[styles.logDateButtonText, { fontSize: scaleFont(18) }]}>←</Text>
                  </TouchableOpacity>
                  <Text style={[styles.logDateText, { fontSize: scaleFont(16) }]}>
                    {logDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Text>
                  <TouchableOpacity onPress={() => changeLogDate(1)} style={styles.logDateButton}>
                    <Text style={[styles.logDateButtonText, { fontSize: scaleFont(18) }]}>→</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.logGraph}>
                  <View style={styles.logGraphLabels}>
                    <View style={styles.logGraphLabelRow}>
                      <Text style={[styles.logGraphLabel, { fontSize: scaleFont(12) }]}>OFF DUTY</Text>
                      <Text style={[styles.logGraphTime, { fontSize: scaleFont(12) }]}>08:45:30</Text>
                    </View>
                    <View style={styles.logGraphLabelRow}>
                      <Text style={[styles.logGraphLabel, { fontSize: scaleFont(12) }]}>SLEEPER</Text>
                      <Text style={[styles.logGraphTime, { fontSize: scaleFont(12) }]}>07:00:00</Text>
                    </View>
                    <View style={styles.logGraphLabelRow}>
                      <Text style={[styles.logGraphLabel, { fontSize: scaleFont(12) }]}>DRIVING</Text>
                      <Text style={[styles.logGraphTime, { fontSize: scaleFont(12) }]}>06:15:20</Text>
                    </View>
                    <View style={styles.logGraphLabelRow}>
                      <Text style={[styles.logGraphLabel, { fontSize: scaleFont(12) }]}>ON DUTY</Text>
                      <Text style={[styles.logGraphTime, { fontSize: scaleFont(12) }]}>01:59:10</Text>
                    </View>
                  </View>

                  <View style={styles.logGraphGrid}>
                    <Text style={[styles.logGraphPlaceholder, { fontSize: scaleFont(12) }]}>
                      [Log graph visualization will be implemented here]
                    </Text>
                  </View>
                </View>

                <View style={styles.logEvents}>
                  <Text style={[styles.logEventsTitle, { fontSize: scaleFont(14) }]}>Events Log</Text>
                  <View style={styles.logEvent}>
                    <Text style={[styles.logEventText, { fontSize: scaleFont(12) }]}>05:30 - ON DUTY (Pre-Trip Inspection) - 00:25:00</Text>
                  </View>
                  <View style={styles.logEvent}>
                    <Text style={[styles.logEventText, { fontSize: scaleFont(12) }]}>06:00 - DRIVING - Dallas, TX</Text>
                  </View>
                  <View style={styles.logEvent}>
                    <Text style={[styles.logEventText, { fontSize: scaleFont(12) }]}>12:15 - ON DUTY (Fueling) - 00:15:00 - Austin, TX</Text>
                  </View>
                </View>
              </>
            )}
          </>
        )}

        {activeScreen !== 'dashboard' && activeScreen !== 'hours' && (
          <View style={styles.placeholderScreen}>
            <Text style={[styles.placeholderText, { fontSize: scaleFont(18) }]}>
              {activeScreen.charAt(0).toUpperCase() + activeScreen.slice(1)} Screen
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal visible={showRoadsidePinModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.pinModalContent}>
            <Text style={[styles.pinTitle, { fontSize: scaleFont(20) }]}>Roadside Inspection PIN</Text>
            <Text style={[styles.pinWarning, { fontSize: scaleFont(14) }]}>⚠️ WRITE THIS DOWN</Text>
            <Text style={[styles.pinDisplay, { fontSize: scaleFont(36) }]}>{roadsidePin}</Text>
            <Text style={[styles.pinInstructions, { fontSize: scaleFont(12) }]}>
              This PIN will unlock the screen once the roadside inspection is complete.
              {'\n\n'}If you forget this PIN, you will NOT be able to exit the roadside inspection screen.
              {'\n\n'}DO NOT share this PIN with the officer.
            </Text>
            <TouchableOpacity onPress={continueToRoadside} style={styles.pinContinueButton} activeOpacity={0.7}>
              <Text style={[styles.pinContinueText, { fontSize: scaleFont(16) }]}>Continue to Inspection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => setActiveScreen('dashboard')} style={[styles.navItem, activeScreen === 'dashboard' && styles.activeNavItem]} activeOpacity={0.7}>
          <HomeIcon size={scale(24)} color={activeScreen === 'dashboard' ? '#60a5fa' : '#94a3b8'} />
          <Text style={[styles.navLabel, { fontSize: scaleFont(10), color: activeScreen === 'dashboard' ? '#60a5fa' : '#94a3b8' }]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { setActiveScreen('hours'); setHoursTab('hos'); }} style={[styles.navItem, activeScreen === 'hours' && styles.activeNavItem]} activeOpacity={0.7}>
          <ClockIcon size={scale(24)} color={activeScreen === 'hours' ? '#60a5fa' : '#94a3b8'} />
          <Text style={[styles.navLabel, { fontSize: scaleFont(10), color: activeScreen === 'hours' ? '#60a5fa' : '#94a3b8' }]}>Hours</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRoadsideOneTap} style={[styles.navItem, roadsideLocked && styles.activeNavItem]} activeOpacity={0.7}>
          <ShieldIcon size={scale(24)} color={roadsideLocked ? '#60a5fa' : '#94a3b8'} />
          <Text style={[styles.navLabel, { fontSize: scaleFont(10), color: roadsideLocked ? '#60a5fa' : '#94a3b8' }]}>Roadside</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveScreen('communications')} style={[styles.navItem, activeScreen === 'communications' && styles.activeNavItem]} activeOpacity={0.7}>
          <MessageIcon size={scale(24)} color={activeScreen === 'communications' ? '#60a5fa' : '#94a3b8'} />
          <Text style={[styles.navLabel, { fontSize: scaleFont(10), color: activeScreen === 'communications' ? '#60a5fa' : '#94a3b8' }]}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setActiveScreen('navigation')} style={[styles.navItem, activeScreen === 'navigation' && styles.activeNavItem]} activeOpacity={0.7}>
          <MapIcon size={scale(24)} color={activeScreen === 'navigation' ? '#60a5fa' : '#94a3b8'} />
          <Text style={[styles.navLabel, { fontSize: scaleFont(10), color: activeScreen === 'navigation' ? '#60a5fa' : '#94a3b8' }]}>Navigate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  fullscreenLock: { flex: 1, backgroundColor: '#0f172a' },
  lockedContent: { flex: 1 },
  topToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: scale(16), paddingVertical: scale(12), backgroundColor: '#1e293b', borderBottomWidth: 1, borderBottomColor: '#334155' },
  menuButton: { padding: scale(8) },
  toolbarTitle: { fontWeight: 'bold', color: '#60a5fa' },
  userButton: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: '#334155', alignItems: 'center', justifyContent: 'center' },
  mainContent: { flex: 1 },
  contentContainer: { padding: scale(16), paddingBottom: scale(100) },
  driverInfoContainer: { marginBottom: scale(16) },
  driverName: { fontWeight: '600', color: '#f1f5f9' },
  driverDetails: { color: '#94a3b8', marginTop: scale(4) },
  statusCard: { backgroundColor: '#1e293b', borderRadius: scale(12), padding: scale(16), marginBottom: scale(20), borderWidth: 1, borderColor: '#334155' },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoSection: { flex: 1, gap: scale(6) },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  infoText: { color: '#cbd5e1' },
  statusDisplayContainer: { flex: 1.5, alignItems: 'center', justifyContent: 'center', paddingHorizontal: scale(12) },
  statusDisplay: { alignItems: 'center', justifyContent: 'center' },
  statusTextLabel: { textTransform: 'uppercase', letterSpacing: 1.2, color: '#94a3b8', marginBottom: scale(2), fontWeight: '600' },
  statusText: { fontWeight: 'bold', marginBottom: scale(2), textAlign: 'center' },
  statusDuration: { fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', color: '#f1f5f9', letterSpacing: 1 },
  statusButtonsContainer: { flex: 1, alignItems: 'flex-end' },
  statusButtons: { flexDirection: 'row', gap: scale(3), backgroundColor: '#0f172a', borderRadius: scale(8), padding: scale(4), flexWrap: 'wrap' },
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
  navLabel: { fontWeight: '500', marginTop: scale(2) },
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
  roadsideTitle: { color: '#60a5fa', fontWeight: 'bold', marginBottom: scale(10), textAlign: 'center' },
  roadsideSubtitle: { color: '#94a3b8', marginBottom: scale(20), textAlign: 'center' },
  roadsideInfo: { backgroundColor: '#1e293b', padding: scale(16), borderRadius: scale(8), marginBottom: scale(20), borderWidth: 1, borderColor: '#334155' },
  roadsideLabel: { color: '#cbd5e1', marginBottom: scale(8) },
  roadsideHOS: { backgroundColor: '#1e293b', padding: scale(16), borderRadius: scale(8), marginBottom: scale(20), borderWidth: 1, borderColor: '#334155' },
  hosTitle: { color: '#60a5fa', fontWeight: 'bold', marginBottom: scale(10) },
  hosText: { color: '#f1f5f9', marginBottom: scale(6), fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  roadsideOptions: { backgroundColor: '#1e293b', padding: scale(16), borderRadius: scale(8), marginBottom: scale(20), borderWidth: 1, borderColor: '#334155' },
  optionsTitle: { color: '#60a5fa', fontWeight: 'bold', marginBottom: scale(12) },
  optionButton: { backgroundColor: '#334155', padding: scale(12), borderRadius: scale(6), marginBottom: scale(8) },
  optionText: { color: '#f1f5f9', textAlign: 'center' },
  exitRoadsideButton: { backgroundColor: '#10b981', padding: scale(16), borderRadius: scale(8) },
  exitRoadsideText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  pinModalContent: { backgroundColor: '#1e293b', borderRadius: scale(12), padding: scale(24), width: SCREEN_WIDTH * 0.9, borderWidth: 2, borderColor: '#ef4444' },
  pinTitle: { color: '#f1f5f9', fontWeight: 'bold', textAlign: 'center', marginBottom: scale(16) },
  pinWarning: { color: '#ef4444', fontWeight: 'bold', textAlign: 'center', marginBottom: scale(12) },
  pinDisplay: { color: '#60a5fa', fontWeight: 'bold', textAlign: 'center', marginBottom: scale(20), fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', letterSpacing: 4 },
  pinInstructions: { color: '#cbd5e1', textAlign: 'center', marginBottom: scale(20), lineHeight: 20 },
  pinContinueButton: { backgroundColor: '#10b981', padding: scale(14), borderRadius: scale(8) },
  pinContinueText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  pinInput: { backgroundColor: '#0f172a', borderWidth: 2, borderColor: '#60a5fa', borderRadius: scale(8), padding: scale(16), textAlign: 'center', color: '#f1f5f9', marginBottom: scale(20), fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', letterSpacing: 8 },
  pinVerifyButton: { backgroundColor: '#10b981', padding: scale(14), borderRadius: scale(8), marginBottom: scale(10) },
  pinVerifyText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  pinCancelButton: { backgroundColor: '#334155', padding: scale(12), borderRadius: scale(8) },
  pinCancelText: { color: '#cbd5e1', textAlign: 'center' },
  tabContainer: { flexDirection: 'row', marginBottom: scale(20), backgroundColor: '#1e293b', borderRadius: scale(8), padding: scale(4) },
  tab: { flex: 1, paddingVertical: scale(10), alignItems: 'center', borderRadius: scale(6) },
  activeTab: { backgroundColor: '#60a5fa' },
  tabText: { color: '#94a3b8', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  hosGaugesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: scale(20) },
  hosStatusButtons: { backgroundColor: '#1e293b', padding: scale(16), borderRadius: scale(8), marginBottom: scale(20), borderWidth: 1, borderColor: '#334155' },
  hosStatusLabel: { color: '#60a5fa', marginBottom: scale(10), fontWeight: '600' },
  recapContainer: { backgroundColor: '#1e293b', padding: scale(16), borderRadius: scale(8), marginBottom: scale(20), borderWidth: 1, borderColor: '#334155' },
  recapTitle: { color: '#60a5fa', fontWeight: 'bold', marginBottom: scale(10) },
  recapText: { color: '#cbd5e1', marginBottom: scale(6) },
  logDateNav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: scale(20), backgroundColor: '#1e293b', padding: scale(12), borderRadius: scale(8), borderWidth: 1, borderColor: '#334155' },
  logDateButton: { padding: scale(8) },
  logDateButtonText: { color: '#60a5fa', fontWeight: 'bold' },
  logDateText: { color: '#f1f5f9', fontWeight: '600' },
  logGraph: { backgroundColor: '#1e293b', padding: scale(16), borderRadius: scale(8), marginBottom: scale(20), borderWidth: 1, borderColor: '#334155' },
  logGraphLabels: { marginBottom: scale(16) },
  logGraphLabelRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: scale(8), borderBottomWidth: 1, borderBottomColor: '#334155' },
  logGraphLabel: { color: '#cbd5e1', fontWeight: '600' },
  logGraphTime: { color: '#60a5fa', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  logGraphGrid: { minHeight: scale(200), justifyContent: 'center', alignItems: 'center' },
  logGraphPlaceholder: { color: '#475569', textAlign: 'center' },
  logEvents: { backgroundColor: '#1e293b', padding: scale(16), borderRadius: scale(8), borderWidth: 1, borderColor: '#334155' },
  logEventsTitle: { color: '#60a5fa', fontWeight: 'bold', marginBottom: scale(12) },
  logEvent: { paddingVertical: scale(8), borderBottomWidth: 1, borderBottomColor: '#334155' },
  logEventText: { color: '#cbd5e1' },
  dvirTitle: { color: '#60a5fa', fontWeight: 'bold', textAlign: 'center', marginBottom: scale(16) },
  dvirHeader: { backgroundColor: '#1e293b', padding: scale(16), borderRadius: scale(8), marginBottom: scale(16), borderWidth: 1, borderColor: '#334155' },
  dvirHeaderText: { color: '#cbd5e1', marginBottom: scale(4) },
  dvirTimerContainer: { marginTop: scale(12), alignItems: 'center' },
  dvirTimer: { color: '#60a5fa', fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  dvirTimerLabel: { color: '#94a3b8', marginTop: scale(4) },
  dvirChecklistContainer: { marginBottom: scale(16) },
  dvirChecklistItem: { marginBottom: scale(12) },
  dvirChecklistRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', padding: scale(12), borderRadius: scale(8), borderWidth: 1, borderColor: '#334155' },
  dvirCheckbox: { width: scale(24), height: scale(24), borderWidth: 2, borderColor: '#60a5fa', borderRadius: scale(4), marginRight: scale(12), alignItems: 'center', justifyContent: 'center' },
  dvirChecklistText: { flex: 1, color: '#f1f5f9' },
  dvirDefectButton: { backgroundColor: '#ef4444', paddingHorizontal: scale(12), paddingVertical: scale(6), borderRadius: scale(6) },
  dvirDefectButtonText: { color: '#fff', fontWeight: '600' },
  dvirCompleteButton: { backgroundColor: '#10b981', padding: scale(16), borderRadius: scale(8) },
  dvirCompleteButtonDisabled: { backgroundColor: '#475569' },
  dvirCompleteText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});

export default ELDDashboard;

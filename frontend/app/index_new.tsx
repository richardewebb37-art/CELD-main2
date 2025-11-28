import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, SafeAreaView,
  Dimensions, Platform, StatusBar, TextInput, Alert, BackHandler,
} from 'react-native';
import Svg, { Circle, Path, Line, Rect } from 'react-native-svg';
import { 
  HamburgerIcon, UserIcon, HomeIcon, ClockIcon, 
  ShieldIcon, MessageIcon, MapIcon 
} from './Icons';
import { LogGraph } from './LogGraph';
import { GaugeDisplay } from './GaugeDisplay';
import { LockedScreens } from './LockedScreens';
import { scale, scaleFont } from './utils';
import { styles } from './styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  
  // Verification States
  const [verifiedDates, setVerifiedDates] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);

  // Mock log events
  const [logEvents, setLogEvents] = useState([
    { id: 1, status: 'OFF_DUTY', startHour: 0, startMinute: 0, duration: 5.5, activity: null, editable: true },
    { id: 2, status: 'ON_DUTY', startHour: 5.5, startMinute: 30, duration: 0.42, activity: 'Pre-Trip Inspection', editable: false, inspectionDuration: 25 },
    { id: 3, status: 'DRIVING', startHour: 6, startMinute: 0, duration: 6.25, activity: null, editable: false },
    { id: 4, status: 'ON_DUTY', startHour: 12.25, startMinute: 15, duration: 0.25, activity: 'Fueling', editable: true },
    { id: 5, status: 'DRIVING', startHour: 12.5, startMinute: 30, duration: 4.5, activity: null, editable: false },
    { id: 6, status: 'SLEEPER', startHour: 17, startMinute: 0, duration: 7, activity: null, editable: true },
  ]);

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

  const [recapDays, setRecapDays] = useState([
    { date: 'Dec 5', timeGained: '02:15:00' },
    { date: 'Dec 6', timeGained: '03:45:00' },
    { date: 'Dec 7', timeGained: '01:30:00' }
  ]);

  const statuses = {
    OFF_DUTY: { code: 'OD', color: '#6B7280', active: '#9CA3AF' },
    SLEEPER: { code: 'SB', color: '#3B82F6', active: '#60A5FA' },
    DRIVING: { code: 'D', color: '#10B981', active: '#34D399' },
    ON_DUTY: { code: 'ON', color: '#F59E0B', active: '#FBBF24' }
  };

  const onDutyActivities = [
    'Pre-Trip Inspection', 'En-Route Inspection', 'Post-Trip Inspection',
    'Fueling', 'Loading', 'Unloading', 'Yard Move', 'Personal Conveyance (PC)'
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

  const isCurrentDateVerified = () => {
    const dateStr = logDate.toDateString();
    return verifiedDates.includes(dateStr);
  };

  const verifyCurrentLog = () => {
    const dateStr = logDate.toDateString();
    if (verifiedDates.includes(dateStr)) {
      Alert.alert('Already Verified', 'This log has already been verified and cannot be changed.');
      return;
    }
    
    Alert.alert(
      'Verify Logs',
      'Once verified, you will NOT be able to edit these logs. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Verify',
          style: 'destructive',
          onPress: () => {
            setVerifiedDates([...verifiedDates, dateStr]);
            Alert.alert('Verified', 'Logs have been verified and locked.');
          }
        }
      ]
    );
  };

  const canEditEvent = (event: any) => {
    const dateStr = logDate.toDateString();
    const isVerified = verifiedDates.includes(dateStr);
    if (isVerified) return false;
    if (event.status === 'DRIVING') return false;
    if (event.status === 'OFF_DUTY' || event.status === 'SLEEPER') return true;
    if (event.status === 'ON_DUTY') {
      if (event.activity && event.activity.includes('Inspection')) {
        if (event.inspectionDuration && event.inspectionDuration >= 15) {
          return 'limited';
        }
      }
      return true;
    }
    return false;
  };

  const handleEditEvent = (event: any) => {
    const canEdit = canEditEvent(event);
    if (canEdit === false) {
      if (verifiedDates.includes(logDate.toDateString())) {
        Alert.alert('Cannot Edit', 'This log has been verified and cannot be edited.');
      } else if (event.status === 'DRIVING') {
        Alert.alert('Cannot Edit', 'Driving status cannot be edited.');
      } else {
        Alert.alert('Cannot Edit', 'This event cannot be edited.');
      }
      return;
    }
    setEditingEvent(event);
    setShowEditModal(true);
  };

  const saveEditedEvent = (updatedEvent: any) => {
    if (updatedEvent.activity && updatedEvent.activity.includes('Inspection')) {
      if (updatedEvent.inspectionDuration >= 15) {
        const newDuration = updatedEvent.duration * 60;
        if (newDuration < 15) {
          Alert.alert('Invalid Edit', 'Inspection events that were 15+ minutes cannot be reduced below 15 minutes.');
          return;
        }
      }
    }
    setLogEvents(logEvents.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setShowEditModal(false);
    setEditingEvent(null);
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (dvirLocked || roadsideLocked) {
        Alert.alert('Screen Locked', 'You must complete this process before exiting.');
        return true;
      }
      return false;
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
    setRoadsideLocked(true);
  };

  const attemptExitRoadside = () => {
    setShowExitPinModal(true);
    setEnteredPin('');
  };

  const verifyPinAndExit = () => {
    if (enteredPin === roadsidePin) {
      setShowExitPinModal(false);
      setRoadsideLocked(false);
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
      setDvirLocked(true);
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
      'Would you like to review and verify the previous day\'s logs?',
      [
        {
          text: 'No',
          onPress: () => {
            Alert.alert(
              'Auto-Verify Warning',
              'The logs will be automatically verified and you will NOT have the ability to change them. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Confirm',
                  style: 'destructive',
                  onPress: () => {
                    const prevDate = new Date(logDate);
                    prevDate.setDate(prevDate.getDate() - 1);
                    const prevDateStr = prevDate.toDateString();
                    if (!verifiedDates.includes(prevDateStr)) {
                      setVerifiedDates([...verifiedDates, prevDateStr]);
                    }
                    finalizeDVIR();
                  }
                }
              ]
            );
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
            setDvirLocked(false);
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
    setDvirLocked(false);
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
          const updateGauge = (gauge: any) => {
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

  const currentHour = currentTime.getHours() + currentTime.getMinutes() / 60;

  // Show locked screens if active
  if (roadsideLocked || dvirLocked) {
    return (
      <LockedScreens
        roadsideLocked={roadsideLocked}
        dvirLocked={dvirLocked}
        dvirType={dvirType}
        dvirTimer={dvirTimer}
        dvirChecklist={dvirChecklist}
        setDvirChecklist={setDvirChecklist}
        dvirItems={dvirItems}
        driverInfo={driverInfo}
        gauges={gauges}
        formatTime={formatTime}
        currentStatus={currentStatus}
        ruleSet={ruleSet}
        attemptExitRoadside={attemptExitRoadside}
        completeDVIR={completeDVIR}
        toggleDefect={toggleDefect}
        showDefectModal={showDefectModal}
        setShowDefectModal={setShowDefectModal}
        currentDefectItem={currentDefectItem}
        showExitPinModal={showExitPinModal}
        enteredPin={enteredPin}
        setEnteredPin={setEnteredPin}
        verifyPinAndExit={verifyPinAndExit}
        setShowExitPinModal={setShowExitPinModal}
      />
    );
  }

  // MAIN APP UI
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

                {/* 3-DAY RECAP DISPLAY */}
                <View style={styles.recapContainer}>
                  <Text style={[styles.recapTitle, { fontSize: scaleFont(14) }]}>Recap Information</Text>
                  <View style={styles.recapDaysContainer}>
                    {recapDays.map((day, idx) => (
                      <View key={idx} style={styles.recapDayCard}>
                        <Text style={[styles.recapDayDate, { fontSize: scaleFont(12) }]}>{day.date}</Text>
                        <Text style={[styles.recapDayTime, { fontSize: scaleFont(16) }]}>+{day.timeGained}</Text>
                      </View>
                    ))}
                  </View>
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

                {/* VERIFY BUTTON */}
                <TouchableOpacity 
                  onPress={verifyCurrentLog} 
                  style={[styles.verifyButton, isCurrentDateVerified() && styles.verifyButtonDisabled]}
                  disabled={isCurrentDateVerified()}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.verifyButtonText, { fontSize: scaleFont(14) }]}>
                    {isCurrentDateVerified() ? '✓ Verified' : 'Verify Logs'}
                  </Text>
                </TouchableOpacity>

                {/* LOG GRAPH */}
                <LogGraph events={logEvents} currentHour={currentHour} />

                {/* EVENTS LOG */}
                <View style={styles.logEvents}>
                  <Text style={[styles.logEventsTitle, { fontSize: scaleFont(14) }]}>Events Log</Text>
                  {logEvents.map(event => (
                    <TouchableOpacity 
                      key={event.id} 
                      onPress={() => handleEditEvent(event)}
                      style={styles.logEvent}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.logEventText, { fontSize: scaleFont(12) }]}>
                        {String(Math.floor(event.startHour)).padStart(2, '0')}:{String(Math.floor(event.startMinute)).padStart(2, '0')} - {event.status.replace('_', ' ')}
                        {event.activity && ` (${event.activity})`} - {formatTime(Math.floor(event.duration), Math.floor((event.duration % 1) * 60), 0)}
                      </Text>
                    </TouchableOpacity>
                  ))}
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

export default ELDDashboard;

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, StatusBar } from 'react-native';
import { scale, scaleFont } from './utils';
import { styles } from './styles';

export const LockedScreens = (props) => {
  const {
    roadsideLocked, dvirLocked, dvirType, dvirTimer, dvirChecklist, setDvirChecklist,
    dvirItems, driverInfo, gauges, formatTime, currentStatus, ruleSet,
    attemptExitRoadside, completeDVIR, toggleDefect, showDefectModal, setShowDefectModal,
    currentDefectItem, showExitPinModal, enteredPin, setEnteredPin, verifyPinAndExit, setShowExitPinModal
  } = props;

  // ROADSIDE LOCKED SCREEN
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

  // DVIR LOCKED SCREEN
  if (dvirLocked) {
    return (
      <View style={styles.fullscreenLock}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <ScrollView style={styles.lockedContent} contentContainerStyle={{ padding: scale(20) }}>
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

          <ScrollView style={styles.dvirChecklistContainer}>
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
          </ScrollView>

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

  return null;
};

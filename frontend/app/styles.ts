import { StyleSheet, Dimensions, Platform } from 'react-native';
import { scale, scaleFont } from './utils';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  fullscreenLock: { flex: 1, backgroundColor: '#0f172a' },
  lockedContent: { flex: 1 },
  topToolbar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: scale(16), 
    paddingVertical: scale(12), 
    backgroundColor: '#1e293b', 
    borderBottomWidth: 1, 
    borderBottomColor: '#334155' 
  },
  menuButton: { padding: scale(8) },
  toolbarTitle: { fontWeight: 'bold', color: '#60a5fa' },
  userButton: { 
    width: scale(40), 
    height: scale(40), 
    borderRadius: scale(20), 
    backgroundColor: '#334155', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  mainContent: { flex: 1 },
  contentContainer: { padding: scale(16), paddingBottom: scale(100) },
  driverInfoContainer: { marginBottom: scale(16) },
  driverName: { fontWeight: '600', color: '#f1f5f9' },
  driverDetails: { color: '#94a3b8', marginTop: scale(4) },
  statusCard: { 
    backgroundColor: '#1e293b', 
    borderRadius: scale(12), 
    padding: scale(16), 
    marginBottom: scale(20), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  statusRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoSection: { flex: 1, gap: scale(6) },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: scale(6) },
  infoText: { color: '#cbd5e1' },
  statusDisplayContainer: { 
    flex: 1.5, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: scale(12) 
  },
  statusDisplay: { alignItems: 'center', justifyContent: 'center' },
  statusTextLabel: { 
    textTransform: 'uppercase', 
    letterSpacing: 1.2, 
    color: '#94a3b8', 
    marginBottom: scale(2), 
    fontWeight: '600' 
  },
  statusText: { fontWeight: 'bold', marginBottom: scale(2), textAlign: 'center' },
  statusDuration: { 
    fontWeight: 'bold', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    color: '#f1f5f9', 
    letterSpacing: 1 
  },
  statusButtonsContainer: { flex: 1, alignItems: 'flex-end' },
  statusButtons: { 
    flexDirection: 'row', 
    gap: scale(3), 
    backgroundColor: '#0f172a', 
    borderRadius: scale(8), 
    padding: scale(4), 
    flexWrap: 'wrap' 
  },
  statusButton: { 
    paddingHorizontal: scale(10), 
    paddingVertical: scale(5), 
    borderRadius: scale(6), 
    minWidth: scale(45) 
  },
  activeStatusButton: { backgroundColor: 'rgba(255,255,255,0.1)' },
  statusButtonText: { fontWeight: 'bold', textAlign: 'center' },
  gaugesContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginVertical: scale(20), 
    flexWrap: 'wrap', 
    gap: scale(10) 
  },
  gaugeWrapper: { alignItems: 'center', marginBottom: scale(10) },
  gaugeLabel: { 
    color: '#94a3b8', 
    marginBottom: scale(8), 
    textAlign: 'center', 
    fontWeight: '600' 
  },
  gaugeContainer: { alignItems: 'center', justifyContent: 'center', position: 'relative' },
  gaugeCenter: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  gaugeTimeText: { 
    fontWeight: 'bold', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    color: '#f1f5f9' 
  },
  ruleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: scale(20), 
    backgroundColor: '#1e293b', 
    padding: scale(12), 
    borderRadius: scale(8), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  ruleLabel: { color: '#94a3b8' },
  ruleValue: { fontWeight: 'bold', color: '#60a5fa' },
  tabContainer: { 
    flexDirection: 'row', 
    marginBottom: scale(20), 
    backgroundColor: '#1e293b', 
    borderRadius: scale(8), 
    padding: scale(4) 
  },
  tab: { flex: 1, paddingVertical: scale(10), alignItems: 'center', borderRadius: scale(6) },
  activeTab: { backgroundColor: '#60a5fa' },
  tabText: { color: '#94a3b8', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  hosGaugesContainer: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-around', 
    marginBottom: scale(20) 
  },
  hosStatusButtons: { 
    backgroundColor: '#1e293b', 
    padding: scale(16), 
    borderRadius: scale(8), 
    marginBottom: scale(20), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  hosStatusLabel: { color: '#60a5fa', marginBottom: scale(10), fontWeight: '600' },
  
  // 3-DAY RECAP STYLES
  recapContainer: { 
    backgroundColor: '#1e293b', 
    padding: scale(16), 
    borderRadius: scale(8), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  recapTitle: { 
    color: '#60a5fa', 
    fontWeight: 'bold', 
    marginBottom: scale(12), 
    textAlign: 'center' 
  },
  recapDaysContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    gap: scale(10) 
  },
  recapDayCard: { 
    flex: 1, 
    backgroundColor: '#0f172a', 
    padding: scale(12), 
    borderRadius: scale(8), 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  recapDayDate: { 
    color: '#94a3b8', 
    fontWeight: '600', 
    marginBottom: scale(6) 
  },
  recapDayTime: { 
    color: '#10b981', 
    fontWeight: 'bold', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' 
  },
  
  // LOG GRAPH STYLES
  logDateNav: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: scale(16), 
    backgroundColor: '#1e293b', 
    padding: scale(12), 
    borderRadius: scale(8), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  logDateButton: { padding: scale(8) },
  logDateButtonText: { color: '#60a5fa', fontWeight: 'bold' },
  logDateText: { color: '#f1f5f9', fontWeight: '600' },
  
  // VERIFY BUTTON
  verifyButton: { 
    backgroundColor: '#10b981', 
    padding: scale(14), 
    borderRadius: scale(8), 
    marginBottom: scale(16), 
    alignItems: 'center' 
  },
  verifyButtonDisabled: { backgroundColor: '#475569' },
  verifyButtonText: { color: '#fff', fontWeight: 'bold' },
  
  // LOG GRAPH - NO GAPS VERSION
  logGraphWrapper: { 
    flexDirection: 'row', 
    backgroundColor: '#1e293b', 
    borderRadius: scale(8), 
    padding: scale(12), 
    marginBottom: scale(16), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  
  // LEFT LABELS
  logGraphLeftLabels: { 
    width: scale(60), 
    justifyContent: 'flex-start',
    marginRight: scale(8)
  },
  logGraphLeftLabel: { 
    justifyContent: 'center', 
    alignItems: 'flex-start',
    paddingVertical: 0  // NO PADDING - fills exactly
  },
  logGraphLeftLabelText: { 
    color: '#cbd5e1', 
    fontWeight: '600' 
  },
  
  // MAIN GRAPH
  logGraphMainContainer: { 
    flex: 1 
  },
  logGraphHourMarkers: { 
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    marginTop: scale(6)
  },
  logGraphHourMarker: { 
    color: '#94a3b8', 
    textAlign: 'center'
  },
  
  // RIGHT TIMES
  logGraphRightTimes: { 
    width: scale(50), 
    justifyContent: 'flex-start',
    marginLeft: scale(8)
  },
  logGraphRightTime: { 
    justifyContent: 'center', 
    alignItems: 'flex-end',
    paddingVertical: 0  // NO PADDING - fills exactly
  },
  logGraphRightTimeText: { 
    color: '#60a5fa', 
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace'
  },
  
  // EVENTS LOG
  logEvents: { 
    backgroundColor: '#1e293b', 
    padding: scale(16), 
    borderRadius: scale(8), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  logEventsTitle: { 
    color: '#60a5fa', 
    fontWeight: 'bold', 
    marginBottom: scale(12) 
  },
  logEvent: { 
    paddingVertical: scale(10), 
    paddingHorizontal: scale(12), 
    marginBottom: scale(6), 
    backgroundColor: '#0f172a', 
    borderRadius: scale(6), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  logEventText: { color: '#cbd5e1' },
  
  // DVIR SCREEN
  dvirTitle: { 
    color: '#60a5fa', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: scale(16) 
  },
  dvirHeader: { 
    backgroundColor: '#1e293b', 
    padding: scale(16), 
    borderRadius: scale(8), 
    marginBottom: scale(16), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  dvirHeaderText: { color: '#cbd5e1', marginBottom: scale(4) },
  dvirTimerContainer: { marginTop: scale(12), alignItems: 'center' },
  dvirTimer: { 
    color: '#60a5fa', 
    fontWeight: 'bold', 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' 
  },
  dvirTimerLabel: { color: '#94a3b8', marginTop: scale(4) },
  dvirChecklistContainer: { maxHeight: scale(300), marginBottom: scale(16) },
  dvirChecklistItem: { marginBottom: scale(12) },
  dvirChecklistRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#1e293b', 
    padding: scale(12), 
    borderRadius: scale(8), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  dvirCheckbox: { 
    width: scale(24), 
    height: scale(24), 
    borderWidth: 2, 
    borderColor: '#60a5fa', 
    borderRadius: scale(4), 
    marginRight: scale(12), 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  dvirChecklistText: { flex: 1, color: '#f1f5f9' },
  dvirDefectButton: { 
    backgroundColor: '#ef4444', 
    paddingHorizontal: scale(12), 
    paddingVertical: scale(6), 
    borderRadius: scale(6) 
  },
  dvirDefectButtonText: { color: '#fff', fontWeight: '600' },
  dvirCompleteButton: { 
    backgroundColor: '#10b981', 
    padding: scale(16), 
    borderRadius: scale(8) 
  },
  dvirCompleteButtonDisabled: { backgroundColor: '#475569' },
  dvirCompleteText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  
  // BOTTOM NAV
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    backgroundColor: '#1e293b', 
    borderTopWidth: 1, 
    borderTopColor: '#334155', 
    paddingVertical: scale(8), 
    paddingBottom: Platform.OS === 'ios' ? scale(24) : scale(8), 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0 
  },
  navItem: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: scale(6), 
    borderRadius: scale(8), 
    minWidth: scale(60) 
  },
  activeNavItem: { backgroundColor: 'rgba(96, 165, 250, 0.2)' },
  navLabel: { fontWeight: '500', marginTop: scale(2) },
  
  // MODALS
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.75)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: scale(20) 
  },
  modalContent: { 
    backgroundColor: '#1e293b', 
    borderRadius: scale(12), 
    padding: scale(20), 
    width: SCREEN_WIDTH * 0.85, 
    maxHeight: SCREEN_HEIGHT * 0.7, 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  modalTitle: { 
    fontWeight: 'bold', 
    color: '#f1f5f9', 
    marginBottom: scale(16), 
    textAlign: 'center' 
  },
  modalScrollView: { maxHeight: SCREEN_HEIGHT * 0.5 },
  activityButton: { 
    backgroundColor: '#334155', 
    padding: scale(14), 
    borderRadius: scale(8), 
    marginBottom: scale(8) 
  },
  activityText: { color: '#f1f5f9', textAlign: 'center' },
  cancelButton: { 
    backgroundColor: '#dc2626', 
    padding: scale(14), 
    borderRadius: scale(8), 
    marginTop: scale(12) 
  },
  cancelText: { color: '#f1f5f9', textAlign: 'center', fontWeight: 'bold' },
  
  // PLACEHOLDER
  placeholderScreen: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: scale(100) 
  },
  placeholderText: { color: '#94a3b8', fontWeight: '600' },
  
  // ROADSIDE
  roadsideTitle: { 
    color: '#60a5fa', 
    fontWeight: 'bold', 
    marginBottom: scale(10), 
    textAlign: 'center' 
  },
  roadsideSubtitle: { 
    color: '#94a3b8', 
    marginBottom: scale(20), 
    textAlign: 'center' 
  },
  roadsideInfo: { 
    backgroundColor: '#1e293b', 
    padding: scale(16), 
    borderRadius: scale(8), 
    marginBottom: scale(20), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  roadsideLabel: { color: '#cbd5e1', marginBottom: scale(8) },
  roadsideHOS: { 
    backgroundColor: '#1e293b', 
    padding: scale(16), 
    borderRadius: scale(8), 
    marginBottom: scale(20), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  hosTitle: { color: '#60a5fa', fontWeight: 'bold', marginBottom: scale(10) },
  hosText: { 
    color: '#f1f5f9', 
    marginBottom: scale(6), 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' 
  },
  roadsideOptions: { 
    backgroundColor: '#1e293b', 
    padding: scale(16), 
    borderRadius: scale(8), 
    marginBottom: scale(20), 
    borderWidth: 1, 
    borderColor: '#334155' 
  },
  optionsTitle: { color: '#60a5fa', fontWeight: 'bold', marginBottom: scale(12) },
  optionButton: { 
    backgroundColor: '#334155', 
    padding: scale(12), 
    borderRadius: scale(6), 
    marginBottom: scale(8) 
  },
  optionText: { color: '#f1f5f9', textAlign: 'center' },
  exitRoadsideButton: { 
    backgroundColor: '#10b981', 
    padding: scale(16), 
    borderRadius: scale(8) 
  },
  exitRoadsideText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  
  // PIN MODALS
  pinModalContent: { 
    backgroundColor: '#1e293b', 
    borderRadius: scale(12), 
    padding: scale(24), 
    width: SCREEN_WIDTH * 0.9, 
    borderWidth: 2, 
    borderColor: '#ef4444' 
  },
  pinTitle: { 
    color: '#f1f5f9', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: scale(16) 
  },
  pinWarning: { 
    color: '#ef4444', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: scale(12) 
  },
  pinDisplay: { 
    color: '#60a5fa', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: scale(20), 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    letterSpacing: 4 
  },
  pinInstructions: { 
    color: '#cbd5e1', 
    textAlign: 'center', 
    marginBottom: scale(20), 
    lineHeight: 20 
  },
  pinContinueButton: { 
    backgroundColor: '#10b981', 
    padding: scale(14), 
    borderRadius: scale(8) 
  },
  pinContinueText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  pinInput: { 
    backgroundColor: '#0f172a', 
    borderWidth: 2, 
    borderColor: '#60a5fa', 
    borderRadius: scale(8), 
    padding: scale(16), 
    textAlign: 'center', 
    color: '#f1f5f9', 
    marginBottom: scale(20), 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    letterSpacing: 8 
  },
  pinVerifyButton: { 
    backgroundColor: '#10b981', 
    padding: scale(14), 
    borderRadius: scale(8), 
    marginBottom: scale(10) 
  },
  pinVerifyText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  pinCancelButton: { 
    backgroundColor: '#334155', 
    padding: scale(12), 
    borderRadius: scale(8) 
  },
  pinCancelText: { color: '#cbd5e1', textAlign: 'center' },
});

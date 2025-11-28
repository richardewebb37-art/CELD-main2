import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_SCREEN_SIZE = 8.5;
const currentScreenSize = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT) / 160;
const SCALE_FACTOR = Math.min(Math.max(currentScreenSize / BASE_SCREEN_SIZE, 0.8), 1.2);

export const scale = (size: number) => Math.round(size * SCALE_FACTOR);
export const scaleFont = (size: number) => Math.round(size * SCALE_FACTOR * 0.9);

export { SCREEN_WIDTH, SCREEN_HEIGHT };

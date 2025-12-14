/**
 * Scale Utilities Tests
 * 
 * Unit tests for scaling functions (s, vs, ms, fs)
 */

import { s, vs, ms, fs, isTablet, isSmallScreen } from '../../src/utils/scale';
import { Dimensions } from 'react-native';

// Mock Dimensions
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Dimensions: {
      get: jest.fn(() => ({
        width: 375,
        height: 812,
      })),
    },
    PixelRatio: {
      roundToNearestPixel: jest.fn((value) => Math.round(value)),
    },
  };
});

describe('Scale Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('s (size scaling)', () => {
    it('should scale size based on screen width', () => {
      const result = s(100);
      expect(result).toBe(100); // Base width is 375, so scale is 1
    });

    it('should return rounded values', () => {
      (Dimensions.get as jest.Mock).mockReturnValueOnce({
        width: 750, // 2x scale
        height: 1624,
      });
      const result = s(100);
      expect(result).toBe(200);
    });
  });

  describe('vs (vertical size scaling)', () => {
    it('should scale size based on screen height', () => {
      const result = vs(50);
      expect(result).toBe(50); // Base height is 812, so scale is 1
    });
  });

  describe('ms (moderate size scaling)', () => {
    it('should scale size based on average of width and height', () => {
      const result = ms(16);
      expect(result).toBe(16); // Base dimensions, so scale is 1
    });
  });

  describe('fs (font size scaling)', () => {
    it('should scale font size with pixel ratio consideration', () => {
      const result = fs(16);
      expect(result).toBe(16);
    });
  });

  describe('isTablet', () => {
    it('should return false for phone dimensions', () => {
      (Dimensions.get as jest.Mock).mockReturnValueOnce({
        width: 375,
        height: 812,
      });
      expect(isTablet()).toBe(false);
    });

    it('should return true for tablet dimensions', () => {
      (Dimensions.get as jest.Mock).mockReturnValueOnce({
        width: 768,
        height: 1024,
      });
      expect(isTablet()).toBe(true);
    });
  });

  describe('isSmallScreen', () => {
    it('should return false for normal screen', () => {
      (Dimensions.get as jest.Mock).mockReturnValueOnce({
        width: 375,
        height: 812,
      });
      expect(isSmallScreen()).toBe(false);
    });

    it('should return true for small screen', () => {
      (Dimensions.get as jest.Mock).mockReturnValueOnce({
        width: 320,
        height: 568,
      });
      expect(isSmallScreen()).toBe(true);
    });
  });
});


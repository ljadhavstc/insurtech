/**
 * Registration Step Service
 * 
 * Tracks registration progress and stores step data for resuming registration.
 * Each step stores its data after successful API call.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type RegistrationStep = 
  | 'mobile-input' 
  | 'otp-verification' 
  | 'password-setup' 
  | 'email-input' 
  | 'cpr-verification' 
  | 'completed';

export interface RegistrationStepData {
  step: RegistrationStep;
  data: Record<string, any>;
  timestamp: number;
}

const REGISTRATION_STEPS_KEY = 'registration_steps';
const CURRENT_STEP_KEY = 'registration_current_step';

/**
 * Get all stored registration step data
 */
export const getRegistrationSteps = async (): Promise<RegistrationStepData[]> => {
  try {
    const data = await AsyncStorage.getItem(REGISTRATION_STEPS_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting registration steps:', error);
    return [];
  }
};

/**
 * Get current registration step
 */
export const getCurrentRegistrationStep = async (): Promise<RegistrationStep | null> => {
  try {
    const step = await AsyncStorage.getItem(CURRENT_STEP_KEY);
    return step as RegistrationStep | null;
  } catch (error) {
    console.error('Error getting current registration step:', error);
    return null;
  }
};

/**
 * Save registration step data
 */
export const saveRegistrationStep = async (
  step: RegistrationStep,
  stepData: Record<string, any>
): Promise<void> => {
  try {
    const steps = await getRegistrationSteps();
    
    // Remove existing step if it exists
    const filteredSteps = steps.filter(s => s.step !== step);
    
    // Add new step data
    const newStep: RegistrationStepData = {
      step,
      data: stepData,
      timestamp: Date.now(),
    };
    
    filteredSteps.push(newStep);
    
    // Sort by step order
    const stepOrder: RegistrationStep[] = [
      'mobile-input',
      'otp-verification',
      'password-setup',
      'email-input',
      'cpr-verification',
      'completed',
    ];
    
    filteredSteps.sort((a, b) => {
      const indexA = stepOrder.indexOf(a.step);
      const indexB = stepOrder.indexOf(b.step);
      return indexA - indexB;
    });
    
    await AsyncStorage.setItem(REGISTRATION_STEPS_KEY, JSON.stringify(filteredSteps));
    await AsyncStorage.setItem(CURRENT_STEP_KEY, step);
  } catch (error) {
    console.error('Error saving registration step:', error);
  }
};

/**
 * Get data for a specific step
 */
export const getStepData = async (step: RegistrationStep): Promise<Record<string, any> | null> => {
  try {
    const steps = await getRegistrationSteps();
    const stepData = steps.find(s => s.step === step);
    return stepData?.data || null;
  } catch (error) {
    console.error('Error getting step data:', error);
    return null;
  }
};

/**
 * Clear all registration step data (after successful completion or logout)
 */
export const clearRegistrationSteps = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(REGISTRATION_STEPS_KEY);
    await AsyncStorage.removeItem(CURRENT_STEP_KEY);
  } catch (error) {
    console.error('Error clearing registration steps:', error);
  }
};

/**
 * Get next step to resume from
 */
export const getNextStepToResume = async (): Promise<RegistrationStep | null> => {
  try {
    const currentStep = await getCurrentRegistrationStep();
    if (!currentStep) return null;
    
    const stepOrder: RegistrationStep[] = [
      'mobile-input',
      'otp-verification',
      'password-setup',
      'email-input',
      'cpr-verification',
      'completed',
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex === -1 || currentIndex === stepOrder.length - 1) {
      return null; // Already completed or invalid step
    }
    
    // Return next step
    return stepOrder[currentIndex + 1];
  } catch (error) {
    console.error('Error getting next step to resume:', error);
    return null;
  }
};

/**
 * Check if registration is in progress
 */
export const isRegistrationInProgress = async (): Promise<boolean> => {
  try {
    const currentStep = await getCurrentRegistrationStep();
    return currentStep !== null && currentStep !== 'completed';
  } catch (error) {
    return false;
  }
};


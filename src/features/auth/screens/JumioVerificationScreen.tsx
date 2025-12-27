/**
 * JUMIO Verification Screen
 * 
 * Screen that automatically starts JUMIO verification flow.
 * Shows loading state while initializing and during verification.
 * Handles success/error states and navigates accordingly.
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/Toast';
import { Text } from '@/components/primitives/Text';
import { jumioService, JumioResult } from '@/services/jumioService';
import { identityVerifyRequest } from '@/services/requests';
import { authStore } from '@/stores/authStore';
import { saveRegistrationStep } from '@/services/registrationStepService';
import { logCustomerStepRequest } from '@/services/requests';
import { lightTheme } from '@/styles/tokens';
import { vs, s } from '@/utils/scale';

type AuthStackParamList = {
  JumioVerification: undefined;
  VerificationProgress: undefined;
  Onboarding: undefined;
  [key: string]: any;
};

type JumioVerificationScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'JumioVerification'>;

export const JumioVerificationScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<JumioVerificationScreenNavigationProp>();
  const { showToast } = useToast();
  const [status, setStatus] = useState<'initializing' | 'ready' | 'scanning' | 'processing' | 'error'>('initializing');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasStartedRef = useRef(false); // Prevent multiple starts

  useEffect(() => {
    // Auto-start verification when screen loads (only once)
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      startVerification();
    }

    // Cleanup on unmount
    return () => {
      console.log('🧹 Cleaning up JUMIO verification screen');
      jumioService.cleanup();
    };
  }, []); // Empty deps - only run once

  const startVerification = async () => {
    try {
      setStatus('initializing');
      setErrorMessage('');

      // Initialize JUMIO SDK (this will get token from backend)
      await jumioService.initialize();
      
      setStatus('ready');
      
      // Small delay to show ready state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setStatus('scanning');
      
      // Start JUMIO verification flow
      const jumioResult: JumioResult = await jumioService.startVerification();

      if (!jumioResult.success || !jumioResult.documentData) {
        throw new Error(jumioResult.error?.errorMessage || 'JUMIO verification failed');
      }

      setStatus('processing');
      console.log('⚙️ Step 3: Processing verification result...');

      // Process the verification result
      await processVerificationResult(jumioResult);
      console.log('✅ Step 3: Verification processing completed');
      
    } catch (error: any) {
      // Handle user cancellation gracefully
      if (error.message?.includes('cancelled')) {
        setErrorMessage(t('auth.verification.cancelled', 'Verification cancelled'));
        setStatus('error');
        // Navigate back after a delay
        setTimeout(() => {
          navigation.navigate('Onboarding');
        }, 2000);
        return;
      }

      // Handle permission errors
      if (error.message?.includes('permission')) {
        setErrorMessage(t('auth.verification.permissionError', 'Camera and storage permissions are required for document scanning'));
        setStatus('error');
        showToast({
          type: 'error',
          message: error.message,
        });
        return;
      }

      // Handle other errors
      setErrorMessage(error.message || 'Failed to start verification');
      setStatus('error');
      showToast({
        type: 'error',
        message: error.message || 'Failed to start verification',
      });
    }
  };

  const processVerificationResult = async (jumioResult: JumioResult) => {
    try {
      const documentData = jumioResult.documentData!;
      
      console.log('📄 Processing document data:', {
        firstName: documentData.firstName,
        lastName: documentData.lastName,
        idNumber: documentData.idNumber,
        personalNumber: documentData.personalNumber,
        dob: documentData.dob,
      });
      
      // Extract CPR (with DL to CPR mapping for testing)
      const cpr = jumioService.extractCPR(documentData);
      const firstName = documentData.firstName || '';
      const lastName = documentData.lastName || '';
      const dob = documentData.dob || '';
      const expiryDate = documentData.expiryDate || '';

      console.log('🔍 Extracted data:', { cpr, firstName, lastName, dob });

      // Validate extracted data
      if (!cpr) {
        throw new Error('CPR/ID number not found in scanned document. Please try again.');
      }

      if (!firstName || !lastName || !dob) {
        throw new Error('Required information missing from scanned document');
      }

      // Get user info from store
      const user = authStore.getState().user;
      const mobileNumber = user?.mobile_number || user?.username || '';

      if (!mobileNumber) {
        // If no user, we can still proceed but log it
        console.warn('⚠️ No user mobile number found, proceeding without it');
      }

      // Submit to backend API if user exists
      if (mobileNumber) {
        try {
          console.log('📤 Submitting verification data to backend /customer/identity-verify...', {
            mobile_number: mobileNumber,
            cpr,
            first_name: firstName,
            last_name: lastName,
          });
          
          const verifyResponse = await identityVerifyRequest({
            mobile_number: mobileNumber,
            cpr: cpr, // This will be DL number mapped to CPR for testing
            first_name: firstName,
            last_name: lastName,
            gender: documentData.gender || '', // Extract from document if available
            date_of_birth: dob,
            cpr_expiry_date: expiryDate,
            nationality: documentData.issuingCountry || documentData.nationality || 'Bahrain',
          });
          
          console.log('✅ Backend verification response:', verifyResponse);
        } catch (apiError: any) {
          console.error('❌ Failed to submit verification to backend:', apiError);
          // Continue even if backend submission fails
        }
      }

      // Save step data
      await saveRegistrationStep('cpr-verification', {
        started: true,
        completed: true,
        timestamp: Date.now(),
        jumioTransactionRef: jumioResult.transactionReference,
        transactionId: jumioResult.transactionId,
        cpr: cpr,
        firstName: firstName,
        lastName: lastName,
      });

      // Log customer step
      if (mobileNumber) {
        try {
          await logCustomerStepRequest(mobileNumber, 'CPR verification completed via JUMIO');
        } catch (logError) {
          console.warn('Failed to log customer step:', logError);
        }
      }

      // Navigate to verification progress screen
      navigation.navigate('VerificationProgress');
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to process verification');
      setStatus('error');
      showToast({
        type: 'error',
        message: error.message || 'Failed to process verification',
      });
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'initializing':
        return t('auth.verification.initializing', 'Initializing verification...');
      case 'ready':
        return t('auth.verification.ready', 'Ready to scan');
      case 'scanning':
        return t('auth.verification.scanning', 'Scanning document...');
      case 'processing':
        return t('auth.verification.processing', 'Processing verification...');
      case 'error':
        return errorMessage || t('auth.verification.error', 'Verification failed');
      default:
        return '';
    }
  };

  return (
    <View className="flex-1 bg-theme-background items-center justify-center">
      <StatusBar barStyle="dark-content" backgroundColor={lightTheme.background} />
      
      {/* Loading Indicator */}
      {status !== 'error' && (
        <ActivityIndicator 
          size="large" 
          color={lightTheme.primary} 
          style={{ marginBottom: vs(20) }}
        />
      )}

      {/* Status Text */}
      <View className="px-md items-center">
        <Text 
          variant="screenTitle" 
          className="text-theme-text-primary text-center mb-xs"
        >
          {getStatusText()}
        </Text>
        
        {status === 'initializing' && (
          <Text 
            variant="bodySmall" 
            className="text-theme-text-secondary text-center"
          >
            {t('auth.verification.initializingSubtitle', 'Preparing document scanner...')}
          </Text>
        )}
        
        {status === 'scanning' && (
          <Text 
            variant="bodySmall" 
            className="text-theme-text-secondary text-center"
          >
            {t('auth.verification.scanningSubtitle', 'Please follow the instructions on screen')}
          </Text>
        )}
        
        {status === 'processing' && (
          <Text 
            variant="bodySmall" 
            className="text-theme-text-secondary text-center"
          >
            {t('auth.verification.processingSubtitle', 'Verifying your document...')}
          </Text>
        )}
      </View>

      {/* Error State */}
      {status === 'error' && (
        <View className="px-md mt-md items-center">
          <Text 
            variant="body" 
            className="text-error text-center"
          >
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};


/**
 * JUMIO Service
 * 
 * Handles JUMIO SDK initialization using backend token,
 * document capture, and result processing
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import { permissionService } from './permissionService';
import { initiateJumioVerification, checkJumioVerificationStatus } from './requests';
import { authStore } from '@/stores/authStore';
import Config from 'react-native-config';

const { JumioMobileSDK } = NativeModules;
const jumioEmitter = new NativeEventEmitter(JumioMobileSDK);

export interface JumioDocumentData {
  selectedDocumentType?: string;
  selectedCountry?: string;
  idNumber?: string;
  personalNumber?: string;
  documentNumber?: string; // For DL
  firstName?: string;
  lastName?: string;
  dob?: string;
  expiryDate?: string;
  issuingDate?: string;
  issuingCountry?: string;
  addressLine?: string;
  city?: string;
  subdivision?: string;
  postCode?: string;
  transactionReference?: string;
  [key: string]: any;
}

export interface JumioError {
  errorCode: string;
  errorMessage: string;
}

export interface JumioResult {
  success: boolean;
  documentData?: JumioDocumentData;
  error?: JumioError;
  transactionReference?: string;
  transactionId?: string;
  accountId?: string;
  workflowId?: string;
}

// For testing: Map Indian DL number to CPR
const mapDLNumberToCPR = (dlNumber: string | undefined): string | undefined => {
  if (!dlNumber) return undefined;
  
  // For testing: Treat Indian DL number as CPR
  // Remove any spaces or special characters
  const cleaned = dlNumber.replace(/[^A-Z0-9]/gi, '');
  
  // If it looks like an Indian DL (alphanumeric, typically 10-15 chars)
  // Use it as CPR for testing
  if (cleaned.length >= 8 && cleaned.length <= 15) {
    return cleaned;
  }
  
  return dlNumber;
};

class JumioService {
  private isInitialized = false;
  private isStarting = false; // Prevent multiple start calls
  private resultPromise: {
    resolve: (result: JumioResult) => void;
    reject: (error: Error) => void;
  } | null = null;
  
  private currentToken: string | null = null;
  private currentDatacenter: string = 'US';
  private currentTransactionId: string | null = null;
  private currentAccountId: string | null = null;
  private currentWorkflowId: string | null = null;
  private isProcessingResult = false; // Prevent multiple result processing
  private faceErrorCount = 0; // Track face errors to limit retries
  private maxFaceErrors = 3; // Maximum face errors before giving up

  /**
   * Get JUMIO token from backend
   */
  private async getJumioToken(): Promise<{
    token: string;
    datacenter: string;
    transactionId?: string;
    accountId?: string;
    workflowId?: string;
  }> {
    try {
      // Get user mobile number from auth store (if available)
      const user = authStore.getState().user;
      const mobileNumber = user?.mobile_number || user?.username;

      console.log('🔄 Requesting JUMIO token from backend...', { mobileNumber });
      
      // Call backend API to get JUMIO token
      const response = await initiateJumioVerification(mobileNumber);
      
      console.log('✅ Backend response received:', {
        success: response.success,
        error_code: response.error_code,
        message: response.message,
        hasToken: !!response.data?.token,
        transactionId: response.data?.transactionId,
        accountId: response.data?.accountId,
        workflowExecutionId: response.data?.workflowExecutionId,
        datacenter: response.data?.datacenter,
      });

      // Extract token from response.data (new format) or root level (legacy)
      const token = response.data?.token || response.token || response.api_token;
      
      // Extract transaction details from response.data (new format) or root level (legacy)
      const transactionId = response.data?.transactionId || response.transaction_id;
      const accountId = response.data?.accountId || response.account_id;
      const workflowId = response.data?.workflowExecutionId || response.workflow_id;

      if (!token) {
        throw new Error('JUMIO token not received from backend');
      }

      // JUMIO React Native SDK only requires token and datacenter
      // The token from backend is self-contained and doesn't need api_secret
      const datacenter = 
        response.data?.datacenter || 
        response.datacenter || 
        Config.JUMIO_DATACENTER || 
        'EU'; // Default to EU if not specified

      // Store transaction details for status checking
      this.currentTransactionId = transactionId || null;
      this.currentAccountId = accountId || null;
      this.currentWorkflowId = workflowId || null;

      console.log('📦 Extracted JUMIO data:', {
        tokenPreview: token.substring(0, 20) + '...',
        datacenter,
        transactionId: this.currentTransactionId,
        accountId: this.currentAccountId,
        workflowId: this.currentWorkflowId,
      });

      return {
        token,
        datacenter,
        transactionId: this.currentTransactionId || undefined,
        accountId: this.currentAccountId || undefined,
        workflowId: this.currentWorkflowId || undefined,
      };
    } catch (error: any) {
      throw new Error(`Failed to get JUMIO token from backend: ${error.message}`);
    }
  }

  /**
   * Initialize JUMIO SDK with token from backend
   */
  async initialize(): Promise<void> {
    // Prevent multiple initializations
    if (this.isInitialized && this.currentToken) {
      console.log('ℹ️ JUMIO SDK already initialized, skipping...');
      return;
    }

    try {
      // Get token from backend
      const res = await this.getJumioToken();
      console.log('JUMIO API response. ', res);
      this.currentToken = res.token;
      this.currentDatacenter = res.datacenter;

      // Reset face error count on new initialization
      this.faceErrorCount = 0;

      // Initialize JUMIO SDK with token and datacenter only
      // The React Native SDK uses initialize(token, datacenter) - no api_secret needed
      console.log('🚀 Initializing JUMIO SDK...', {
        tokenPreview: res.token.substring(0, 20) + '...',
        datacenter: res.datacenter,
        transactionId: res.transactionId,
        accountId: res.accountId,
        workflowId: res.workflowId,
      });
      
      JumioMobileSDK.initialize(res.token, res.datacenter);
      
      console.log('✅ JUMIO SDK initialized successfully');

      this.setupEventListeners();
      this.isInitialized = true;
    } catch (error: any) {
      this.isInitialized = false;
      throw new Error(`Failed to initialize JUMIO SDK: ${error.message}`);
    }
  }

  /**
   * Setup event listeners for JUMIO SDK callbacks
   */
  private setupEventListeners(): void {
    // Remove existing listeners to avoid duplicates
    // This prevents multiple listeners from being added on re-renders
    console.log('🔧 Setting up JUMIO event listeners...');
    jumioEmitter.removeAllListeners('EventResult');
    jumioEmitter.removeAllListeners('EventError');

    // Listen for successful verification result
    // EventResult contains credentials array with document data
    jumioEmitter.addListener('EventResult', (event: any) => {
      console.log('✅ JUMIO EventResult received:', JSON.stringify(event, null, 2));
      
      // Prevent processing the same result multiple times
      if (this.isProcessingResult) {
        console.warn('⚠️ Already processing a result, ignoring duplicate EventResult');
        return;
      }
      
      if (this.resultPromise) {
        this.isProcessingResult = true;
        try {
          // Extract document data from credentials array
          const credentials = event.credentials || [];
          const idCredential = credentials.find((c: any) => c.credentialCategory === 'ID');
          const faceCredential = credentials.find((c: any) => c.credentialCategory === 'FACE');
          
          // Log face verification status
          if (faceCredential) {
            console.log('👤 Face verification status:', {
              passed: faceCredential.passed,
              credentialId: faceCredential.credentialId,
            });
            
            // If face verification failed, log warning but continue with ID
            if (faceCredential.passed === 'false' || faceCredential.passed === false) {
              console.warn('⚠️ Face verification failed, but continuing with ID document data');
            }
          } else {
            console.log('ℹ️ No face verification credential found (ID-only verification)');
          }
          
          // ID credential is required
          if (!idCredential) {
            throw new Error('No ID credential found in JUMIO result. Please scan your ID document.');
          }

          // Map the credential data to our document data format
          const documentData: JumioDocumentData = {
            selectedDocumentType: idCredential.selectedDocumentType,
            selectedCountry: idCredential.selectedCountry,
            idNumber: idCredential.idNumber,
            personalNumber: idCredential.personalNumber,
            documentNumber: idCredential.idNumber || idCredential.personalNumber,
            firstName: idCredential.firstName,
            lastName: idCredential.lastName,
            dob: idCredential.dateOfBirth,
            expiryDate: idCredential.expiryDate,
            issuingDate: idCredential.issuingDate,
            issuingCountry: idCredential.issuingCountry,
            addressLine: idCredential.addressLine,
            city: idCredential.city,
            subdivision: idCredential.subdivision,
            postCode: idCredential.postCode,
            gender: idCredential.gender,
            nationality: idCredential.nationality,
          };

          console.log('📄 Extracted document data:', {
            firstName: documentData.firstName,
            lastName: documentData.lastName,
            idNumber: documentData.idNumber,
            personalNumber: documentData.personalNumber,
            faceVerificationPassed: faceCredential?.passed,
          });

          // Resolve with ID data even if face verification failed
          console.log('✅ Resolving JUMIO result with ID document data');
          this.resultPromise.resolve({
            success: true,
            documentData,
            transactionId: event.accountId || this.currentTransactionId || undefined,
            accountId: event.accountId || this.currentAccountId || undefined,
            workflowId: event.workflowId || this.currentWorkflowId || undefined,
          });
          this.resultPromise = null;
          this.isProcessingResult = false;
          this.isStarting = false; // Reset starting flag
        } catch (error: any) {
          console.error('❌ Error processing JUMIO result:', error);
          this.isProcessingResult = false;
          this.isStarting = false; // Reset starting flag
          if (this.resultPromise) {
            this.resultPromise.reject(new Error(`Failed to process JUMIO result: ${error.message}`));
            this.resultPromise = null;
          }
        }
      }
    });

    // Listen for errors (includes cancellation and face verification failures)
    jumioEmitter.addListener('EventError', (error: JumioError) => {
      console.error('❌ JUMIO EventError:', JSON.stringify(error, null, 2));
      
      if (this.resultPromise) {
        const errorMessage = error.errorMessage || 'Unknown error';
        const errorCode = error.errorCode || 'UNKNOWN';
        
        // Check if it's a cancellation
        if (errorMessage.toLowerCase().includes('cancel') || errorCode.includes('CANCEL')) {
          console.log('🚫 User cancelled JUMIO verification');
          this.isStarting = false; // Reset starting flag
          this.resultPromise.reject(new Error('User cancelled JUMIO verification'));
          this.resultPromise = null;
          return;
        }
        
        // Check if it's a face verification error
        // These are common and we should handle them gracefully
        const isFaceError = 
          errorMessage.toLowerCase().includes('face') ||
          errorMessage.toLowerCase().includes('liveness') ||
          errorMessage.toLowerCase().includes('selfie') ||
          errorCode.includes('FACE') ||
          errorCode.includes('LIVENESS');
        
        if (isFaceError) {
          this.faceErrorCount++;
          console.warn(`⚠️ Face verification error #${this.faceErrorCount}/${this.maxFaceErrors}:`, errorMessage);
          console.warn('ℹ️ This is common - face verification may fail but ID document can still be processed');
          
          // If we've exceeded max face errors, reject immediately
          if (this.faceErrorCount >= this.maxFaceErrors) {
            console.error(`❌ Maximum face verification attempts (${this.maxFaceErrors}) reached`);
            this.isStarting = false; // Reset starting flag
            if (this.resultPromise) {
              this.resultPromise.reject(
                new Error(`Face verification failed after ${this.maxFaceErrors} attempts: ${errorMessage}. Please try again.`)
              );
              this.resultPromise = null;
            }
            return;
          }
          
          console.warn('ℹ️ Waiting for ID document result...');
          
          // Don't reject immediately for face errors - wait to see if we get EventResult with ID data
          // If no result comes within a few seconds, then reject
          setTimeout(() => {
            if (this.resultPromise && !this.isProcessingResult) {
              console.error('❌ Face verification failed and no ID data received after waiting');
              this.resultPromise.reject(
                new Error(`Face verification failed: ${errorMessage}. Please try scanning your ID document again.`)
              );
              this.resultPromise = null;
            } else if (this.isProcessingResult) {
              console.log('✅ ID document result is being processed, ignoring face error');
            }
          }, 5000); // Wait 5 seconds for ID result
        } else {
          // For other errors, reject immediately
          console.error('❌ JUMIO error (non-face):', errorMessage);
          this.isStarting = false; // Reset starting flag
          this.resultPromise.reject(
            new Error(`JUMIO Error [${errorCode}]: ${errorMessage}`)
          );
          this.resultPromise = null;
        }
      }
    });
  }

  /**
   * Check and request required permissions before starting verification
   */
  async checkAndRequestPermissions(): Promise<void> {
    // Check camera permission
    const cameraCheck = await permissionService.checkCameraPermission();
    if (!cameraCheck.granted) {
      const cameraRequest = await permissionService.requestCameraPermission();
      if (!cameraRequest.granted) {
        if (cameraRequest.blocked) {
          permissionService.showPermissionDeniedAlert('Camera');
        }
        throw new Error('Camera permission is required for document scanning');
      }
    }

    // Check photo library permission (for selecting from gallery)
    const photoCheck = await permissionService.checkPhotoLibraryPermission();
    if (!photoCheck.granted) {
      const photoRequest = await permissionService.requestPhotoLibraryPermission();
      if (!photoRequest.granted) {
        if (photoRequest.blocked) {
          permissionService.showPermissionDeniedAlert('Photo Library');
        }
        // Note: Photo library permission might not be critical if JUMIO SDK
        // handles file selection internally, but it's good to have
      }
    }
  }

  /**
   * Start JUMIO verification flow
   */
  async startVerification(): Promise<JumioResult> {
    // Prevent multiple simultaneous starts
    if (this.isStarting) {
      console.warn('⚠️ JUMIO verification already starting, ignoring duplicate call');
      throw new Error('JUMIO verification is already in progress');
    }

    if (!this.isInitialized) {
      await this.initialize();
    }

    // Reset flags
    this.isProcessingResult = false;
    this.faceErrorCount = 0;
    this.isStarting = true;

    // Check and request permissions before starting
    console.log('🔐 Checking permissions...');
    await this.checkAndRequestPermissions();
    console.log('✅ Permissions granted');

    console.log('📸 Starting JUMIO verification flow...');
    console.log('ℹ️ Note: Face verification errors are common and will be handled gracefully');
    console.log(`ℹ️ Maximum face error attempts: ${this.maxFaceErrors}`);
    
    return new Promise<JumioResult>((resolve, reject) => {
      this.resultPromise = { resolve, reject };

      // Set timeout to prevent infinite waiting
      const timeout = setTimeout(() => {
        if (this.resultPromise) {
          console.error('⏱️ JUMIO verification timeout after 2 minutes');
          this.resultPromise.reject(new Error('JUMIO verification timed out. Please try again.'));
          this.resultPromise = null;
        }
      }, 2 * 60 * 1000); // 5 minutes timeout

      try {
        // Start JUMIO SDK
        console.log('▶️ Calling JUMIO SDK start()...');
        JumioMobileSDK.start();
        console.log('✅ JUMIO SDK start() called - waiting for result...');
        
        // Clear timeout when promise resolves/rejects
        const originalResolve = this.resultPromise.resolve;
        const originalReject = this.resultPromise.reject;
        
        this.resultPromise.resolve = (value) => {
          clearTimeout(timeout);
          originalResolve(value);
        };
        
        this.resultPromise.reject = (error) => {
          clearTimeout(timeout);
          originalReject(error);
        };
      } catch (error: any) {
        clearTimeout(timeout);
        this.isStarting = false; // Reset starting flag
        this.resultPromise = null;
        console.error('❌ Error starting JUMIO SDK:', error);
        reject(new Error(`Failed to start JUMIO verification: ${error.message}`));
      }
    });
  }

  /**
   * Check verification status with backend
   */
  async checkVerificationStatus(): Promise<{
    status: string;
    cpr?: string;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
  }> {
    if (!this.currentTransactionId || !this.currentAccountId || !this.currentWorkflowId) {
      throw new Error('Transaction details not available. Please complete verification first.');
    }

    const user = authStore.getState().user;
    const mobileNumber = user?.mobile_number || user?.username;

    if (!mobileNumber) {
      throw new Error('User mobile number not found');
    }

    const response = await checkJumioVerificationStatus({
      transaction_id: this.currentTransactionId,
      msisdn: mobileNumber,
      account_id: this.currentAccountId,
      workflow_id: this.currentWorkflowId, // Backend expects workflow_id in request
    });

    return {
      status: response.status || response.verification_status || 'UNKNOWN',
      cpr: response.cpr,
      firstName: response.first_name,
      lastName: response.last_name,
      dateOfBirth: response.date_of_birth,
    };
  }

  /**
   * Extract CPR from document data (with DL to CPR mapping for testing)
   */
  extractCPR(documentData: JumioDocumentData): string | null {
    // Try different field names that might contain CPR/ID number
    const possibleCPR = 
      documentData.personalNumber || 
      documentData.idNumber || 
      documentData.documentNumber;

    if (!possibleCPR) {
      return null;
    }

    // For testing: Map Indian DL number to CPR
    const cpr = mapDLNumberToCPR(possibleCPR);
    return cpr || null;
  }

  /**
   * Clean up event listeners
   */
  cleanup(): void {
    console.log('🧹 Cleaning up JUMIO service...');
    jumioEmitter.removeAllListeners('EventResult');
    jumioEmitter.removeAllListeners('EventError');
    this.isInitialized = false;
    this.isStarting = false;
    this.isProcessingResult = false;
    this.faceErrorCount = 0;
    this.currentToken = null;
    this.currentTransactionId = null;
    this.currentAccountId = null;
    this.currentWorkflowId = null;
  }
}

export const jumioService = new JumioService();

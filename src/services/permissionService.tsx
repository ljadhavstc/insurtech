/**
 * Permission Service
 * 
 * Handles runtime permission requests for camera and file storage
 */

import { Platform, Linking, Alert } from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
  PermissionStatus,
} from 'react-native-permissions';

export interface PermissionResult {
  granted: boolean;
  blocked?: boolean;
  unavailable: boolean;
  message?: string;
  denied?: boolean;
}

class PermissionService {
  /**
   * Get camera permission based on platform
   */
  private getCameraPermission(): Permission {
    return Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
  }

  /**
   * Get photo library permission based on platform
   */
  private getPhotoLibraryPermission(): Permission {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.PHOTO_LIBRARY;
    } else {
      // Android 13+ uses READ_MEDIA_IMAGES, older versions use READ_EXTERNAL_STORAGE
      if (Number(Platform.Version) >= 33) {
        return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
      } else {
        return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    }
  }

  /**
   * Check camera permission status
   */
  async checkCameraPermission(): Promise<PermissionResult> {
    try {
      const permission = this.getCameraPermission();
      const result = await check(permission);

      return {
        granted: result === RESULTS.GRANTED,
        blocked: result === RESULTS.BLOCKED,
        unavailable: result === RESULTS.UNAVAILABLE,
      };
    } catch (error: any) {
      return {
        granted: false,
        blocked: false,
        unavailable: true,
        message: error.message,
      };
    }
  }

  /**
   * Request camera permission
   */
  async requestCameraPermission(): Promise<PermissionResult> {
    try {
      const permission = this.getCameraPermission();
      const result = await request(permission);

      if (result === RESULTS.BLOCKED) {
        return {
          granted: false,
          blocked: true,
          unavailable: false,
          message: 'Camera permission is blocked. Please enable it in Settings.',
        };
      }

      return {
        granted: result === RESULTS.GRANTED,
        denied: result === RESULTS.DENIED,
        unavailable: result === RESULTS.UNAVAILABLE,
      };
    } catch (error: any) {
      return {
        granted: false,
        denied: false,
        unavailable: true,
        message: error.message,
      };
    }
  }

  /**
   * Check photo library permission status
   */
  async checkPhotoLibraryPermission(): Promise<PermissionResult> {
    try {
      const permission = this.getPhotoLibraryPermission();
      const result = await check(permission);

      return {
        granted: result === RESULTS.GRANTED,
        blocked: result === RESULTS.BLOCKED,
        unavailable: result === RESULTS.UNAVAILABLE,
      };
    } catch (error: any) {
      return {
        granted: false,
        blocked: false,
        unavailable: true,
        message: error.message,
      };
    }
  }

  /**
   * Request photo library permission
   */
  async requestPhotoLibraryPermission(): Promise<PermissionResult> {
    try {
      const permission = this.getPhotoLibraryPermission();
      const result = await request(permission);

      if (result === RESULTS.BLOCKED) {
        return {
          granted: false,
          blocked: true,
          unavailable: false,
          message: 'Photo library permission is blocked. Please enable it in Settings.',
        };
      }

      return {
        granted: result === RESULTS.GRANTED,
        denied: result === RESULTS.DENIED,
        unavailable: result === RESULTS.UNAVAILABLE,
      };
    } catch (error: any) {
      return {
        granted: false,
        blocked: false,
        unavailable: true,
        message: error.message,
      };
    }
  }

  /**
   * Request all required permissions for document scanning
   */
  async requestAllPermissions(): Promise<{
    camera: PermissionResult;
    photoLibrary: PermissionResult;
  }> {
    const [camera, photoLibrary] = await Promise.all([
      this.requestCameraPermission(),
      this.requestPhotoLibraryPermission(),
    ]);

    return { camera, photoLibrary };
  }

  /**
   * Open app settings
   */
  async openSettings(): Promise<void> {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('Failed to open settings:', error);
    }
  }

  /**
   * Show permission denied alert with option to open settings
   */
  showPermissionDeniedAlert(
    permissionName: string,
    onOpenSettings?: () => void
  ): void {
    Alert.alert(
      'Permission Required',
      `${permissionName} permission is required to scan documents. Please enable it in Settings.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            this.openSettings();
            onOpenSettings?.();
          },
        },
      ]
    );
  }
}

export const permissionService = new PermissionService();
/**
 * InsurTech App
 * 
 * Main app entry point with providers and navigation.
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { Providers } from './src/app/providers';
import { RootNavigator } from '@/navigation/RootNavigator';
import './global.css'; // NativeWind global styles

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Providers>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <RootNavigator />
    </Providers>
  );
}

export default App;

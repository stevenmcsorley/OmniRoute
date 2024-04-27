import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.driver.app',
  appName: 'Driver App',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'co.passenger.app',
  appName: 'Passenger App',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;

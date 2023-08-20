import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.aps200.app',
  appName: 'APS Planograph',
  webDir: 'dist/aps200',
  server: {
    androidScheme: 'https'
  }
};

export default config;

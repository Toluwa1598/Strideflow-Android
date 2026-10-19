import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.strideflow.habitstudio',
  appName: 'StrideFlow',
  webDir: 'dist',
  bundledWebRuntime: false,
  backgroundColor: '#020617',
  android: {
    allowMixedContent: false
  }
};

export default config;
import { registerRootComponent } from 'expo';
import { enableFreeze } from 'react-native-screens';

import App from './src/App';

// Enable screen freezing for better performance
enableFreeze(true);

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

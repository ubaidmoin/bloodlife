/**
 * @format
 */
// window.addEventListener = x => x;
global.addEventListener = x => x;
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

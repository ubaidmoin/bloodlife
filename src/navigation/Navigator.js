import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FeatherIcon from 'react-native-vector-icons/Feather';

import LoginScreen from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import BecomeDonorScreen from '../screens/BecomeDonor';
import EventScreen from '../screens/common/Events';
import HistoryScreen from '../screens/common/History';
import ContactsScreen from '../screens/common/EmergencyContacts';
//Donor Screens
import DonorHomeScreen from '../screens/donor/Home';
import ProfileScreen from '../screens/donor/Profile';

//Receiver Screens
import ReceiverHomeScreen from '../screens/receiver/Home';
import RequestScreen from '../screens/receiver/Request';
import ProfileReceiverScreen from '../screens/receiver/Profile';

//Drawer Content
import DrawerContent from '../components/common/DrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const drawerStyles = {
  activeTintColor: '#ff5d5b',
  labelStyle: {
    fontWeight: 'bold'
  }
}

const lockedDrawerOptions = ({title}) => ({
  title: title,
  drawerLockMode: 'locked-closed'
})

const HeaderWithMenu = ({ title }, navigation) => ({
  title: title,
  headerTitleStyle: {
    color: '#ff5d5b'
  },
  headerLeft: () => (<FeatherIcon
    style={{ marginLeft: 10 }}
    name="menu"
    size={25}
    onPress={() => navigation.toggleDrawer()}
    color={'#ff5d5b'}
  />)
})

const HeaderWithBackButton = ({ title }, navigation) => ({
  title: title,
  headerTitleStyle: {
    color: '#ff5d5b'
  }
})

const AuthDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Login" component={LoginScreen} options={lockedDrawerOptions} />
    <Drawer.Screen name="Register" component={RegisterScreen} options={lockedDrawerOptions} />
  </Drawer.Navigator>
)

const DonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" 
    component={DonorHomeScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Home' }, navigation)}  />
  </Stack.Navigator>
)

const ProfileDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" 
    component={ProfileScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Profile' }, navigation)}  />
  </Stack.Navigator>
)

const EventDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Events" 
    component={EventScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Events' }, navigation)}  />
  </Stack.Navigator>
)

const ContactDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Emergency Contacts" 
    component={ContactsScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Emergency Contacts' }, navigation)}  />
  </Stack.Navigator>
)

const HistoryDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="History" 
    component={HistoryScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Donation History' }, navigation)}  />
  </Stack.Navigator>
)

const DonorDrawer = () => (
  <Drawer.Navigator drawerContent={props => <DrawerContent user='donor' {...props} />} drawerContentOptions={drawerStyles}>
    <Drawer.Screen name="DonorHome" component={DonorStack} options={{title: 'Home'}} />
    <Drawer.Screen name="Profile" component={ProfileDonorStack} options={{title: 'Profile'}} />
    <Drawer.Screen name="Events" component={EventDonorStack} options={{title: 'Events'}} />
    <Drawer.Screen name="EmergencyContacts" component={ContactDonorStack} options={{title: 'Emergency Contacts'}} />
    <Drawer.Screen name="History" component={HistoryDonorStack} options={{title: 'Donation History'}} />
    <Drawer.Screen name="Logout" component={AuthDrawer} options={{title: 'Log out'}} />
  </Drawer.Navigator>
)

const ReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" 
    component={ReceiverHomeScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Home' }, navigation)} />
    <Stack.Screen name="Request" 
    component={RequestScreen} 
    options={({navigation}) => HeaderWithBackButton({ title: 'Request' }, navigation)} />
  </Stack.Navigator>
)

const ProfileReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" 
    component={ProfileReceiverScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Profile' }, navigation)}  />
  </Stack.Navigator>
)

const EventReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Events" 
    component={EventScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Events' }, navigation)}  />
  </Stack.Navigator>
)

const ContactReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Emergency Contacts" 
    component={ContactsScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Emergency Contacts' }, navigation)}  />
  </Stack.Navigator>
)

const HistoryReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="History" 
    component={HistoryScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'History' }, navigation)}  />
  </Stack.Navigator>
)

const BecomeDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="BecomeDonor" 
    component={BecomeDonorScreen} 
    options={({navigation}) => HeaderWithMenu({ title: 'Become a donor' }, navigation)}  />
  </Stack.Navigator>
)

const ReceiverDrawer = () => (
  <Drawer.Navigator drawerContent={props => <DrawerContent user='receiver' {...props} />} drawerContentOptions={drawerStyles}>
    <Drawer.Screen name="ReceiverHome" component={ReceiverStack} options={{title: 'Home'}} />
    <Drawer.Screen name="Profile" component={ProfileReceiverStack} options={{title: 'Profile'}} />
    <Drawer.Screen name="Events" component={EventReceiverStack} options={{title: 'Events'}} />
    <Drawer.Screen name="EmergencyContacts" component={ContactReceiverStack} options={{title: 'Emergency Contacts'}} />
    <Drawer.Screen name="History" component={HistoryReceiverStack} options={{title: 'History'}} />
    <Drawer.Screen name="Logout" component={AuthDrawer} options={{title: 'Log out'}} />
    <Drawer.Screen name="BecomeDonor" component={BecomeDonorStack} options={{drawerLabel: () => null}} />
  </Drawer.Navigator>
)

function Navigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="Auth" component={AuthDrawer} options={lockedDrawerOptions} />        
        <Drawer.Screen name="DonorHome" component={DonorDrawer} />
        <Drawer.Screen name="ReceiverHome" component={ReceiverDrawer} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;
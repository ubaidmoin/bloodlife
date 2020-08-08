import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FeatherIcon from 'react-native-vector-icons/Feather';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OcticonsIcons from 'react-native-vector-icons/Octicons';

import LoginScreen from '../screens/auth/Login';
import RegisterScreen from '../screens/auth/Register';
import ForgotPasswordScreen from '../screens/auth/ForgotPassword';
import BecomeDonorScreen from '../screens/BecomeDonor';
import EventScreen from '../screens/common/Events';
import HistoryScreen from '../screens/common/History';
import ContactsScreen from '../screens/common/EmergencyContacts';
import ContactScreen from '../screens/common/Contact';
import FeedbackScreen from '../screens/common/Feedback';
//Donor Screens
import DonorHomeScreen from '../screens/donor/Home';
import ProfileScreen from '../screens/donor/Profile';
import DonateNowScreen from '../screens/donor/DonateNow';
import DonorRequestScreen from '../screens/donor/Request';

//Receiver Screens
import ReceiverHomeScreen from '../screens/receiver/Home';
import RequestScreen from '../screens/receiver/Request';
import ProfileReceiverScreen from '../screens/receiver/Profile';

//Admin Screens
import AdminHomeScreen from '../screens/admin/Donors';
import AdminEventsScreen from '../screens/admin/Events';
import AdminDonationScreen from '../screens/admin/Donations';
import AdminComplaintsScreen from '../screens/admin/Complaints';
import AdminFeedbacksScreen from '../screens/admin/Feedbacks';
import AdminProfileScreen from '../screens/admin/Profile';
import AdminAddDonorScreen from '../screens/admin/AddDonor';

//Drawer Content
import DrawerContent from '../components/common/DrawerContent';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const drawerStyles = {
  activeTintColor: '#ff5d5b',
  labelStyle: {
    fontWeight: 'bold',
  },
};

const lockedDrawerOptions = ({title}) => ({
  title: title,
  drawerLockMode: 'locked-closed',
});

const HeaderWithMenu = ({title, icon}, navigation) => ({
  title: title,
  headerTitleStyle: {
    color: '#ff5d5b',
  },
  headerLeft: () => (
    <FeatherIcon
      style={{marginLeft: 10}}
      name="menu"
      size={25}
      onPress={() => navigation.toggleDrawer()}
      color={'#ff5d5b'}
    />
  ),
});

const HeaderWithBackButton = ({title}, navigation) => ({
  title: title,
  headerTitleStyle: {
    color: '#ff5d5b',
  },
  headerTintColor: '#ff5d5b',
});

const AdminHomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminHome"
      component={AdminHomeScreen}
      options={({navigation}) => HeaderWithMenu({title: 'Home'}, navigation)}
    />
    <Stack.Screen
      name="AddDonor"
      component={AdminAddDonorScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Add Donor'}, navigation)
      }
    />
    <Stack.Screen
      name="AdminProfile"
      component={AdminProfileScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Profile'}, navigation)
      }
    />
  </Stack.Navigator>
);

const AdminEventsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Events"
      component={AdminEventsScreen}
      options={({navigation}) => HeaderWithMenu({title: 'Events'}, navigation)}
    />
  </Stack.Navigator>
);

const AdminDonationsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DonationOptions"
      component={AdminDonationScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Donation Options'}, navigation)
      }
    />
  </Stack.Navigator>
);

const AdminComplaintsStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminHome"
      component={AdminComplaintsScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Complaints'}, navigation)
      }
    />
  </Stack.Navigator>
);

const AdminFeedbacksStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="AdminFeedbacks"
      component={AdminFeedbacksScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Feedbacks'}, navigation)
      }
    />
  </Stack.Navigator>
);

const AdminDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent user="admin" {...props} />}
    drawerContentOptions={drawerStyles}>
    <Drawer.Screen
      name="AdminHome"
      component={AdminHomeStack}
      options={{
        title: 'Home',
        drawerIcon: ({ color }) => <EntypoIcon name={"home"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="DonationOptions"
      component={AdminDonationsStack}
      options={{
        title: 'Donation Options',
      drawerIcon: ({ color }) => <FontAwesome5Icon name={"donate"} color={color} size={25} />,
    }}
    />
    <Drawer.Screen
      name="AdminEvents"
      component={AdminEventsStack}
      options={{
        title: 'Events',
        drawerIcon: ({ color }) => <MaterialIcons name={"event"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="Complaints"
      component={AdminComplaintsStack}
      options={{
        title: 'Complaints',
        drawerIcon: ({ color }) => <OcticonsIcons name={"issue-opened"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="Feedbacks"
      component={AdminFeedbacksStack}
      options={{
        title: 'Feedback',
        drawerIcon: ({ color }) => <MaterialIcons name={"feedback"} color={color} size={25} />,
      }}
    />
    {/* <Drawer.Screen name="Logout" component={AuthDrawer} options={{title: 'Log out'}} />     */}
  </Drawer.Navigator>
);

const AuthDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen
      name="Login"
      component={LoginScreen}
      options={lockedDrawerOptions}
    />
    <Drawer.Screen
      name="ForgotPassword"
      component={ForgotPasswordScreen}
      options={lockedDrawerOptions}
    />
    <Drawer.Screen
      name="Register"
      component={RegisterScreen}
      options={lockedDrawerOptions}
    />
  </Drawer.Navigator>
);

const DonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={DonorHomeScreen}
      options={({navigation}) => HeaderWithMenu({title: 'Home'}, navigation)}
    />
    <Stack.Screen
      name="DonorRequest"
      component={DonorRequestScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Request'}, navigation)
      }
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Profile'}, navigation)
      }
    />
    <Stack.Screen
      name="DonorEmergencyContacts"
      component={ContactsScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Emergency Contacts'}, navigation)
      }
    />
  </Stack.Navigator>
);

const DonateNowStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="DonateNow"
      component={DonateNowScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Donate Now'}, navigation)
      }
    />
  </Stack.Navigator>
);

const EventDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Events"
      component={EventScreen}
      options={({navigation}) => HeaderWithMenu({title: 'Events'}, navigation)}
    />
  </Stack.Navigator>
);

const FeedbackDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Feedback"
      component={FeedbackScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Feedback'}, navigation)
      }
    />
  </Stack.Navigator>
);

const ContactDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Contact Us"
      component={ContactScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Contact Us'}, navigation)
      }
    />
  </Stack.Navigator>
);

const HistoryDonorStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="History"
      component={HistoryScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Donation History'}, navigation)
      }
    />
  </Stack.Navigator>
);

const DonorDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent user="donor" {...props} />}
    drawerContentOptions={drawerStyles}>
    <Drawer.Screen
      name="DonorHome"
      component={DonorStack}
      options={{
        title: 'Home',
        drawerIcon: ({ color }) => <EntypoIcon name={"home"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="DonateNow"
      component={DonateNowStack}
      options={{
        title: 'Donate Now',
      drawerIcon: ({ color }) => <FontAwesome5Icon name={"donate"} color={color} size={25} />,
    }}
    />
    <Drawer.Screen
      name="Events"
      component={EventDonorStack}
      options={{
        title: 'Events',
        drawerIcon: ({ color }) => <MaterialIcons name={"event"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="History"
      component={HistoryDonorStack}
      options={{
        title: 'Donation History',
        drawerIcon: ({ color }) => <FontAwesome5Icon name={"history"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="Feedback"
      component={FeedbackDonorStack}
      options={{
        title: 'Feedback',
        drawerIcon: ({ color }) => <MaterialIcons name={"feedback"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="ContactUs"
      component={ContactDonorStack}
      options={{
        title: 'Contact Us',
        drawerIcon: ({ color }) => <FontAwesomeIcon name={"phone"} color={color} size={25} />,
      }}
    />
    {/* <Drawer.Screen name="Logout" component={AuthDrawer} options={{title: 'Log out'}} />     */}
  </Drawer.Navigator>
);

const ReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={ReceiverHomeScreen}
      options={({navigation}) => HeaderWithMenu({title: 'Home'}, navigation)}
    />
    <Stack.Screen
      name="Request"
      component={RequestScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Request'}, navigation)
      }
    />
    <Stack.Screen
      name="BecomeDonor"
      component={BecomeDonorScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Become a Donor'}, navigation)
      }
    />
    <Stack.Screen
      name="ReceiverProfile"
      component={ProfileReceiverScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Profile'}, navigation)
      }
    />
    <Stack.Screen
      name="ReceiverEmergencyContacts"
      component={ContactsScreen}
      options={({navigation}) =>
        HeaderWithBackButton({title: 'Emergency Contacts'}, navigation)
      }
    />
  </Stack.Navigator>
);

const EventReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Events"
      component={EventScreen}
      options={({navigation}) => HeaderWithMenu({title: 'Events'}, navigation)}
    />
  </Stack.Navigator>
);

const FeedbackReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Feedback"
      component={FeedbackScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Feedback'}, navigation)
      }
    />
  </Stack.Navigator>
);

const ContactReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Contact Us"
      component={ContactScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Contact Us'}, navigation)
      }
    />
  </Stack.Navigator>
);

const ReceiverDonateNowStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="ReceiverDonateNow"
      component={DonateNowScreen}
      options={({navigation}) =>
        HeaderWithMenu({title: 'Donate Now'}, navigation)
      }
    />
  </Stack.Navigator>
);

const HistoryReceiverStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="History"
      component={HistoryScreen}
      options={({navigation}) => HeaderWithMenu({title: 'History'}, navigation)}
    />
  </Stack.Navigator>
);

const ReceiverDrawer = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent user="receiver" {...props} />}
    drawerContentOptions={drawerStyles}>
    <Drawer.Screen
      name="ReceiverHome"
      component={ReceiverStack}
      options={{
        title: 'Home',
        drawerIcon: ({ color }) => <EntypoIcon name={"home"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="ReceiverDonateNow"
      component={ReceiverDonateNowStack}
      options={{
        title: 'Donate Now',
      drawerIcon: ({ color }) => <FontAwesome5Icon name={"donate"} color={color} size={25} />,
    }}
    />
    <Drawer.Screen
      name="ReceiverEvents"
      component={EventReceiverStack}
      options={{
        title: 'Events',
        drawerIcon: ({ color }) => <MaterialIcons name={"event"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="ReceiverHistory"
      component={HistoryReceiverStack}
      options={{
        title: 'History',
        drawerIcon: ({ color }) => <FontAwesome5Icon name={"history"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="Feedback"
      component={FeedbackReceiverStack}
      options={{
        title: 'Feedback',
        drawerIcon: ({ color }) => <MaterialIcons name={"feedback"} color={color} size={25} />,
      }}
    />
    <Drawer.Screen
      name="ContactUs"
      component={ContactReceiverStack}
      options={{
        title: 'Contact Us',
        drawerIcon: ({ color }) => <FontAwesomeIcon name={"phone"} color={color} size={25} />,
      }}
    />
    {/* <Drawer.Screen name="Logout" component={AuthDrawer} options={{title: 'Log out'}} />     */}
  </Drawer.Navigator>
);

function Navigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Auth"
          component={AuthDrawer}
          options={lockedDrawerOptions}
        />
        <Drawer.Screen name="DonorHome" component={DonorDrawer} />
        <Drawer.Screen name="ReceiverHome" component={ReceiverDrawer} />
        <Drawer.Screen name="AdminHome" component={AdminDrawer} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Navigator;

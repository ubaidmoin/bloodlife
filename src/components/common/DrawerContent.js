import React, {useEffect, useReducer} from 'react';
import {Text, View, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  DrawerItemList,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {connect} from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import AsyncStorage from '@react-native-community/async-storage';

import * as userDetailsAction from '../../actions/UserDetailsAction';

const DrawerContent = (props) => {
  const userDetails = props.userDetails;

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.container}>
        <Image
          style={styles.imageStyle}
          source={
            userDetails.image !== ''
              ? {uri: 'data:image/jpeg;base64,' + userDetails.image}
              : require('../../assets/img/user.jpg')
          }
        />
        <View style={styles.details}>
          <Text style={styles.textStyle}>
            {userDetails.firstName + ' ' + userDetails.lastName}
          </Text>
          {userDetails.userType !== 'admin' && (
            <View style={styles.ratings}>
              <Text style={styles.textStyle}>
                {userDetails.ratings.toFixed(2)}
              </Text>
              <FontAwesomeIcon name="star" size={20} color={'#ff5d5b'} />
            </View>
          )}

          {
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() =>
                props.navigation.navigate(
                  userDetails.userType === 'receiver'
                    ? 'ReceiverProfile'
                    : userDetails.userType === 'donor'
                    ? 'Profile'
                    : 'AdminProfile',
                )
              }>
              <Text style={styles.editProfile}>Edit Profile</Text>
            </TouchableOpacity>
          }
        </View>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={async () => {
          const res = await AsyncStorage.removeItem('@userDetails');
          if (!res) {
            const setShowFields = props.setShowFields;
            setShowFields(true);
            props.navigation.navigate('Auth');
          }
        }}>
        <EntypoIcon
          style={{marginLeft: 17.5}}
          name="log-out"
          size={25}
          color={'#696565'}
        />
        <Text style={styles.logoutButtonTextStyle}>Log out</Text>
      </TouchableOpacity>
      {props.user === 'receiver' ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => props.navigation.navigate('BecomeDonor')}>
            <EntypoIcon name="drop" size={20} color={'#ff5d5b'} />
            <Text style={styles.buttonTextStyle}>Become a donor</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  details: {
    marginLeft: 10,
  },
  imageStyle: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  textStyle: {
    paddingVertical: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff5d5b',
  },
  buttonContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  buttonTextStyle: {
    marginLeft: 5,
    color: '#ff5d5b',
    fontSize: 15,
    fontWeight: 'bold',
  },
  logoutButtonTextStyle: {
    marginLeft: 26,
    marginVertical: 10,
    color: '#696565',
    fontSize: 14.25,
    fontWeight: 'bold',
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -15,
  },
  editProfile: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  editProfileButton: {
    backgroundColor: '#ff5d5b',
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default connect(
  userDetailsAction.mapStateToProps,
  userDetailsAction.mapDispatchToProps,
)(DrawerContent);

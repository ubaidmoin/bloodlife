import React, {Component} from 'react';
import {
  Keyboard,
  View,
  Text,
  Animated,
  StyleSheet,
  Easing,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import {TextInput} from 'react-native-paper';
import {connect} from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import * as userDetailsAction from '../../actions/UserDetailsAction';
import * as actions from '../../actions/ActionTypes';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
      email: '',
      password: '',
      error: '',
      loading: false,
      showPassword: true,
    };
    this.animatedValue = new Animated.Value(0);
  }

  componentDidMount() {
    this.expand();
  }

  storeData = async (userDetails) => {
    try {
      await AsyncStorage.setItem('@userDetails', JSON.stringify(userDetails));
    } catch (e) {}
  };

  expand = async () => {
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 500,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
    const value = await AsyncStorage.getItem('@userDetails');
    if (value !== null) {
      console.log(value);
      const userDetails = JSON.parse(value);
      if (userDetails) {
        const setUser = this.props.setUserData;
        setUser(userDetails);
        if (userDetails.userType === 'admin') {
          this.props.navigation.navigate('AdminHome');
        } else if (userDetails.userType === 'receiver') {
          this.props.navigation.navigate('ReceiverHome');
        } else {
          this.props.navigation.navigate('DonorHome');
        }
      }
    } else {
      setTimeout(() => {
        Animated.timing(this.state.opacity, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }).start();
      }, 1000);
    }
  };

  onButtonPress() {
    Keyboard.dismiss();
    this.setState({
      loading: true,
    });
    if (this.state.email.endsWith('.org')) {
      console.log('here');
      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((doc) => {
          console.log(doc);
          firestore()
            .collection('Users')
            .get()
            .then((doc) => {
              doc.forEach((user) => {
                if (
                  user.data().email === this.state.email &&
                  user.data().password === this.state.password &&
                  user.data().userType === 'admin'
                ) {
                  let userDetails = {
                    id: user.data().id,
                    firstName: user.data().firstName,
                    lastName: user.data().lastName,
                    email: user.data().email,
                    phoneNo: user.data().phoneNo,
                    userType: user.data().userType,
                    ratings: user.data().ratings,
                    dob: user.data().dob,
                    address: user.data().address,
                    city: user.data().city,
                    image: user.data().image,
                    designation: user.data().designation,
                  };
                  const setUser = this.props.setUserData;
                  setUser(userDetails);
                  this.storeData(this.props.userDetails);
                  this.props.navigation.navigate('AdminHome');
                }
              });
              this.setState({
                loading: false,
                email: '',
                password: '',
              });
            });
        })
        .catch(() => {
          this.setState({
            loading: false,
            email: '',
            password: '',
          });
          alert('Invalid email or password.');
        });
    } else {
      auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then((doc) => {
          console.log(doc);
          if (doc.user.emailVerified) {
            firestore()
              .collection('Users')
              .get()
              .then((doc) => {
                doc.forEach((user) => {
                  if (user.data().blocked) {
                    alert('Your account has been blocked by admin.');
                  } else {
                    if (
                      user.data().email === this.state.email &&
                      user.data().userType === 'donor'
                    ) {
                      let userDetails = {
                        id: user.id,
                        firstName: user.data().firstName,
                        lastName: user.data().lastName,
                        email: user.data().email,
                        phoneNo: user.data().phoneNo,
                        userType: user.data().userType,
                        ratings: user.data().ratings,
                        dob: user.data().dob,
                        address: user.data().address,
                        city: user.data().city,
                        image: user.data().image,
                        weight: user.data().weight,
                        lastDonated: user.data().lastDonated,
                        bloodGroup: user.data().bloodGroup,
                        disease: user.data().disease,
                      };
                      const setUser = this.props.setUserData;
                      setUser(userDetails);
                      // const userDetails = this.props.userDetails;
                      this.storeData(this.props.userDetails);
                      if (userDetails.userType === 'receiver') {
                        this.props.navigation.navigate('ReceiverHome');
                      } else {
                        this.props.navigation.navigate('DonorHome');
                      }
                    } else if (user.data().email === this.state.email) {
                      let userDetails = {
                        id: user.id,
                        firstName: user.data().firstName,
                        lastName: user.data().lastName,
                        email: user.data().email,
                        phoneNo: user.data().phoneNo,
                        userType: user.data().userType,
                        ratings: user.data().ratings,
                        dob: user.data().dob,
                        address: user.data().address,
                        city: user.data().city,
                        image: user.data().image,
                      };
                      const setUser = this.props.setUserData;
                      setUser(userDetails);
                      // const userDetails = this.props.userDetails;
                      this.storeData(this.props.userDetails);
                      if (userDetails.userType === 'receiver') {
                        this.props.navigation.navigate('ReceiverHome');
                      } else {
                        this.props.navigation.navigate('DonorHome');
                      }
                    }
                  }
                });
                this.setState({
                  loading: false,
                  email: '',
                  password: '',
                });
              });
          } else {
            this.setState({
              loading: false,
              email: '',
              password: '',
            });
            alert('Email not verified.');
          }
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            loading: false,
            email: '',
            password: '',
          });
          alert('Invalid email or password.');
        });
    }
  }

  render() {
    const imageScale = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.4, 1.3],
    });
    let transformStyle = {...styles.logo, transform: [{scale: imageScale}]};
    return (
      <KeyboardAvoidingView style={styles.container}>
        <Animated.Image
          source={require('../../assets/img/logo.jpeg')}
          style={transformStyle}
        />
        <Animated.View
          {...this.props}
          style={[
            {
              opacity: this.state.opacity,
              transform: [
                {
                  scale: this.state.opacity.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.85, 1],
                  }),
                },
              ],
            },
            styles.form,
          ]}>
          <TextInput
            label="Email"
            mode="outlined"
            style={{
              height: 40,
              width: '90%',
            }}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={this.state.email}
            onChangeText={(email) => this.setState({email})}
          />
          <View style={styles.searchSection}>
            <TextInput
              label="Password"
              mode="outlined"
              style={{
                height: 40,
                width: '90%',
              }}
              theme={{
                colors: {
                  primary: this.state.passwordMatch ? 'green' : '#ff5d5b',
                  underlineColor: 'black',
                },
              }}
              selectionColor={this.state.passwordMatch ? 'green' : '#ff5d5b'}
              underlineColor={this.state.passwordMatch ? 'green' : '#ff5d5b'}
              value={this.state.password}
              secureTextEntry={this.state.showPassword}
              onChangeText={(password) => this.setState({password})}
            />
<TouchableOpacity style={{position: 'absolute', top: 7, right: 5, zIndex: 1000 }} onPress={() => this.setState({ showPassword: !this.state.showPassword })}>
            <EntypoIcon
              style={styles.searchIcon}
              name="eye"
              size={30}
              color="#000"
            />
            </TouchableOpacity>
          </View>
          <View style={{paddingTop: 10}}>
            <TouchableOpacity
              style={
                this.state.loading
                  ? styles.buttonLoadingStyle
                  : styles.buttonStyle
              }
              disabled={this.state.loading}
              onPress={() => this.onButtonPress()}>
              {this.state.loading ? (
                <ActivityIndicator size="small" color="#ff5d5b" />
              ) : (
                <Text style={styles.textStyle}>{'login'.toUpperCase()}</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{paddingTop: 10}}
            onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={{color: '#ff5d5b'}}>Don't have an account?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{paddingTop: 10}}
            onPress={() => this.props.navigation.navigate('ForgotPassword')}>
            <Text style={{color: '#ff5d5b'}}>Forgot Password?</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
  },
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 230,
  },
  background: {
    width: '90%',
    height: '100%',
  },
  form: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    paddingHorizontal: '10%',
    marginTop: '15%',
  },
  buttonStyle: {
    backgroundColor: '#ff5d5b',
    height: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonLoadingStyle: {
    backgroundColor: '#ffffff',
    height: 30,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  textStyle: {
    color: 'white',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchIcon: {
    padding: 5,
  },
});

export default connect(
  userDetailsAction.mapStateToProps,
  userDetailsAction.mapDispatchToProps,
)(Login);

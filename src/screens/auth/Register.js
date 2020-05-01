import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import DatePicker from 'react-native-datepicker';

export default class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            phoneNo: '',
            address: '',
            password: '',
            dob: '',
            error: '',
            loading: false
        }
    }

    componentDidMount() {

    }

    onButtonPress() {
        if (this.state.firstName === '') {
            alert('First Name field should not be empty.')
        } else if (this.state.lastName === '') {
            alert('Last Name field should not be empty.')
        } else if (this.state.email === '') {
            alert('Email field should not be empty.')
        } else if (this.state.phoneNo === '') {
            alert('Phone Number field should not be empty.')
        } else if (this.state.password === '') {
            alert('Password field should not be empty.')
        } else {
            this.setState({
                loading: true
            })
        }
    }

    render() {
        const { container } = styles;
        return (
            <KeyboardAvoidingView style={container}>
                <ImageBackground source={require('../../assets/img/logo.jpeg')} style={{ width: 200, height: (Platform.OS === "ios") ? 200 : 170 }} />
                {/* <Text style={{
                    fontSize: (Platform.OS === "ios") ? 30 : 25,
                    fontWeight: '900',
                    color: '#ff5d5b'
                }}>PARAMEDIC</Text> */}
                <View style={{ flexDirection: 'row', }}>
                    <TextInput
                        label='First Name'
                        mode='outlined'
                        style={{
                            height: 40,
                            width: '39%',
                        }}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={this.state.firstName}
                        onChangeText={firstName => this.setState({ firstName })}
                    />
                    <TextInput
                        label='Last Name'
                        mode='outlined'
                        style={{
                            height: 40,
                            width: '39%',
                            marginLeft: '2%'
                        }}
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        selectionColor='#ff5d5b'
                        underlineColor='#ff5d5b'
                        value={this.state.lastName}
                        onChangeText={lastName => this.setState({ lastName })}
                    /></View>
                <TextInput
                    label='Email'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',
                    }}
                    theme={{
                        colors: { primary: '#ff5d5b', underlineColor: 'black' }
                    }}
                    selectionColor='#ff5d5b'
                    underlineColor='#ff5d5b'
                    value={this.state.email}
                    onChangeText={email => this.setState({ email })}
                />
                <TextInput
                    label='Phone No.'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',
                    }}
                    theme={{
                        colors: { primary: '#ff5d5b', underlineColor: 'black' }
                    }}
                    selectionColor='#ff5d5b'
                    underlineColor='#ff5d5b'
                    keyboardType='phone-pad'
                    value={this.state.phoneNo}
                    onChangeText={phoneNo => this.setState({ phoneNo })}

                />
                <DatePicker
                  style={{ width: '80%', marginTop: 5 }}
                  date={this.state.dob}
                  mode="date"
                  format="YYYY-MM-DD"
                  minDate="1947-01-01"
                  maxDate="2020-05-21"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 4,
                      marginLeft: 0,
                      bottom: 2
                    },
                    dateInput: {
                      marginLeft: 36,
                      borderWidth: 0                     
                    }
                  }}
                  onDateChange={(dob) => { this.setState({ dob: dob }) }}
                >
                </DatePicker>
                <TextInput
                    label='Address'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',
                    }}
                    theme={{
                        colors: { primary: '#ff5d5b', underlineColor: 'black' }
                    }}
                    selectionColor='#ff5d5b'
                    underlineColor='#ff5d5b'
                    value={this.state.address}
                    onChangeText={address => this.setState({ address })}
                    multiline                    
                />
                <TextInput
                    label='Password'
                    mode='outlined'
                    style={{
                        height: 40,
                        width: '80%',
                    }}
                    theme={{
                        colors: { primary: '#ff5d5b', underlineColor: 'black' }
                    }}
                    selectionColor='#ff5d5b'
                    underlineColor='#ff5d5b'
                    value={this.state.password}
                    secureTextEntry
                    onChangeText={password => this.setState({ password })}
                />
                <View style={{ paddingTop: 10 }}>
                    {/* <Text style={{ 
                        color: 'red', 
                        alignSelf: 'center', 
                        fontSize: 18 }}>
                        {this.state.error}
                    </Text> */}
                    <Button
                        theme={{
                            colors: { primary: '#ff5d5b', underlineColor: 'black' }
                        }}
                        mode='contained'
                        onPress={() => this.onButtonPress()}
                    >                        
                    {(this.state.loading) ?
                            <ActivityIndicator size="small" /> :
                            <Text style={styles.textStyle}>
                                Register
                            </Text>
                        }
                    </Button>
                </View>
                <TouchableOpacity
                    style={{ paddingTop: (Platform.OS === "ios") ? 10 : 5 }}
                    onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={{ color: '#ff5d5b' }}>
                        Already have an account?
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
    },
    textStyle: {
        color: 'white'
    }
})
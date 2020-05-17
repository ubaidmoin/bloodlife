import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import TextInputMask from 'react-native-text-input-mask';
import DatePicker from 'react-native-datepicker';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import * as Validations from '../../settings/Validations';

export default class ForgotPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: 'tanwer.ubaid@gmail.com',
            error: '',
            loading: false
        }
        // this.ref = firebase.firestore().collection('Users');     
    }

    componentDidMount() {
    }

    async onButtonPress() {
        const { email } = this.state;
        if (email === '') {
            alert('Email field should not be empty.')
        } else if (!Validations.verifyEmail(email)) {
            alert('Email is invalid.')
        } else {
            this.setState({
                loading: true
            })

            auth().sendPasswordResetEmail(email)
                .then(() => {
                    this.setState({
                        loading: false
                    })
                    alert('Reset link sent to your email.')
                })
                .catch(() => {
                    this.setState({
                        loading: false
                    })
                    alert('User does not exists.')
                });
        }
    }


    render() {
        const { container } = styles;
        return (
            <KeyboardAvoidingView style={container}>
                <ImageBackground source={require('../../assets/img/logo.jpeg')} style={{ width: 200, height: (Platform.OS === "ios") ? 200 : 170 }} />
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
                <Text style={{ color: '#ff5d5b', }}>
                        Password reset link will be sent to your email.
                    </Text>
                <View style={{ paddingTop: 10 }}>                    
                    <TouchableOpacity
                        style={(this.state.loading) ? styles.buttonLoadingStyle : styles.buttonStyle}
                        disabled={this.state.loading}
                        onPress={() => this.onButtonPress()}
                    >
                        {(this.state.loading) ?
                            <ActivityIndicator size="small" color="#ff5d5b" /> :
                            <Text style={styles.textStyle}>
                                Send
                            </Text>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ paddingTop: 10 }}
                        onPress={() => this.props.navigation.navigate('Login')}>
                        <Text style={{ color: '#ff5d5b', alignSelf: 'center' }}>
                            Back to login.
                    </Text>
                    </TouchableOpacity>
                </View>
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
    },
    buttonStyle: {
        backgroundColor: '#ff5d5b',
        height: 30,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#fea39e',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    buttonLoadingStyle: {
        backgroundColor: '#ffffff',
        height: 30,
        paddingHorizontal: 20,
        borderWidth: 1,
        borderColor: '#fea39e',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
})
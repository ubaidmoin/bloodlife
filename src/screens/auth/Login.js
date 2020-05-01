import React, { Component } from 'react';
import { View, Text, Animated, StyleSheet, Easing, TouchableOpacity, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            opacity: new Animated.Value(0),
            email: '',
            password: '',
            error: '',
            loading: false
        };
        this.animatedValue = new Animated.Value(0);
    }

    componentDidMount() {
        this.expand();
    }

    expand = () => {
        Animated.timing(this.animatedValue, {
            toValue: 1,
            duration: 500,
            easing: Easing.bounce,
            useNativeDriver: true
        }).start();
        setTimeout(() => {
            Animated.timing(this.state.opacity, {
                toValue: 1,
                duration: 500,
                easing: Easing.ease,
                useNativeDriver: true
            }).start();
        }, 1000);
    }

    onButtonPress() {
        // this.setState({
        //     loading: true
        // })
        const userDetails = this.props.userDetails;
        console.log(userDetails);
        if (userDetails.userType === 'Receiver') {
            this.props.navigation.navigate('ReceiverHome');
        } else {
            this.props.navigation.navigate('DonorHome');
        }
    }

    render() {
        const imageScale = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.4, 1.3],
        })
        let transformStyle = { ...styles.logo, transform: [{ scale: imageScale }] };
        return (
            <KeyboardAvoidingView style={styles.container}>
                <Animated.Image source={require('../../assets/img/logo.jpeg')} style={transformStyle} />
                <Animated.View {...this.props}
                    style={[
                        {
                            opacity: this.state.opacity,
                            transform: [
                                {
                                    scale: this.state.opacity.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [0.85, 1],
                                    })
                                },
                            ],
                        },
                        styles.form
                    ]}>
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
                        <TouchableOpacity
                            style={(this.state.loading) ? styles.buttonLoadingStyle : styles.buttonStyle}
                            disabled={this.state.loading}
                            onPress={() => this.onButtonPress()}
                        >
                            {(this.state.loading) ?
                                <ActivityIndicator size="small" /> :
                                <Text style={styles.textStyle}>
                                    {'login'.toUpperCase()}
                                </Text>
                            }
                        </TouchableOpacity>

                    </View>
                    <TouchableOpacity
                        style={{ paddingTop: 10 }}
                        onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={{ color: '#ff5d5b' }}>
                            Don't have an account?
                    </Text>
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
        backgroundColor: '#f7f7f7'
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
        marginTop: '15%'
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
    textStyle: {
        color: 'white'
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(Login);
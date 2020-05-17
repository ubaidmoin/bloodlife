import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator, ImageBackground, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class Feedback extends Component {

    constructor(props) {
        super(props);
        this.state = {
            feedback: '',
            userDetails: props.userDetails,
            error: '',
            loading: false
        }
        // this.ref = firebase.firestore().collection('Users');     
    }

    componentDidMount() {
    }

    async generateFeedbackId() {
        let id = 100;
        let response = await firestore()
            .collection('Feedbacks')
            .orderBy('id', 'desc').limit(1).get().then(snapshot => {
                snapshot.forEach(element => {
                    id = parseInt(element.data().id.split('-')[1])
                })
                return id = id + 1;
            });
        return "FD-" + response;
    }

    addFeedback = (id) => new Promise((resolve, reject) => {
        const { userDetails, feedback } = this.state;
        firestore().collection('Feedbacks').doc(id).set({
            id: id,
            name: userDetails.firstName + ' ' + userDetails.lastName,
            date: new Date().toDateString(),
            feedback: feedback,
            image: userDetails.image
        }).then((docRef) => {
            resolve(true);
            alert('Feedbacks successfully sent.')
        }).catch((error) => {
            reject(false);
            this.setState({
                loading: false
            })
            alert('An error occured.')
        });
    })

    async onAddFeedback() {        
        if (this.state.feedback !== '') {
            this.setState({
                loading: true
            })
            let id = await this.generateFeedbackId();
            this.addFeedback(id);
            this.setState({
                loading: false,            
            })
        } else {
            alert('Enter message as feedback.')
        }
    }

    render() {
        const { container } = styles;
        return (
            <KeyboardAvoidingView style={container}>
                <ImageBackground source={require('../../assets/img/logo.jpeg')} style={{ width: 200, height: (Platform.OS === "ios") ? 200 : 170 }} />
                <TextInput
                    label='Feedback'
                    mode='outlined'
                    style={{
                        width: '80%',
                    }}
                    theme={{
                        colors: { primary: '#ff5d5b', underlineColor: 'black' }
                    }}
                    selectionColor='#ff5d5b'
                    underlineColor='#ff5d5b'
                    value={this.state.feedback}
                    onChangeText={feedback => this.setState({ feedback })}
                    multiline
                />                
                <View style={{ paddingTop: 10 }}>                    
                    <TouchableOpacity
                        style={(this.state.loading) ? styles.buttonLoadingStyle : styles.buttonStyle}
                        disabled={this.state.loading}
                        onPress={() => this.onAddFeedback()}
                    >
                        {(this.state.loading) ?
                            <ActivityIndicator size="small" color="#ff5d5b" /> :
                            <Text style={styles.textStyle}>
                                Send
                            </Text>
                        }
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

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(Feedback);
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, FlatList, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class History extends Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [],
            loading: false,
            userDetails: props.userDetails,            
        };
    }

    componentDidMount() {
        this.getHistory();
    }

    getHistory() {
        firestore().collection('Requests').get().then(request => {
            let history = [];
            request.forEach(r => {
                if (this.state.userDetails.userType === "receiver") {
                    if (r.data().receiverId === this.state.userDetails.id) {                        
                        let id = r.data().donorId;
                        firestore().collection('Users').doc(id).get().then(donor => {                            
                            history.push({
                                id: r.id,
                                name: donor.data().firstName + ' ' + donor.data().lastName,                                
                                image: donor.data().image,
                                ratings: donor.data().ratings,
                                bloodGroup: r.data().bloodGroup,
                                address: donor.data().address,
                                phoneNo: donor.data().phoneNo,
                                date: r.data().date,
                                numberOfBottles: r.data().numberOfBottles
                            })
                            this.setState({
                                history
                            })
                        })
                    }
                } else {
                    if (r.data().donorId === this.state.userDetails.id) {                        
                        let id = r.data().receiverId;
                        firestore().collection('Users').doc(id).get().then(donor => {                            
                            history.push({
                                id: r.id,                                
                                name: donor.data().firstName + ' ' + donor.data().lastName,                                
                                image: donor.data().image,
                                ratings: donor.data().ratings, 
                                bloodGroup: r.data().bloodGroup,
                                address: donor.data().address,
                                phoneNo: donor.data().phoneNo,    
                                numberOfBottles: r.data().numberOfBottles                           
                            })
                            this.setState({
                                history
                            })
                        })
                    }
                }
            })
        })
    }

    async generateComplaintId() {
        let id = 100;
        let response = await firestore()
            .collection('Complaints')
            .orderBy('id', 'desc').limit(1).get().then(snapshot => {
                snapshot.forEach(element => {
                    id = parseInt(element.data().id.split('-')[1])
                })
                return id = id + 1;
            });
        return "COMPLAINT-" + response;
    }

    async submitComplaint(index) {
        let data = [...this.state.history]
        let item = data[index]
        let id = await this.generateComplaintId();
        this.setState({
            loading: true
        })
        firestore().collection('Complaints').doc(id).set({
            id: id,
            receiverId: this.state.userDetails.id,
            donorId: item.id,
            donorName: item.name,            
            date: item.date,
            bloodGroup: item.type,
            description: item.description,
            numberOfBottles: item.numberOfBottles,
            donorAddress: item.address,
            receiverAddress: this.state.userDetails.address,
            by: this.state.userDetails.userType

        }).then((docRef) => {
            this.setState({
                loading: false
            })
            alert('Complaint successfully submitted.')
        }).catch((error) => {
            this.setState({
                loading: false
            })
            alert('An error occured.')
        });
    }

    handleTextChange(index, value) {
        let data = [...this.state.history]
        let item = data[index]
        item.description = value;
        data[index] = item;
        this.setState({ history: data })
    }

    showDescription(index) {
        let data = [...this.state.history]
        let item = data[index]
        item.showDescription = !item.showDescription
        data.forEach(element => {
            if (element.id !== item.id) {
                element.showDescription = false
            }
        })
        this.setState({ history: data })
    }

    renderHistory(item, index) {
        const { image, title, historyTitleContainer, list, type, typeContainer, buttonStyle, textStyle, loadingButtonStyle, imageStyle } = styles;
        return (
            <View style={list}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={(item.image === '') ?
                        require('../../assets/img/user.jpg') :
                        { uri: 'data:image/jpeg;base64,' + item.image }} style={imageStyle} />
                    <View>
                        <View style={{ marginLeft: 5 }}>
                        <Text style={title}>{item.name}</Text>
                        <Text style={type}>Phone Number: {item.phoneNo}</Text>
                        <Text style={type}>Date: {item.date}</Text>     
                        <Text style={type}>Blood Group: {item.bloodGroup}</Text>
                        <Text style={type}>Number of Bottles: {item.numberOfBottles}</Text>                                           
                        <Text style={type}>Address: {item.address}</Text>
                        {/* <Text style={title}>{item.date}</Text> */}
                            {/* <View style={styles.ratings}>
                                <Text style={styles.textStyle}>{item.ratings}</Text>
                                <FontAwesomeIcon
                                    name="star"
                                    size={15}
                                    color={"#000"}
                                />
                            </View> */}
                        </View>
                        {<TouchableOpacity
                            style={buttonStyle}
                            onPress={() => this.showDescription(index)}
                        >
                            <Text style={textStyle}>
                                {(item.showDescription) ? 'cancel'.toUpperCase() : 'complain'.toUpperCase()}
                            </Text>
                        </TouchableOpacity>}
                    </View>

                    {/* <View style={historyTitleContainer}>
                        <Text style={title}>{item.name}</Text>
                    </View> */}
                </View>
                {(item.showDescription === true) ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5, marginTop: -1, backgroundColor: 'white', borderRadius: 5 }}>
                        <View style={{ width: '100%' }}>
                            <TextInput
                                label='Description'
                                mode='outlined'
                                style={{
                                    height: 40,
                                    width: '100%',
                                }}
                                theme={{
                                    colors: { primary: '#ff5d5b', underlineColor: 'black' }
                                }}
                                selectionColor='#ff5d5b'
                                underlineColor='#ff5d5b'
                                value={item.description}
                                onChangeText={description => this.handleTextChange(index, description)}
                            />
                            <TouchableOpacity
                                style={(this.state.loading) ? loadingButtonStyle : buttonStyle}
                                onPress={() => this.submitComplaint(index)}
                            >
                                {(this.state.loading) ?
                                    <ActivityIndicator size="small" color="#ff5d5b" /> :
                                    <Text style={textStyle}>
                                        {'submit'.toUpperCase()}
                                    </Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View> :
                    null
                }
            </View>
        );
    }

    render() {
        const { container } = styles;
        const { history } = this.state;
        return (
            <View style={container}>
                <FlatList
                    data={history}
                    keyExtractor={history => history.id}
                    renderItem={({ item, index }) => this.renderHistory(item, index)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    list: {
        width: Dimensions.get('screen').width * .9,
        padding: 10,
        marginVertical: 10,
        marginHorizontal: Dimensions.get('screen').width * .05,
        backgroundColor: '#fff',
        elevation: 1000,
        borderRadius: 5
    },
    image: {
        width: '100%',
        height: 130,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    historyTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5
    },
    type: {
        fontSize: 15
    },
    typeContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    buttonStyle: {
        backgroundColor: '#ff5d5b',
        height: 25,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#fea39e',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginVertical: 5
    },
    loadingButtonStyle: {
        backgroundColor: '#fff',
        height: 25,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#fea39e',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginVertical: 5
    },
    textStyle: {
        color: 'white'
    },
    ratings: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageStyle: {
        width: 80,
        height: 80,
        borderRadius: 40
    }
})

export default connect(userDetailsAction.mapStateToProps, userDetailsAction.mapDispatchToProps)(History);
import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import firestore from '@react-native-firebase/firestore';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class DonateNow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
  }

  componentDidMount() {
    firestore()
      .collection('DonationOptions')
      .onSnapshot((snapshot) => {
        let options = [];
        snapshot.forEach((option) => {
          options.push({
            id: option.id,
            type: option.data().type,
            bank: option.data().bank,
            title: option.data().title,
            accNo: option.data().accNo,
          });
        });
        this.setState({
          options,
        });
      });
  }

  renderOptions(item, index) {
    const {
      event,
      image,
      eventTitle,
      eventName,
      eventDate,
      buttonStyle,
      textStyle,
    } = styles;
    return (
      <View style={event} key={index}>
        <View style={{borderBottomWidth: 1, paddingBottom: 5}}>
          <Text style={eventName}>{item.title}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 5,
          }}>
          <Text style={textStyle}>{'Bank Name:'}</Text>
          <Text style={textStyle}>{item.bank}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={textStyle}>{'Account Title:'}</Text>
          <Text style={textStyle}>{item.title}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={textStyle}>{'Account Number:'}</Text>
          <Text style={textStyle}>{item.accNo}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {container} = styles;
    const {options} = this.state;
    return (
      <View style={container}>
        <FlatList
          data={options}
          keyExtractor={(option) => option.type}
          renderItem={({item, index}) => this.renderOptions(item, index)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  event: {
    width: Dimensions.get('screen').width * 0.9,
    marginHorizontal: Dimensions.get('screen').width * 0.05,
    marginVertical: 10,
    elevation: 1000,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 100,
  },
  eventTitle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  eventName: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  textStyle: {
    fontSize: 15,
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
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
  },
});

export default connect(
  userDetailsAction.mapStateToProps,
  userDetailsAction.mapDispatchToProps,
)(DonateNow);

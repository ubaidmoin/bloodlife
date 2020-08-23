import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import firestore from '@react-native-firebase/firestore';
import {TextInput} from 'react-native-paper';

class Receivers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      receivers: [],
      filter: '',
      searchReceivers: [],
    };
  }

  componentDidMount() {
    this.getReceivers();
  }

  filterData(data, text) {
    const filteredData = data.filter((item) => {
      const itemData = `${item.firstName.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    return filteredData;
  }

  filterDataId(data, text) {
    const filteredData = data.filter((item) => {
      const itemData = `${item.id.toUpperCase()}`;
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    return filteredData;
  }

  filterContacts(text) {
    if (text.startsWith('BL')) {
      const filteredData = this.filterDataId(this.state.searchReceivers, text);
      this.setState({
        filter: text,
        receivers: filteredData,
      });
    } else {
      const filteredData = this.filterData(this.state.searchReceivers, text);
      this.setState({
        filter: text,
        receivers: filteredData,
      });
    }
  }

  getReceivers() {
    firestore()
      .collection('Users')
      .onSnapshot((snapshot) => {
        let receivers = [];
        let totalReceived;
        snapshot.forEach((user) => {
          if (user.data().userType === 'receiver') {
            firestore()
              .collection('Requests')
              .get()
              .then((doc) => {
                totalReceived = 0;
                doc.forEach((item) => {
                  if (item.data().receiverId === user.id) {
                    console.log(item.data().receiverId, user.id);
                    totalReceived = totalReceived + 1;
                  }
                });
                console.log(user.data().firstName + ' ' + totalReceived);
                receivers.push({
                  id: user.id,
                  firstName: user.data().firstName,
                  lastName: user.data().lastName,
                  email: user.data().email,
                  phoneNo: user.data().phoneNo,
                  userType: user.data().userType,
                  ratings: user.data().ratings,
                  dob: user.data().dob,
                  address: user.data().address,
                  image: user.data().image,
                  blocked: user.data().blocked,
                  totalReceived: totalReceived,
                });
                this.setState({
                  receivers: receivers,
                  searchReceivers: receivers,
                });
              });
          }
        });
      });
  }

  showDescription(index) {
    let data = [...this.state.receivers];
    let item = data[index];
    item.showDescription = !item.showDescription;
    data.forEach((element) => {
      if (element.id !== item.id) {
        element.showDescription = false;
      }
    });
    this.setState({receivers: data});
  }

  blockUser(index) {
    let data = [...this.state.receivers];
    let item = data[index];
    firestore()
      .collection('Users')
      .doc(item.id)
      .get()
      .then((querySnapshot) => {
        firestore()
          .collection('Users')
          .doc(querySnapshot.data().id)
          .update({
            blocked: item.blocked ? false : true,
          })
          .then(() => {
            alert(item.blocked ? 'User unblocked.' : 'User blocked.');
            this.getReceivers();
          });
      });
  }

  renderReceivers() {
    const {
      image,
      title,
      historyTitleContainer,
      list,
      type,
      typeContainer,
      blockedTextStyle,
      blockButtonStyle,
    } = styles;
    return (
      <FlatList
        data={this.state.receivers}
        keyExtractor={(item) => item.id + ''}
        renderItem={({item, index}) => (
          <View key={index}>
            <View style={list}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={
                    item.image === ''
                      ? require('../../assets/img/user.jpg')
                      : {uri: 'data:image/jpeg;base64,' + item.image}
                  }
                  style={image}
                />
                <View style={{marginLeft: 5}}>
                  <Text
                    style={{fontWeight: 'bold', fontSize: 12, color: '#fff'}}>
                    {item.id}
                  </Text>
                  <Text style={title}>
                    {item.firstName + ' ' + item.lastName}
                  </Text>
                  <View style={styles.ratings}>
                    <Text style={styles.textStyle}>
                      {item.ratings.toFixed(2)}
                    </Text>
                    <FontAwesomeIcon name="star" size={15} color={'#fff'} />
                  </View>
                </View>
              </View>
              <View style={{position: 'absolute', right: 20, top: 45}}>
                <TouchableOpacity
                  onPress={() => this.showDescription(index)}
                  style={{justifyContent: 'center', alignItems: 'center'}}>
                  <AntDesignIcon
                    name={
                      item.showDescription !== true ? 'downcircle' : 'upcircle'
                    }
                    size={20}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {item.showDescription === true ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: Dimensions.get('screen').width * 0.05,
                  paddingBottom: 10,
                  marginTop: -15,
                  backgroundColor: '#ff5d5b',
                  borderRadius: 5,
                }}>
                <View style={{width: '100%'}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 20,
                    }}>
                    <Text
                      style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                      Email:
                    </Text>
                    <Text style={{fontSize: 15, color: '#fff'}}>
                      {item.email}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 20,
                    }}>
                    <Text
                      style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                      Phone Number:
                    </Text>
                    <Text style={{fontSize: 15, color: '#fff'}}>
                      {item.phoneNo}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 20,
                    }}>
                    <Text
                      style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                      Total Requests Received:
                    </Text>
                    <Text style={{fontSize: 15, color: '#fff'}}>
                      {item.totalReceived}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      paddingHorizontal: 20,
                    }}>
                    <Text
                      style={{fontSize: 15, fontWeight: 'bold', color: '#fff'}}>
                      Address:
                    </Text>
                    <Text style={{fontSize: 15, color: '#fff', width: Dimensions.get('window').width * 0.67}}>
                      {item.address}
                    </Text>
                  </View>
                  <View style={{paddingHorizontal: '30%'}}>
                    <TouchableOpacity
                      style={blockButtonStyle}
                      onPress={() => this.blockUser(index)}>
                      <Text style={blockedTextStyle}>
                        {item.blocked
                          ? 'unblock'.toUpperCase()
                          : 'block'.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ) : null}
          </View>
        )}
      />
    );
  }

  render() {
    const {search} = styles;
    return (
      <View style={{width: '100%', height: '100%', backgroundColor: '#fff'}}>
        <View style={search}>
          <TextInput
            label="Search"
            mode="outlined"
            style={{
              height: 40,
              width: '100%',
            }}
            theme={{
              colors: {primary: '#ff5d5b', underlineColor: 'black'},
            }}
            selectionColor="#ff5d5b"
            underlineColor="#ff5d5b"
            value={this.state.filter}
            onChangeText={(filter) => this.filterContacts(filter)}
          />
        </View>
        <View style={{paddingVertical: 20, marginBottom: 50}}>
          {this.renderReceivers()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: 'lightgrey',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: '80%',
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 5,
    marginLeft: 15,
    height: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '60%',
    borderRadius: 30,
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E1E1',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E1E1',
    marginRight: 10,
  },
  list: {
    width: Dimensions.get('screen').width * 0.9,
    padding: 10,
    marginVertical: 10,
    marginHorizontal: Dimensions.get('screen').width * 0.05,
    backgroundColor: '#ff5d5b',
    elevation: 1000,
    borderRadius: 5,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    width: Dimensions.get('window').width * .55,
  },
  historyTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
  },
  type: {
    fontSize: 15,
  },
  typeContainer: {
    paddingHorizontal: 5,
  },
  ratings: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  blockButtonStyle: {
    backgroundColor: '#ff5d5b',
    height: 25,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    marginVertical: 5,
  },
  blockedTextStyle: {
    color: 'white',
  },
  search: {
    width: Dimensions.get('screen').width,
    paddingHorizontal: Dimensions.get('screen').width * 0.05,
    paddingVertical: 10,
  },
});

export default Receivers;

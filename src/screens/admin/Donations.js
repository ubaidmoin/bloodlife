import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import {TextInput} from 'react-native-paper';
import TextInputMask from 'react-native-text-input-mask';
import Modal from 'react-native-modal';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import firestore from '@react-native-firebase/firestore';
import SegmentedControl from '@react-native-community/segmented-control';

import * as userDetailsAction from '../../actions/UserDetailsAction';

class Donation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: [
        {
          type: 'Bank Account',
          bank: 'Askari Bank',
          title: 'Ubaid Ullah',
          accNo: '4324213456643',
        },
        {
          type: 'Easy Paisa',
          bank: 'Easy Paisa',
          title: 'Ubaid Ullah',
          accNo: '03325320328',
        },
      ],
      type: '',
      bank: '',
      title: '',
      accNo: '',
      isModalVisible: false,
      loading: false,
      selectedIndex: 0,
      phoneNo: '',
      deleting: false,
      deleteID: -1,
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
            bank: option.data().bank,
            title: option.data().title,
            accNo: option.data().accNo,
            phoneNo: option.data().phoneNo,
          });
        });
        this.setState({
          options,
        });
      });
  }

  async generateOptionId() {
    let id = 100;
    let response = await firestore()
      .collection('DonationOptions')
      .orderBy('id', 'desc')
      .limit(1)
      .get()
      .then((snapshot) => {
        snapshot.forEach((element) => {
          id = parseInt(element.data().id.split('-')[1]);
        });
        return (id = id + 1);
      });
    return 'DO-' + response;
  }

  addOption = (id) =>
    new Promise((resolve, reject) => {
      const {title, bank, type, accNo, phoneNo} = this.state;

      if (bank === '') {
        this.state.selectedIndex === 0
          ? alert('Bank Name field could not be empty.')
          : alert('Account Title field could not be empty.');
      } else if (title === '' && this.state.selectedIndex === 0) {
        alert('Title field could not be empty.');
      } else if (accNo === '') {
        this.state.selectedIndex === 0
          ? alert('Account No. field could not be empty.')
          : alert('CNIC field could not be empty.');
      } else if (phoneNo === '') {
        alert('Phone No. field could not be empty.');
      } else {
        this.setState({
          loading: true,
        });
        firestore()
          .collection('DonationOptions')
          .doc(id)
          .set({
            id: id,
            title:
              this.state.selectedIndex === 0 ? 'Bank Account' : 'Other Account',
            bank: bank,
            accNo: accNo,
            phoneNo: phoneNo,
          })
          .then((docRef) => {
            resolve(true);
            this.setState({
              loading: false,
              isModalVisible: false,
            });
            alert('Option successfully added.');
          })
          .catch((error) => {
            reject(false);
            this.setState({
              loading: false,
              isModalVisible: false,
            });
            alert('An error occured.');
          });
      }
    });

  addNewOption() {
    this.setState({
      isModalVisible: true,
    });
  }

  async onAddOption() {
    let id = await this.generateOptionId();
    this.addOption(id);
  }

  removeDonationOptions(id) {
    this.setState({
      deleting: true,
      deleteID: id,
    });
    firestore()
      .collection('DonationOptions')
      .doc(id)
      .delete()
      .then(() => {
        this.setState({
          deleting: false,
          deleteID: -1,
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
      listTextStyle,
    } = styles;
    return (
      <View style={event} key={index}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            paddingBottom: 5,
          }}>
          <Text style={eventName}>{item.title}</Text>
          {this.state.deleting && this.state.deleteID === item.id ? (
            <ActivityIndicator size={'small'} color={'#ff5d5b'} />
          ) : (
            <TouchableOpacity
              onPress={() => this.removeDonationOptions(item.id)}>
              <Text style={{color: '#ff5d5b'}}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 5,
          }}>
          <Text style={listTextStyle}>
            {item.title === 'Bank Account'
              ? 'Bank Name:'
              : 'Other Account Name:'}
          </Text>
          <Text style={listTextStyle}>{item.bank}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={listTextStyle}>
            {item.title === 'Bank Account' ? 'Account Title:' : 'CNIC:'}
          </Text>
          <Text style={listTextStyle}>{item.accNo}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={listTextStyle}>{'Account Number:'}</Text>
          <Text style={listTextStyle}>{item.phoneNo}</Text>
        </View>
      </View>
    );
  }

  render() {
    const {
      container,
      buttonStyle,
      iconButtonStyle,
      modalButtonStyle,
      modalStyle,
      textStyle,
    } = styles;
    const {options, title, bank, type, accNo, loading, phoneNo} = this.state;
    return (
      <View style={container}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 25, color: '#ff5d5b'}}>
            Donation Options
          </Text>
          <TouchableOpacity
            style={iconButtonStyle}
            onPress={() => this.addNewOption()}>
            <EntypoIcon name="plus" size={20} color="white" />
            <Text style={textStyle}>Add Option</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={options}
          keyExtractor={(option) => option.type}
          renderItem={({item, index}) => this.renderOptions(item, index)}
        />
        <Modal
          isVisible={this.state.isModalVisible}
          style={styles.modalStyle}
          scrollHorizontal
          propagateSwipe
          swipeDirection={['down']}
          onSwipeComplete={() => this.setState({isModalVisible: false})}>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              height: '100%',
              justifyContent: 'center',
              marginTop: 30,
            }}>
            <SegmentedControl
              values={['Bank Account', 'Other Account']}
              selectedIndex={this.state.selectedIndex}
              onChange={(event) => {
                this.setState({
                  selectedIndex: event.nativeEvent.selectedSegmentIndex,
                });
              }}
            />
            <Text style={{fontSize: 25, fontWeight: 'bold', color: '#ff5d5b'}}>
              Option Details
            </Text>
            <TextInput
              label={
                this.state.selectedIndex === 0 ? 'Bank Name' : 'Account Title'
              }
              mode="outlined"
              style={{
                height: 40,
                width: '80%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={bank}
              onChangeText={(bank) => this.setState({bank})}
            />
            {this.state.selectedIndex === 0 && (
              <TextInput
                label={
                  this.state.selectedIndex === 0 ? 'Account Title' : 'CNIC'
                }
                mode="outlined"
                style={{
                  height: 40,
                  width: '80%',
                }}
                theme={{
                  colors: {primary: '#ff5d5b', underlineColor: 'black'},
                }}
                selectionColor="#ff5d5b"
                underlineColor="#ff5d5b"
                value={title}
                onChangeText={(title) => this.setState({title})}
              />
            )}
            {this.state.selectedIndex === 0 ? (
              <TextInput
                label={'Account No.'}
                mode="outlined"
                style={{
                  height: 40,
                  width: '80%',
                }}
                theme={{
                  colors: {primary: '#ff5d5b', underlineColor: 'black'},
                }}
                selectionColor="#ff5d5b"
                underlineColor="#ff5d5b"
                value={accNo}
                onChangeText={(accNo) => this.setState({accNo})}
                keyboardType="number-pad"
              />
            ) : (
              <TextInput
                label={'CNIC'}
                render={(props) => (
                  <TextInputMask {...props} mask="[00000]-[0000000]-[0]" />
                )}
                mode="outlined"
                style={{
                  height: 40,
                  width: '80%',
                }}
                theme={{
                  colors: {primary: '#ff5d5b', underlineColor: 'black'},
                }}
                selectionColor="#ff5d5b"
                underlineColor="#ff5d5b"
                value={accNo}
                onChangeText={(accNo) => this.setState({accNo})}
                keyboardType="number-pad"
              />
            )}
            <TextInput
              label={'Phone Number'}
              mode="outlined"
              render={(props) => (
                <TextInputMask {...props} mask="+92 ([000]) [000] [0000]" />
              )}
              style={{
                height: 40,
                width: '80%',
              }}
              theme={{
                colors: {primary: '#ff5d5b', underlineColor: 'black'},
              }}
              selectionColor="#ff5d5b"
              underlineColor="#ff5d5b"
              value={phoneNo}
              onChangeText={(phoneNo) => this.setState({phoneNo})}
              keyboardType="number-pad"
            />
            <View
              style={{
                width: Dimensions.get('screen').width * 0.9,
                marginHorizontal: Dimensions.get('screen').width * 0.05,
                marginVertical: 10,
                elevation: 1000,
                backgroundColor: '#ffffff',
                padding: 10,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={modalButtonStyle}
                onPress={() => this.onAddOption()}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <Text style={textStyle}>{'Add'.toUpperCase()}</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={modalButtonStyle}
                onPress={() =>
                  this.setState({
                    isModalVisible: false,
                  })
                }
                disabled={loading}>
                <Text style={textStyle}>{'cancel'.toUpperCase()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  iconButtonStyle: {
    backgroundColor: '#ff5d5b',
    height: 25,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    flexDirection: 'row',
  },
  textStyle: {
    color: 'white',
  },
  listTextStyle: {
    fontSize: 15,
  },
  modalStyle: {
    borderRadius: 10,
    marginVertical: Dimensions.get('screen').height * 0.02,
    width: '100%',
    marginLeft: 0,
    backgroundColor: 'white',
    // height: '100%'
  },
  modalButtonStyle: {
    backgroundColor: '#ff5d5b',
    height: 25,
    width: 100,
    borderWidth: 1,
    borderColor: '#fea39e',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
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
)(Donation);

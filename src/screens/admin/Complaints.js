import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

class Complaints extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      complaints: [],
    };
  }

  componentDidMount() {
    firestore()
      .collection('Complaints')
      .onSnapshot((snapshot) => {
        let complaints = [];
        snapshot.forEach((complaint) => {
          const today = moment(new Date(), 'DD-MM-YYYY');
          const complaintDate = moment(complaint.data().date);
          const days = today.diff(complaintDate, 'days');
          if (days > 30) {
            firestore().collection('Complaints').doc(complaint.id).delete();
          } else {
            complaints.push({
              id: complaint.id,
              donorId: complaint.data().donorId,
              receiverId: complaint.data().receiverId,
              donorName: complaint.data().donorName,
              receiverName: complaint.data().receiverName,
              bloodGroup: complaint.data().bloodGroup,
              description: complaint.data().description,
              date: complaint.data().date,
              numberOfBottles: complaint.data().numberOfBottles,
              donorAddress: complaint.data().donorAddress,
              receiverAddress: complaint.data().receiverAddress,
            });
          }
        });
        this.setState({
          complaints,
        });
      });
  }

  showDescription(index) {
    let data = [...this.state.complaints];
    let item = data[index];
    item.showDescription = !item.showDescription;
    data.forEach((element) => {
      if (element.id !== item.id) {
        element.showDescription = false;
      }
    });
    this.setState({complaints: data});
  }

  renderComplaints() {
    return (
      <FlatList
        data={this.state.complaints}
        keyExtractor={(item) => item.id + ''}
        renderItem={({item, index}) => (
          <View key={index}>
            <View
              style={{
                flexDirection: 'row',
                height: 80,
                alignItems: 'center',
                marginHorizontal: 20,
                marginVertical: 5,
                backgroundColor: 'white',
                borderRadius: 5,
                paddingBottom: 10,
              }}>
              <View style={{flexDirection: 'column', marginLeft: 10}}>
                <View
                  style={{
                    borderBottomWidth: 1,
                    borderColor: 'lightgrey',
                    flexDirection: 'row',
                    marginTop: 5,
                    justifyContent: 'space-between',
                    width: '85%',
                  }}>
                  <View style={{flexDirection: 'column'}}>
                    <Text style={{fontSize: 15, fontWeight: 'bold'}} />
                    <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                      {item.id}
                    </Text>
                  </View>
                  <View style={{paddingTop: 10}}>
                    <Text style={{fontSize: 13, fontWeight: 'bold'}}>
                      Blood Group {item.bloodGroup}
                    </Text>
                  </View>
                  {/* <Text style={{ fontSize: 13, fontWeight: 'bold', paddingTop: 10 }}>Complaint by: {item.by}</Text> */}
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
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {item.showDescription === true ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginHorizontal: 20,
                  marginBottom: 5,
                  marginTop: -10,
                  backgroundColor: 'white',
                  borderRadius: 5,
                }}>
                <View style={{marginLeft: 10, width: '100%'}}>
                  <Text
                    style={{fontSize: 13, fontWeight: 'bold', paddingTop: 10}}>
                    Receiver ID: {item.receiverId}
                  </Text>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Receiver Name: {item.receiverName}
                  </Text>
                  <Text style={{fontSize: 15, width: '95%'}}>
                    Receiver Address: {item.receiverAddress}
                  </Text>
                  <Text
                    style={{fontSize: 13, fontWeight: 'bold', paddingTop: 10}}>
                    Donor ID: {item.donorId}
                  </Text>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    Donor Name: {item.donorName}
                  </Text>
                  <Text style={{fontSize: 15, width: '95%'}}>
                    Donor Address: {item.donorAddress}
                  </Text>
                  <Text style={{fontSize: 15, width: '95%', paddingTop: 10}}>
                    Blood Group: {item.bloodGroup}
                  </Text>
                  <Text style={{fontSize: 15, width: '95%'}}>
                    Number of Bottles: {item.numberOfBottles}
                  </Text>
                  <Text style={{fontSize: 13, fontWeight: 'bold'}}>
                    Date: {item.date}
                  </Text>
                  <Text style={{fontSize: 15, width: '95%', paddingTop: 10}}>
                    Complaint Description: {item.description}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      />
    );
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%', backgroundColor: '#EBEFF3'}}>
        <View style={{marginTop: 20}}>{this.renderComplaints()}</View>
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
});

export default Complaints;

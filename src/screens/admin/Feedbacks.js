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
import moment from 'moment';

class Receivers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      feedbacks: [],
    };
  }

  componentDidMount() {
    firestore()
      .collection('Feedbacks')
      .onSnapshot((snapshot) => {
        let feedbacks = [];
        snapshot.forEach((feedback) => {
          const today = moment(new Date(), 'DD-MM-YYYY');
          const feedbackDate = moment(feedback.data().date);
          const days = today.diff(feedbackDate, 'days');
          if (days > 30) {
            firestore().collection('Feedbacks').doc(feedback.id).delete();
          } else {
            feedbacks.push({
              id: feedback.id,
              name: feedback.data().name,
              date: feedback.data().date,
              feedback: feedback.data().feedback,
              image: feedback.data().image,
            });
          }
        });
        this.setState({
          feedbacks,
        });
      });
  }

  renderFeedbacks() {
    const {
      image,
      title,
      historyTitleContainer,
      list,
      type,
      typeContainer,
    } = styles;
    return (
      <FlatList
        data={this.state.feedbacks}
        keyExtractor={(item) => item.id + ''}
        renderItem={({item, index}) => (
          <View key={index}>
            <View style={list}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{padding: 5, marginRight: 5}}>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>{index + 1}</Text>
                </View>
                <Image
                  source={
                    item.image === ''
                      ? require('../../assets/img/user.jpg')
                      : {uri: 'data:image/jpeg;base64,' + item.image}
                  }
                  style={image}
                />
                <View style={{marginLeft: 5}}>
                  <Text style={title}>{item.name}</Text>
                  <Text style={styles.textStyle}>{item.date}</Text>
                  <Text style={styles.textStyle1}>{item.feedback}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    );
  }

  render() {
    return (
      <View style={{width: '100%', height: '100%', backgroundColor: '#EBEFF3'}}>
        <View style={{marginTop: 20}}>{this.renderFeedbacks()}</View>
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
    backgroundColor: '#fff',
    elevation: 10,
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
    width: Dimensions.get('screen').width * 0.5,
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
    width: Dimensions.get('screen').width * 0.6,
  },
  textStyle1: {
    fontSize: 12,
    marginLeft: 5,
    width: Dimensions.get('screen').width * 0.53,
  },
});

export default Receivers;

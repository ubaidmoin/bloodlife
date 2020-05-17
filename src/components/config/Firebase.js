import firebase from 'react-native-firebase';
// import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCyKSpuyIK1Uc_etabdXDBk-XR7QzahtS0",
  authDomain: "bloodlifeapp.firebaseapp.com",
  databaseURL: "https://bloodlifeapp.firebaseio.com",
  projectId: "bloodlifeapp",
  storageBucket: "bloodlifeapp.appspot.com",
  messagingSenderId: "1003788297883",
  appId: "1:1003788297883:web:2c3687f1eba2b589c9c83e"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);  
}

export default firebase;
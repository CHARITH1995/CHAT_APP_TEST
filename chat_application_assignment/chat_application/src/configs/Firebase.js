import firebase from 'firebase'

const settings = {timestampsInSnapshots : true}

var firebaseConfig = {
    apiKey: "AIzaSyB4DBDecnHlyMvrPgZc41n_XZAJoUrAMik",
    authDomain: "chat-app-bd80c.firebaseapp.com",
    databaseURL: "https://chat-app-bd80c.firebaseio.com",
    projectId: "chat-app-bd80c",
    storageBucket: "chat-app-bd80c.appspot.com",
    messagingSenderId: "861288000077",
    appId: "1:861288000077:web:c6975d7498a59edb514a04",
    measurementId: "G-D8N1TM7QR0"
  };


  var fireDB = firebase.initializeApp( firebaseConfig );

  export default fireDB.database().ref();
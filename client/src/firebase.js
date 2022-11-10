import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyA3O007T4weQO_hg_WsplMRIIqIN97Oqiw",
    authDomain: "unam-payment-system.firebaseapp.com",
    projectId: "unam-payment-system",
    storageBucket: "unam-payment-system.appspot.com",
    messagingSenderId: "353337626016",
    appId: "1:353337626016:web:09dda82799794a757ee8c5",
    measurementId: "G-N1383CP82X"
  };
firebase.initializeApp(firebaseConfig);
var storage = firebase.storage();
export default storage;
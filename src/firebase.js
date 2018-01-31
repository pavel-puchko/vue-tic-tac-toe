import firebase from 'firebase'

const  firebaseApp = firebase.initializeApp({ 
  apiKey: "AIzaSyAxAECo_2oEBUImFFQsHt69FHuj3t6hMOU",
  authDomain: "vue-tic-tac-toe.firebaseapp.com",
  databaseURL: "https://vue-tic-tac-toe.firebaseio.com",
  projectId: "vue-tic-tac-toe",
  storageBucket: "",
  messagingSenderId: "415938804506"
});

export const db = firebaseApp.database()
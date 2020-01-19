import firebase from 'firebase'
import 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyD9HYaQ8Wl4S3qTRb_YwrBXf2Hw0v7JlSY",
    authDomain: "meditouch6095.firebaseapp.com",
    databaseURL: "https://meditouch6095.firebaseio.com",
    projectId: "meditouch6095",
    storageBucket: "meditouch6095.appspot.com",
    messagingSenderId: "481587491315",
    appId: "1:481587491315:web:56985a4d2aff7a23496286",
    measurementId: "G-LBKDJQPBZL"

}

const Firebase = firebase.initializeApp(firebaseConfig)

export default Firebase

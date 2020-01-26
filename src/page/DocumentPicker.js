// React native and others libraries imports
import React, { Component } from 'react';
import { Image, Dimensions, TouchableOpacity } from 'react-native';
import { View, Content, CardItem ,Icon, Card, Body, Container, Button,Left } from 'native-base';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import Firebase from '../Firebase/firebase';
import 'firebase/storage'
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer'
import Navbar from '../component/Navbar';
// import image from ''
// Our custom files and classes import

import Text from '../component/Text';
import { SearchBar } from 'react-native-elements';

export default class DocumentPickerFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      search: '',
      singleFile:''
    };
}
  componentDidMount() {
    console.log("props are category block", this.props)
    console.disableYellowBox = true;

    this.apiCall(this.props.userdata)
  }

  apiCall = async (userdata) =>{
      
    try {
        const res = await DocumentPicker.pick({
          type: [DocumentPicker.types.allFiles],
          //There can me more options as well
          // DocumentPicker.types.allFiles
          // DocumentPicker.types.images
          // DocumentPicker.types.plainText
          // DocumentPicker.types.audio
          // DocumentPicker.types.pdf
        });
        if(res){
          FileViewer.open(res.uri).then(()=>{
  
          })
        }
        //Printing the log realted to the file
        console.log('res : ' + JSON.stringify(res));
        console.log('URI : ' + res.uri);
        console.log('Type : ' + res.type);
        console.log('File Name : ' + res.name);
        console.log('File Size : ' + res.size);
        //Setting the state to show single file attributes
        this.setState({ singleFile: res, showfile:true, userdata: userdata });
      } catch (err) {
        //Handling any exception (If any)
        if (DocumentPicker.isCancel(err)) {
          //If user canceled the document selection
          alert('Canceled from single doc picker');
        } else {
          //For Unknown Error
          alert('Unknown Error: ' + JSON.stringify(err));
          throw err;
        }
      }
  }

  viewDoc = async() =>{
      console.log("single File view")
      try{
          FileViewer.open(this.state.singleFile.uri).then(() => {

          })
      } catch(err){

      }
  }

  render() {
    const {search, userdata} = this.state
    console.log("userData", userdata)
    var left = (
        <Left style={{flex:1}}>
          <Button transparent onPress={() => Actions.home()}>
            <Icon name="ios-backspace" size={38} style={{fontSize: 38}} />
          </Button>
        </Left>
      );
    return(
      <Container style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)'}}>
      <Navbar left={left} title="Medicine List" />
        <Content onPress={() => this.viewDoc()} style={{ marginLeft: '10%', marginTop:'20%'}}>
            <Text onPress={() => this.viewDoc()} style={{fontSize:20}}>Document Name: </Text>
            <Text onPress={() => this.viewDoc()} style={{fontSize:30}}>{this.state.singleFile.name}</Text>
            <Text onPress={() => this.viewDoc()} style={{fontSize:20}}>Document Path: </Text>
            <Text onPress={() => this.viewDoc()} style={{fontSize:30}}>{this.state.singleFile.uri}</Text>
            <Text onPress={() => this.viewDoc()} style={{fontSize:20}}>Document Type: </Text>
            <Text onPress={() => this.viewDoc()} style={{fontSize:30}}>{this.state.singleFile.type}</Text>
            <Text onPress={() => this.viewDoc()} style={{fontSize:20}}>Document Size: </Text>
            <Text onPress={() => this.viewDoc()} style={{fontSize:30}}>{this.state.singleFile.size}</Text>
        </Content>
        <Button onPress={() => this.addData()}>
            <Text style={{color:'white', paddingLeft:'40%'}}>Place Order</Text>
        </Button>
      </Container>
    );
  }

  addData = async () =>{
    console.log("data added", this.state.singleFile)
    let uri = this.state.singleFile.uri
    var result = await this.uriToBlob(uri)
    console.log("resulted value", result)
    var storageRef = Firebase.storage().ref();
    storageRef.child(`users/${this.state.singleFile.name}`).put(result)
    .then(snapshot =>{
      // console.log("snapShot",snapshot)
      this.dataResponse(snapshot)
    })
  }

  dataResponse(data){
    var storageRef = Firebase.storage().ref();
    storageRef.child(`users/${this.state.singleFile.name}`).getDownloadURL().then(url =>{
      console.log("url data", url)
      this.addFile(url)
    })
    // .then(
    //   resp => {
    //     this.addFile()
    //   }
    // )
    // storageRef().ref('users').child(this.state.singleFile.name).getDownloadURL().then(url =>{
    //   console.log("url", url)
    // })
  }

  addFile = (url) =>{
    const db = Firebase.firestore()
    let userRef = db.collection("orderPres").add({
      orderStatus: "Pending",
      userName:this.state.userdata,
      medicineName:url,
      userID: this.state.userdata
     })
     .then(res => {
       this.addId(res)
     })
  }

  uriToBlob = (uri) => {
    console.log("uri to blob")
    return new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();

      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };
      
      xhr.onerror = function() {
        // something went wrong
        reject(new Error('uriToBlob failed'));
      };

      // this helps us get a blob
      xhr.responseType = 'blob';

      xhr.open('GET', uri, true);
      xhr.send(null);

    });

  }

  addId = (resp) => {
    let id = resp.id
     
    var db = Firebase.firestore();
    db.collection("orderPres").where("userID", '==', this.state.userdata)
    .get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        db.collection("orderPres")
        .doc(doc.id)
        .update({
          orderID:id
        })
      })
    }).then(response => this.getData(response))
  }

  getData(response){
    console.log("response", response)
    Actions.home()
  }

}
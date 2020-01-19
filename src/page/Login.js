/**
* This is the Login Page
**/

// React native and others libraries imports
import React, { Component } from 'react';

import { ScrollView, AsyncStorage } from 'react-native';
import { Container, View, Left, Right, Button, Icon, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';

// Our custom files and classes import
import Colors from '../Colors';
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import Firebase from '../Firebase/firebase';

export default class Login extends Component {
  constructor(props) {
      super(props);
      this.state = {
        email: '',
        password: '',
        hasError: false,
        errorText: '',
        datauser:''
      };
  }


  componentDidMount() {
    this.apicall()
    console.disableYellowBox = true;
  }

  apicall = async() =>{
    const datauser = await AsyncStorage.getItem("userToken");
    console.log("data user login age", datauser)
    // if(datauser){
    //   Actions.home()
    // }
    this.setState({
      datauser: datauser
    })
  }

  render() {
    // if(this.state.datauser !== null){
    //   Actions.home()
    // } else {
      var left = (
        <Left style={{flex:1}}>
          <Button onPress={() => Actions.pop()} transparent>
            <Icon name='ios-arrow-back' />
          </Button>
        </Left>
      );
      var right = (
        <Right style={{flex:1}}>
          <Button onPress={() => Actions.search()} transparent>
            <Icon name='ios-search' />
          </Button>
          <Button onPress={() => Actions.cart()} transparent>
            <Icon name='ios-cart' />
          </Button>
        </Right>
      );
      return(
        <Container style={{backgroundColor: '#fdfdfd'}}>
          <Navbar title="LOGIN" />
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 50, paddingRight: 50}}>
            <View style={{marginBottom: 35, width: '100%'}}>
              <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left', width: '100%', color: Colors.navbarBackgroundColor}}>Welcome back, </Text>
              <Text style={{fontSize: 18, textAlign: 'left', width: '100%', color: '#687373'}}>Login to continue </Text>
            </View>
            <Item>
                <Icon active name='ios-person' style={{color: "#687373"}}  />
                <Input placeholder='Email' onChangeText={(text) => this.setState({email: text})} placeholderTextColor="#687373" />
            </Item>
            <Item>
                <Icon active name='ios-lock' style={{color: "#687373"}} />
                <Input placeholder='Password' onChangeText={(text) => this.setState({password: text})} secureTextEntry={true} placeholderTextColor="#687373" />
            </Item>
            {this.state.hasError?<Text style={{color: "#c0392b", textAlign: 'center', marginTop: 10}}>{this.state.errorText}</Text>:null}
            <View style={{alignItems: 'center'}}>
              <Button onPress={() => this.login()} style={{backgroundColor: Colors.navbarBackgroundColor, marginTop: 20}}>
                <Text style={{color: '#fdfdfd'}}>Login</Text>
              </Button>
            </View>
          </View>
        </Container>
      );
    }
  // }

  login() {
    /*
      Remove this code and replace it with your service
      Username: this.state.username
      Password: this.state.password
    */
   var database = Firebase.firestore();
   database.collection("admin").where("email", '==', this.state.email).get().then(snapshot =>{
     if(snapshot.empty){
      //  this.setState({
      console.log("empty data")
      //  })
     } else {
       this.apiResponse(snapshot)
     }
   })
  }

  apiResponse = async (response) =>{
    
    await AsyncStorage.setItem("userToken", this.state.email)
    Actions.home()
  }


}

/**
* This is the Signup Page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { ScrollView, AsyncStorage } from 'react-native';
import { Container, View, Left, Right, Button, Icon, Item, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Firebase from '../Firebase/firebase'
// Our custom files and classes import
import Colors from '../Colors';
import Text from '../component/Text';
import Navbar from '../component/Navbar';

export default class Signup extends Component {
  constructor(props) {
      super(props);
      this.state = {
        email: '',
        name: '',
        username: '',
        password: '',
        rePassword: '',
        hasError: false,
        errorText: '',
        datauser: ''
      };
  }

  componentDidMount() {
    this.apicall()
    console.disableYellowBox = true;
  }

  apicall = async () =>{
    const datauser = await AsyncStorage.getItem("userToken");
    console.log("datauser at apicakk signup", datauser)
    if(datauser){
      Actions.login()
    }
    this.setState({
      datauser: datauser
    })
  }

  render() {
    console.log("datauser", this.state.datauser)
    // if(this.state.datauser !== null){
    //   Actions.login()
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
  
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingLeft: 50, paddingRight: 50}}>
              <View style={{marginBottom: 35, width: '100%'}}>
                <Text style={{fontSize: 24, fontWeight: 'bold', textAlign: 'left', width: '100%', color: Colors.navbarBackgroundColor}}>Create your account, </Text>
                <Text style={{fontSize: 18, textAlign: 'left', width: '100%', color: '#687373'}}>Signup to continue </Text>
              </View>
              <Item>
                  <Icon active name='ios-mail' style={{color: '#687373'}} />
                  <Input placeholder='Email' onChangeText={(text) => this.setState({email: text})} keyboardType="email-address" placeholderTextColor="#687373" />
              </Item>
              <Item>
                  <Icon active name='ios-man' style={{color: '#687373'}} />
                  <Input placeholder='Name' onChangeText={(text) => this.setState({name: text})} placeholderTextColor="#687373" />
              </Item>
              <Item>
                  <Icon active name='ios-person' style={{color: '#687373'}} />
                  <Input placeholder='Username' onChangeText={(text) => this.setState({username: text})} placeholderTextColor="#687373" />
              </Item>
              <Item>
                  <Icon active name='ios-lock' style={{color: '#687373'}} />
                  <Input placeholder='Password' onChangeText={(text) => this.setState({password: text})} secureTextEntry={true} placeholderTextColor="#687373" />
              </Item>
              <Item>
                  <Icon active name='ios-lock' style={{color: '#687373'}} />
                  <Input placeholder='Repeat your password' onChangeText={(text) => this.setState({rePassword: text})} secureTextEntry={true} placeholderTextColor="#687373" />
              </Item>
              {this.state.hasError?<Text style={{color: "#c0392b", textAlign: 'center', marginTop: 10}}>{this.state.errorText}</Text>:null}
              <View style={{alignItems: 'center'}}>
                <Button onPress={() => this.signup()} style={{backgroundColor: Colors.navbarBackgroundColor, marginTop: 20}}>
                  <Text style={{color: '#fdfdfd'}}>Signup</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </Container>
      );
    }
  // }

  signup = async() => {
    if(this.state.email===""||this.state.name===""||this.state.username===""||this.state.password===""||this.state.rePassword==="") {
      this.setState({hasError: true, errorText: 'Please fill all fields !'});
      return;
    }
    if(!this.verifyEmail(this.state.email)) {
      this.setState({hasError: true, errorText: 'Please enter a valid email address !'});
      return;
    }
    if(this.state.username.length < 3) {
      this.setState({hasError: true, errorText: 'Passwords must contains at least 3 characters !'});
      return;
    }
    if(this.state.password.length < 6) {
      this.setState({hasError: true, errorText: 'Passwords must contains at least 6 characters !'});
      return;
    }
    if(this.state.password !== this.state.rePassword) {
      this.setState({hasError: true, errorText: 'Passwords does not match !'});
      return;
    }
    this.setState({hasError: false});
    var db = Firebase.firestore();
    let userRef = db.collection("Users").add({
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
      name: this.state.name
    })
    .then(resp => this.getResponse(resp))
  }

  getResponse(resp){
    let id = resp.id
    var db = Firebase.firestore();
    db.collection("Users").where("email", '==', this.state.email)
    .get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        db.collection("Users")
        .doc(doc.id)
        .update({
          userID:id
        })
      })
    }).then(response => this.getData(response))
  }

  getData = async(response) =>{
    console.log("response,", response)
    await AsyncStorage.setItem("userToken", this.state.email)

    Actions.login()
  }

  verifyEmail(email) {
    var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(email);
  }


}

/**
* This is the Home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image, AsyncStorage, ActivityIndicator } from 'react-native';
import { Container, Content, View, Button, Left, Right, Icon, Card, CardItem, cardBody, Body, Form, Item, Label, Input } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Firebase from '../Firebase/firebase'
// Our custom files and classes import
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import SideMenu from '../component/SideMenu';
import SideMenuDrawer from '../component/SideMenuDrawer';
import CategoryBlock from '../component/CategoryBlock';
import { Tile, Overlay } from 'react-native-elements';


export default class AdddMedicine extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username:'',
      name:'',
      quantity:'',
      hasError: false,
      manufacturer:'',
      isVisible: false,
      result:[],
      userdata:'',
      arrayofMedicin:[]
    };
}

  componentDidMount() {
    {this.apiCal()}
    console.disableYellowBox = true;
  }

  apiCal = () =>{
    console.log("props data edit", this.props)
    this.setState({
        name: this.props.medicinename,
        manufacturer: this.props.manufacture,
        medicineID: this.props.medicineID,
        quantity:this.props.quantity
    })
  }


  render() {
    const { result } = this.state;
    console.log("result data",result)
    var left = (
      <Left style={{flex:1}}>
        <Button onPress={() => Actions.medicineList()} transparent>
          <Icon name='ios-backspace' />
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
      <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
          <Container>
            <Navbar left={left}  title="Edit Medicine" />
            <Content>
            <ActivityIndicator 
            animating={this.state.isVisible}
            size="large"
            color="#0000ff"
            />
            <Item>
                <Input placeholder='Medicine Name' value={this.state.name} onChangeText={(text) => this.setState({name: text})} placeholderTextColor="#687373" />
            </Item>
            <Item style={{marginTop:40}}>
                <Input placeholder='Manufacturer' value={this.state.manufacturer} onChangeText={(text) => this.setState({manufacturer: text})} placeholderTextColor="#687373" />
            </Item>
            <Item style={{marginTop:40}}>
                <Input placeholder='Quantity' value={this.state.quantity} keyboardType="number-pad" onChangeText={(text) => this.setState({quantity: text})} placeholderTextColor="#687373" />
            </Item>
            {this.state.hasError?<Text style={{color: "#c0392b", textAlign: 'center', marginTop: 10}}>{this.state.errorText}</Text>:null}
            <Button onPress={this.addData} style={{width:150, marginLeft:'27%', marginTop:'20%', paddingLeft:'15%'}}>
                <Text style={{color:'white'}} >Update</Text>
            </Button>
            </Content>
          </Container>
      </SideMenuDrawer>
    );
  }

  addData = async() =>{
      this.setState({
          isVisible: true
      })
    console.log("array of Medicine", this.state.name, this.state.manufacturer, this.state.quantity, this.state.medicineID)
    if(this.state.manufacturer===""||this.state.name===""||this.state.quantity==="") {
        this.setState({hasError: true, errorText: 'Please fill all fields !'});
        return;
      }
     
      if(this.state.name.length < 2) {
        this.setState({hasError: true, errorText: 'Name must contains at least 3 characters !'});
        return;
      }
      this.setState({hasError: false});
      var db = Firebase.firestore()
        db.collection('MedicineList').where('medicineID','==',this.state.medicineID)
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                db.collection('MedicineList').doc(doc.id).update({
                    name: this.state.name,
                    quantity: this.state.quantity,
                    manufacture: this.state.manufacturer
                }).then(resp => {this.getData(resp)})
            })
        })
  }

  addId = (resp) => {
    let id = resp.id
    var db = Firebase.firestore();
    db.collection("MedicineList").where("name", '==', this.state.name)
    .get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        db.collection("MedicineList")
        .doc(doc.id)
        .update({
          medicineID:id
        })
      })
    }).then(response => this.getData(response))
  }

  getData(response){
      this.setState({
          isVisible: false
      })
    console.log("response", response)
    Actions.medicineList()
  }

  

  setValue = value =>{
    console.log("value of medicine data ", value)
    this.setState({
      arrayofMedicin: value.name
    })
  }
  renderCategories(result) {
    let cat = [];
    // const result = this.state;
    <CategoryBlock result={result} />
  }

}

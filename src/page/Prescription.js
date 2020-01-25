/**
* This is the Home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image, AsyncStorage, ActivityIndicator } from 'react-native';
import { Container, Content, View, Button, Left, Right, Icon, Card, CardItem, cardBody, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Firebase from '../Firebase/firebase'
// Our custom files and classes import
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import SideMenu from '../component/SideMenu';
import SideMenuDrawer from '../component/SideMenuDrawer';
import CategoryBlock from '../component/CategoryBlock';
import { Tile, Overlay } from 'react-native-elements';


export default class Prescription extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username:'',
      medicineName:'',
      isVisible: false,
      result:[],
      orderID:'',
      userID:'',
      orderStatus:'',
    };
}

  componentDidMount() {
    this.apiCal()
    console.disableYellowBox = true;
  }

  apiCal(){
    var arr = [];
    this.setState({
        isVisible: true
    })
    var array = [];
    const users = Firebase.firestore();
    const user = users.collection('orderPres').get().then(querySnapshot =>{
        const data = querySnapshot.docs.map(doc => doc.data());
        for(var i = 0; i < data.length; i++){
          console.log("data values", data[i])
            array.push({
                orderStatus:data[i].orderStatus,
                orderID:data[i].orderID,
                medicineName:data[i].medicineName,
                userID: data[i].userID,
                deliveryTime:data[i].deliveryTime
            })
        }
        this.setState({
            result: array,
            isVisible: false
        })
    })
  }

  render() {
    const { result } = this.state;
    this.state.result.map((item,index) =>{
      console.log("item data", item)
    })
    var left = (
      <Left style={{flex:1}}>
        <Button onPress={() => this._sideMenuDrawer.open()} transparent>
          <Icon name='ios-menu' />
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
            <Navbar left={left}  title="Order List" />
            <Content>
            <ActivityIndicator 
            animating={this.state.isVisible}
            size="large"
            color="#0000ff"
            />
              <Card>
                {this.state.result.map((item,index)=>(
                    <Card>
                    <CardItem header>
                       <Body>
                       <Text>{item.medicineName}</Text>
                       <Text style={{marginTop:20}}>{item.orderStatus}</Text>
                       <Text style={{marginTop:20}}>{item.userID}</Text>
                       <Text style={{marginTop:20}}>{item.deliveryTime}</Text>
                       </Body>
                       <Icon name='ios-trash' style={{color:'red'}} onPress={item.orderStatus === 'Approved' ? '' : () =>  this.deleteData(item.orderID)} />
                    </CardItem>
                    <CardItem footer>
                        <Button success style={{marginLeft:'30%'}} large light onPress={() => this.changeStatus()}>
                            <Text>Change Status</Text>
                        </Button>
                    </CardItem>
                    </Card>
                ))}
              </Card>
            </Content>
          </Container>
      </SideMenuDrawer>
    );
  }

  changeStatus = () =>{
    this.setState({
        isVisible: true
    })
    var db = Firebase.firestore()
    db.collection('orderDetail').where('orderID','==',this.state.orderID)
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                db.collection('orderDetail').doc(doc.id).update({
                    orderStatus: !this.state.orderStatus,
                }).then(resp => {this.deletResponse(resp)})
            })
        })  
  }

  deleteData = (id) =>{
    console.log("data id ", id)
    this.setState({
        isVisible: true
    })
    var db = Firebase.firestore()
    db.collection("orderDetail").doc(id).delete().then(response =>{
        console.log("response from deleting data", response)
        this.deletResponse(response)
    })
  }

  deletResponse(response){
      console.log("data is deleted", response)
      this.setState({
          isVisible: false
      })
      {this.apiCal()}
  }

  sendData = async() =>{
    console.log("array of Medicine", this.state.arrayofMedicin, this.state.userdata)
    // var database = Firebase.firestore()
    var db = Firebase.firestore();
    let userRef = db.collection("orderDetail").add({
      orderStatus: "Pending",
      medicineName:this.state.arrayofMedicin,
      userID: this.state.userdata
    })
    .then(resp => {
      this.addId(resp)
    })
  }

  addId = (resp) => {
    let id = resp.id
    var db = Firebase.firestore();
    db.collection("orderDetail").where("userID", '==', this.state.userdata)
    .get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc){
        db.collection("orderDetail")
        .doc(doc.id)
        .update({
          orderID:id
        })
      })
    }).then(response => this.getData(response))
  }

  getData(response){
    console.log("response", response)
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

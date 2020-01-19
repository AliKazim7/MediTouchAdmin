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


export default class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username:'',
      name:'',
      isVisible: false,
      result:[],
      userdata:'',
      arrayofMedicin:[]
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
    const user = users.collection('Users').get().then(querySnapshot =>{
        const data = querySnapshot.docs.map(doc => doc.data());
        for(var i = 0; i < data.length; i++){
            array.push({
                email:data[i].email,
                name:data[i].name,
                username:data[i].username,
                userID: data[i].userID
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
    console.log("result data",result)
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
            <Navbar left={left}  title="User List" />
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
                       <Text>{item.name}</Text>
                       <Text style={{marginTop:20}}>{item.email}</Text>
                       </Body>
                       <Icon name='ios-trash' style={{color:'red'}} onPress={ () =>  this.deleteData(item.userID)} />
                    </CardItem>
                    </Card>
                ))}
              </Card>
            </Content>
          </Container>
      </SideMenuDrawer>
    );
  }

  deleteData = (id) =>{
    console.log("data id ", id)
    this.setState({
        isVisible: true
    })
    var db = Firebase.firestore()
    db.collection("Users").doc(id).delete().then(response =>{
        console.log("response from deleting data", response)
        deletResponse(response)
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

var categories = [
  {
    id: 1,
    title: 'MEN',
    image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_489/v1500284127/pexels-photo-497848_yenhuf.jpg'
  },
  {
    id: 2,
    title: 'WOMEN',
    image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_460/v1500284237/pexels-photo-324030_wakzz4.jpg'
  },
  {
    id: 3,
    title: 'KIDS',
    image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_445/v1500284286/child-childrens-baby-children-s_shcevh.jpg'
  },
  {
    id: 4,
    title: 'ACCESORIES',
    image: 'http://res.cloudinary.com/atf19/image/upload/c_scale,w_467/v1500284346/pexels-photo-293229_qxnjtd.jpg'
  }
];

/**
* This is the Home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image, AsyncStorage } from 'react-native';
import { Container, Content, View, Button, Left, Right, Icon, Card, CardItem, cardBody } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Firebase from '../Firebase/firebase'
// Our custom files and classes import
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import SideMenu from '../component/SideMenu';
import SideMenuDrawer from '../component/SideMenuDrawer';
import CategoryBlock from '../component/CategoryBlock';
import { Tile } from 'react-native-elements';


export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      result:[],
      userdata:'',
      arrayofMedicin:[]
    };
}

  componentDidMount() {
    this.apiCal()
    this.apiCals()
    console.disableYellowBox = true;
  }

  apiCals = async () =>{
    const userdata = await AsyncStorage.getItem("userToken");
    this.setState({
      userdata: userdata
    })
}

  apiCal(){
    var arr = [];
    var array = [];
    const users = Firebase.firestore();
    const user = users.collection('MedicineList').get().then(querySnapshot =>{
        const data = querySnapshot.docs.map(doc => doc.data());
        for(var i = 0; i < data.length; i++){
            array.push({
                medicineID:data[i].medicineID,
                name:data[i].name
            })
        }
        this.setState({
            result: array
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
            <Navbar left={left}  title="MediTouch Admin" />
            <Content>
              <Tile
                featured
                onPress={() => Actions.medicineList()}
                title="Medicines"
                imageSrc={require('../component/pills.png')}
                imageContainerStyle={{
                  width: '100%',
                  height:'100%'
                }}
                containerStyle={{
                  borderColor:'1px solid black'
                }}
              />
              <Tile
                onPress={() => Actions.users()}
                featured
                title="Users"
                titleStyle={{color:'black'}}
                imageSrc={require('../component/user.jpg')}
              />
              <Tile
                onPress={() => Actions.orderDetails()}
                featured
                title="Pending Orders"
                titleStyle={{color:'white'}}
                // imageContainerStyle={{margin:10, height:250}}
                imageSrc={require('../component/pendingimage.jpg')}
              />
            </Content>
          </Container>
      </SideMenuDrawer>
    );
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

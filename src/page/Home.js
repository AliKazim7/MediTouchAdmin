/**
* This is the Home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image, AsyncStorage } from 'react-native';
import { Container, Content, View, Button, Left, Right, Icon, Card, CardItem, cardBody, Body } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Firebase from '../Firebase/firebase'
// Our custom files and classes import
import SearchableDropdown from 'react-native-searchable-dropdown';
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
      <Container style={{flex:1,backgroundColor:'rgba(0,0,0,0.3)'}}>
      <SideMenuDrawer ref={(ref) => this._sideMenuDrawer = ref}>
      
      <Text style={{fontSize:30, color:'white', marginTop:'5%', marginLeft:'10%', marginBottom:'10%'}}>Buy Medicines Online</Text>
      <Text style={{fontSize:20, color:'white',marginLeft:'30%',marginBottom:'5%' }}>Search Medicine</Text>
      <Text style={{fontSize:20, color:'white', marginLeft:'30%', marginTop:'5%', marginBottom:'5%'}}>Upload Prescription</Text>

      <SearchableDropdown
      onItemSelect={(item) => {
        this.setState({ selectedItems: item, afterSelect: true });
      }}
        containerStyle={{ padding: 5 }}
        onRemoveItem={(item, index) => {
          const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
          this.setState({ selectedItems: items });
        }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: '#ddd',
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{ color: '#222' }}
        itemsContainerStyle={{ maxHeight: 140 }}
        items={result}
        defaultIndex={2}
        resetValue={false}
        textInputProps={
          {
            placeholder: "placeholder",
            underlineColorAndroid: "transparent",
            style: {
                padding: 12,
                borderWidth: 1,
                borderColor: '#ccc',
                borderRadius: 5,
            },
            onTextChange: text => {
              this.setState({
                selectedItems: text
              })
            }
          }
        }
        listProps={
          {
            nestedScrollEnabled: true,
          }
        }
    />    
      
    <Body>
      <Icon onPress={ () => Actions.document()} style={{fontSize: 100 }} name="camera" />
      <Text style={{fontSize:20}} >Take Picture</Text>
    </Body>
    <Body>
      <Icon onPress={ () => Actions.document({userdata: this.state.userdata})} style={{fontSize: 100 }} name="folder" />
      <Text style={{fontSize:20}} >Choose File</Text>
    </Body>
    <Body>
      <Icon onPress={ () => Actions.orderDetails({userdata: this.state.userdata})} style={{fontSize: 100 }} name="ios-cart" />
      <Text style={{fontSize:20}} >Order Details</Text>
    </Body>
      </SideMenuDrawer>
      
      </Container>
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

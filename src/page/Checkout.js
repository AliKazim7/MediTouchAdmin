/**
* This is the Checkout Page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { TouchableHighlight, AsyncStorage } from 'react-native';
import { Container, Content, View, Grid, Col, Left, Right, Button, Icon, List, ListItem, Body, Radio, Input, Item } from 'native-base';
import FAIcon  from 'react-native-vector-icons/FontAwesome';
import { Actions } from 'react-native-router-flux';

// Our custom files and classes import
import Colors from '../Colors';
import Text from '../component/Text';
import Navbar from '../component/Navbar';
import Firebase from '../Firebase/firebase';

export default class Checkout extends Component {
  constructor(props) {
      super(props);
      this.state = {
        cartItems: [],
        total: 0,
        medicineName:'',
        orderStatus:'',
        orderID:'',
        deliveryCharges:'',
        deliveryTime:'',
        username:'',
        balance:0
      };
  }

  componentWillMount() {
    console.log("data items", this.props)
    this.setState({
      medicineName: this.props.medicineName,
      orderStatus: this.props.orderStatus,
      username: this.props.userID,
      orderID: this.props.orderID,
      deliveryTime: this.props.deliveryTime,
    })
    if(this.props.balance){
      this.setState({
        balance: this.props.balance
      })
    }
    // this.setState({cartItems: this.props.cartItems});
    // this.props.cartItems.map((item) => {
    //   var total = 0;
    //   total += parseFloat(item.price) * parseInt(item.quantity);
    //   this.setState({total: total});
    // });
  }

  render() {
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
          <Icon name='ios-search-outline' />
        </Button>
      </Right>
    );
    return(
      <Container style={{backgroundColor: '#fdfdfd'}}>
        <Navbar left={left} title="CHANGE STATUS" />
        <Content padder>
          <View>
            <Text style={{marginTop: 15, fontSize: 18}}>Shipping information</Text>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='User Name' value={this.state.username} onChangeText={(text) => this.setState({username: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Order Status' value={this.state.orderStatus}  placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Delivery Time' value={this.state.deliveryTime} onChangeText={(text) => this.setState({deliveryTime: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Medicine Name' value={this.state.medicineName} onChangeText={(text) => this.setState({medicineName: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Delivery Charges' onChangeText={(text) => this.setState({deliveryCharges: text})} placeholderTextColor="#687373" />
            </Item>
            <Item regular style={{marginTop: 7}}>
                <Input placeholder='Total Balance' onChangeText={(text) => this.setState({balance: text})} placeholderTextColor="#687373" />
            </Item>
            </View>
          <View style={styles.invoice}>
            
            <View style={styles.line} />
            <Grid style={{paddingLeft: 10, paddingRight: 10, marginTop: 7}}>
              <Col>
                <Text style={{fontSize: 18, fontStyle: 'italic'}}>Total</Text>
              </Col>
              <Col>
                <Text style={{textAlign: 'right', fontSize: 18, fontWeight: 'bold'}}>{this.state.balance+"Rs"}</Text>
              </Col>
            </Grid>
          </View>
          <View style={{marginTop: 10, marginBottom: 10, paddingBottom: 7}}>
            <Button onPress={() => this.checkout()} style={{backgroundColor: Colors.navbarBackgroundColor}} block iconLeft>
              <Icon name='ios-card' />
              <Text style={{color: '#fdfdfd'}}>Proceed to payement</Text>
            </Button>
          </View>
        </Content>
      </Container>
    );
  }

  renderItems() {
    let items = [];
    this.state.cartItems.map((item, i) => {
      items.push(
        <ListItem
          key={i}
          style={{marginLeft: 0}}
        >
          <Body style={{paddingLeft: 10}}>
            <Text style={{fontSize: 18}}>
              {item.quantity > 1 ? item.quantity+"x " : null}
              {item.title}
            </Text>
            <Text style={{fontSize: 14 ,fontStyle: 'italic'}}>Color: {item.color}</Text>
            <Text style={{fontSize: 14 ,fontStyle: 'italic'}}>Size: {item.size}</Text>
          </Body>
          <Right>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>{item.price}</Text>
          </Right>
        </ListItem>
      );
    });
    return items;
  }

  checkout() {
    // var db = Firebase.firestore()
    console.log('data values', this.state.orderStatus, this.state.orderID, this.state.balance, this.state.username, this.state.deliveryCharges, this.state.deliveryTime)
    if(this.state.orderStatus === 'Pending'){
      let username = this.state.username;
      let deliveryCharges = this.state.deliveryCharges;
      let deliveryTime = this.state.deliveryTime;
      let orderStatus = this.state.orderStatus;
      let orderID = this.state.orderID
      let balance = this.state.balance
      var db = Firebase.firestore()
    db.collection('orderDetail').where('orderID','==',orderID)
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                db.collection('orderDetail').doc(doc.id).update({
                    orderStatus: 'Approved',
                    totalBalance: balance,
                    deliveryTime: deliveryTime,
                    deliveryCharges: deliveryCharges,
                    userID: username

                }).then(resp => {Actions.orderDetails()})
            })
        })
    }
  }

}

const styles = {
  invoice: {
    paddingLeft: 20,
    paddingRight: 20
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#bdc3c7'
  }
};

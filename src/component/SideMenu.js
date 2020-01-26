/**
* This is the SideMenu component used in the navbar
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { ScrollView, LayoutAnimation, UIManager, Linking, AsyncStorage } from 'react-native';
import { View, List, ListItem, Body, Left, Right, Icon, Item, Input, Button, Grid, Col } from 'native-base';
import { Actions } from 'react-native-router-flux';

// Our custom files and classes import
import SideMenuSecondLevel from './SideMenuSecondLevel';
import Text from './Text';

export default class SideMenu extends Component {
  constructor(props) {
      super(props);
      this.state = {
        search: "",
        searchError: false,
        subMenu: false,
        subMenuItems: [],
        clickedItem: ''
      };

      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  componentDidMount() {
    console.disableYellowBox = true;
    this.apiCall()
  }

  apiCall = async() =>{
    apiCals = async () =>{
      const userdata = await AsyncStorage.getItem("userToken");
      if(userdata === null){
        Actions.login()
      } else if(userdata){
        
      this.setState({
        userdata: userdata
      })
      }
  }
  }

  render() {
    return(
          <ScrollView style={styles.container}>
              {this.renderMenu()}
          </ScrollView>
    );
  }

  renderMenu() {
    if(!this.state.subMenu) {
      return(
        <View>
          <View style={{paddingLeft: 15, paddingRight: 15}}>
            <Item error={this.state.searchError}>
            <Icon style={{fontSize:100, marginLeft:'20%'}} active name='ios-people' onPress={() => this.search()} />
            <Text>{this.state.userdata}</Text>
            </Item>
          </View>
          <View style={{paddingRight: 15}}>
            <List>
              <ListItem
                icon
                key={0}
                button={true}
                onPress={() => Actions.home()}
              >
                <Body>
                  <Text>Home</Text>
                </Body>
                <Right>
                  <Icon name="ios-arrow-forward" />
                </Right>
              </ListItem>
              <ListItem
                icon
                key={1}
                button={true}
                onPress={() => this.Logout()}
              >
                <Body>
                  <Text>Log Out</Text>
                </Body>
                <Right>
                  <Icon name="ios-arrow-forward" />
                </Right>
              </ListItem>
              <ListItem
                icon
                key={1}
                button={true}
                onPress={() => Actions.users()}
              >
                <Body>
                  <Text>Users</Text>
                </Body>
                <Right>
                  <Icon name="ios-people" />
                </Right>
              </ListItem>
              <ListItem
                icon
                key={1}
                button={true}
                onPress={() => Actions.orderDetails()}
              >
                <Body>
                  <Text>Orders</Text>
                </Body>
                <Right>
                  <Icon name="ios-arrow-forward" />
                </Right>
              </ListItem>
              {
                // this.renderMenuItems()
              }
            </List>
          </View>
          <View style={styles.line} />
          <View style={{paddingRight: 15}}>
            <List>
              {this.renderSecondaryList()}
            </List>
          </View>
          <View style={styles.line} />
          <View style={{paddingRight: 15, paddingLeft: 15}}>
            <Text style={{marginBottom: 7}}>Follow us</Text>
            <Grid>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='logo-facebook'  /></Col>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='logo-instagram'
              //  onPress={() => Linking.openURL('http://www.instagram.com/').catch(err => console.error('An error occurred', err))} 
               /></Col>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='logo-twitter' 
              // onPress={() => Linking.openURL('http://www.twitter.com/').catch(err => console.error('An error occurred', err))} 
              /></Col>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='logo-youtube' 
              // onPress={() => Linking.openURL('http://www.youtube.com/').catch(err => console.error('An error occurred', err))} 
              /></Col>
              <Col style={{alignItems: 'center'}}><Icon style={{fontSize: 18}} name='logo-snapchat' 
              // onPress={() => Linking.openURL('http://www.snapchat.com/').catch(err => console.error('An error occurred', err))} 
              /></Col>
            </Grid>
          </View>
        </View>
      );
    }
    else {
      return(
        <SideMenuSecondLevel back={this.back.bind(this)} title={this.state.clickedItem} menu={this.state.subMenuItems} />
      );
    }
  }

  Logout = async() =>{
    try{
      await AsyncStorage.removeItem("userToken")
      Actions.login()
    } catch(e){
      return false
    }
  }

  // renderMenuItems() {

  //   let items = [];
  //   menuItems.map((item, i) => {
  //     items.push(
  //       <ListItem
  //         last={menuItems.length === i+1}
  //         icon
  //         key={item.id}
  //         button={true}
  //         onPress={() => this.itemClicked(item)}
  //       >
  //         <Body>
  //           <Text>{item.title}</Text>
  //         </Body>
  //         <Right>
  //           <Icon name="ios-arrow-forward" />
  //         </Right>
  //       </ListItem>
  //     );
  //   });
  //   return items;
  // }

  itemClicked(item) {
    if(!item.subMenu || item.subMenu.length<=0) {
      Actions.category({id: item.id, title: item.title});
      return;
    }
    var animationConfig = {
        duration: 150,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleXY,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      };
    LayoutAnimation.configureNext(animationConfig);
    this.setState({subMenu: true, subMenuItems: item.subMenu, clickedItem: item.title});
  }

  back() {
    var animationConfig = {
        duration: 150,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.scaleXY,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      };
    LayoutAnimation.configureNext(animationConfig);
    this.setState({subMenu: false, subMenuItems: [], clickedItem: ''})
  }

  search(text) {
    if(this.state.search.length <= 2)
      this.setState({searchError: true, search: ""});
    else
      Actions.search({searchText: this.state.search});
  }

  renderSecondaryList() {
    let secondaryItems = [];
    menusSecondaryItems.map((item, i) => {
      secondaryItems.push(
        <ListItem
          last
          icon
          key={item.id}
          button={true}
          onPress={Actions[item.key]}
        >
          <Left>
            <Icon style={{fontSize: 18}} name={item.icon} />
          </Left>
          <Body style={{marginLeft: -15}}>
            <Text style={{fontSize: 16}}>{item.title}</Text>
          </Body>
        </ListItem>
      );
    });
    return secondaryItems;
  }

}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd'
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(189, 195, 199, 0.6)',
    marginTop: 10,
    marginBottom: 10
  }
};


const menusSecondaryItems = [
  {
    id: 190,
    title: 'Login',
    icon: 'ios-person',
    key: 'login'
  },
  {
    id: 519,
    title: 'Signup',
    icon: 'ios-person-add',
    key: 'signup'
  },
  // {
  //   id: 19,
  //   title: 'Wish List',
  //   icon: 'heart',
  //   key: 'wishlist'
  // },
  // {
  //   id: 20,
  //   key: 'map',
  //   title: 'Store Finder',
  //   icon: 'ios-pin',
  //   key: 'map'
  // },
  {
    id: 21,
    key: 'contact',
    title: 'Contact Us',
    icon: 'md-phone-portrait',
    key: 'contact'
  },
  // {
  //   id: 23,
  //   key: 'newsletter',
  //   title: 'Newsletter',
  //   icon: 'md-paper',
  //   key: 'newsletter'
  // }
];

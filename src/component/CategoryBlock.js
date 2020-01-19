/**
* This is the category component used in the home page
**/

// React native and others libraries imports
import React, { Component } from 'react';
import { Image, Dimensions, TouchableOpacity } from 'react-native';
import { View  } from 'native-base';
import { Actions } from 'react-native-router-flux';
// import image from ''
// Our custom files and classes import
import Text from './Text';

export default class CategoryBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
    };
}
  componentDidMount() {
    console.log("props are category block", this.props)
    console.disableYellowBox = true;

  }

  componentWillReceiveProps(nextProps){
    console.disableYellowBox = true;
    console.log("nexxtProps",nextProps)
    if(nextProps){
      this.setState({
        result: nextProps.result
      })
    }
  }

  render() {
    return(
      <View style={{flex:1}}>
        {this.state.result.map((item,index)=>(
          <TouchableOpacity
          onPress={() => this.onPress(item)}
          activeOpacity={0.9}
        >
          <View key={index}>
          <Image style={styles.image} source={require('./pills.png')} />
          <View style={styles.overlay} />
          <View style={styles.border} />
          <View style={styles.text}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>Add to cart</Text>
          </View>
            </View>
        </TouchableOpacity>
        ))}
      </View>
    );
  }

  onPress = (item) => {
    console.log("items", item)
    this.props.sendData(item)
    // Actions.category({id: this.props.id, title: this.props.title});
  }
}

const styles = {
  text: {
    width: Dimensions.get('window').width,
    height: 200,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 32
  },
  subtitle: {
    textAlign: 'center',
    color: '#fdfdfd',
    fontSize: 16,
    fontWeight: '100',
    fontStyle: 'italic'
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(30, 42, 54, 0.4)'
  },
  border: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(253, 253, 253, 0.2)'
  },
  image: {
    height: 200,
    width: null,
    flex: 1
  }
};

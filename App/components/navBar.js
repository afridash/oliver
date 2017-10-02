import {
 View, Image, StatusBar, TouchableWithoutFeedback, Text,Platform,
} from 'react-native';
import React, { Component } from 'react';
import { Actions, Router, Scene } from 'react-native-router-flux';
import theme, {styles} from 'react-native-theme'
export default class NavBar extends Component {
  constructor (props) {
    super(props)
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  render() {
    return (
      <View style={styles.navBar}>
      <StatusBar />
      <View style={{ flexDirection: 'row' }}>
        <View style={{flex:1}}>
          <TouchableWithoutFeedback  onPress={Actions.drawerOpen}>
          <Image
        source={require('../assets/images/menu.png')}
        style={[customStyles.backarrowStyle, styles.iconColor]} />
          </TouchableWithoutFeedback>
        </View>
      {this.props.title && <View style={customStyles.titleContainer}><Text style={[customStyles.title, styles.textColor]}>{this.props.title}</Text></View>}
      <View style={{flex:1}}>
        {this.props.progress && <View style={customStyles.titleContainer}><Text style={[customStyles.title, styles.textColor]}>{this.props.progress}</Text></View>}
      </View>
    </View>
</View>
    );
  }
}
const customStyles = {
  backarrowStyle: {
    resizeMode: 'contain',
    flexDirection: 'row',
    width: 60,
    height: 60,
    left: 0,
    justifyContent: 'flex-start'
  },
  title:{
    fontSize:20,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    fontWeight:'700',
  },
  titleContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
};

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
      <View style={[customStyles.navBar, styles.navBar]}>
      <StatusBar />
      <View style={{ flexDirection: 'row' }}>
        <View style={{flex:1}}>
          {this.props.backButton ? <TouchableWithoutFeedback  onPress={Actions.pop}>
          <Image
            source={require('../assets/images/arrow_left.png')}
            style={[customStyles.backButton, styles.iconColor]} />
          </TouchableWithoutFeedback>:
          <TouchableWithoutFeedback  onPress={Actions.drawerOpen}>
            <Image
              source={require('../assets/images/menu.png')}
              style={[customStyles.backarrowStyle, styles.iconColor]} />
            </TouchableWithoutFeedback>
          }
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
  backButton:{
    resizeMode: 'contain',
    flexDirection: 'row',
    width: 30,
    height: 30,
    left: 0,
    justifyContent: 'flex-start',
    margin:15,
    padding:15,
  },
  title:{
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    fontWeight:'700',
  },
  titleContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  navBar: {
    borderTopWidth:20,
    shadowColor:'#000000',
    shadowOffset:{width: 5, height: 5},
    shadowOpacity:0.5,
    shadowRadius:5,
  },
};

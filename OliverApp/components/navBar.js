import {
 View,
 Image,
 StatusBar,
 TouchableWithoutFeedback,
 Text,
 Platform,
 AsyncStorage,
 AppState,
} from 'react-native';
import React, { Component } from 'react';
import { Actions, Router, Scene } from 'react-native-router-flux';
import theme, {styles} from 'react-native-theme'
import moment from 'moment'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
export default class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state = {
      appState: AppState.currentState,
    }
    this._handleAppStateChange = this._handleAppStateChange.bind(this)
    this.sessionsRef = firebase.database().ref().child('sessions')
    this.usersRef = firebase.database().ref().child('users')
  }
  async componentWillMount () {
    theme.setRoot(this)
    var userId = await AsyncStorage.getItem('myKey')
    this.setState({userId})
  }
  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange)
  }
  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }
  async _handleAppStateChange (nextAppState) {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
        AsyncStorage.setItem('session_start', new Date().getTime().toString())
    }else {
      if (this.state.appState.match(/inactive|background/)) {
        this.usersRef.child(this.state.userId).child('last_seen').set(firebase.database.ServerValue.TIMESTAMP)
        var session_start = await AsyncStorage.getItem('session_start')
        var session_end = new Date().getTime()
        var diff = moment(session_end).diff(moment(Number(session_start)), 'minutes')
        this.sessionsRef.child(this.state.userId).child(moment().format('l').replace(/\//g, '-')).push({
        session_start:session_start,
        session_end:session_end,
        time_difference:diff,
        })
      }
    }
    this.setState({appState: nextAppState});
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

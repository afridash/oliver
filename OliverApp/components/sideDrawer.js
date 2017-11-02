import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Platform, Image, AsyncStorage,TouchableHighlight } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'
import Firebase from '../auth/firebase'
const firebase = require('firebase')

export default class DrawerContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name:'',
      email:'',
      profilePicture:'none',
      badges:0,
      userId:''
    }
    this.ref = firebase.database().ref().child('badges')
  }
  async componentWillMount () {
    theme.setRoot(this)
    var name = await AsyncStorage.getItem('name')
    var email = await AsyncStorage.getItem('email')
    var userId = await AsyncStorage.getItem('myKey')
    if (userId !== null) {
      this.ref.child(userId).on('child_added', (badges)=>{
        this.setState({badges:badges.val()})
      })
      this.ref.child(userId).on('child_changed', (badges)=>{
        this.setState({badges:badges.val()})
      })
      var profilePicture = await AsyncStorage.getItem('pPicture')
     this.setState({email, name, profilePicture, userId})
    }
  }
  async componentWillReceiveProps (newprops) {
    var pic = await AsyncStorage.getItem('pPicture')
    this.setState({profilePicture:pic})
  }
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }
  async logout () {
    firebase.auth().signOut().then(function () {
      // Sign-out successful.
      }, function (error) {
        // An error happened.
    })
    var current = await AsyncStorage.getItem('myKey')
    AsyncStorage.setItem('currentUser', current)
    let keys = ['email', 'myKey', 'name', 'pPicture', 'verified', 'collegeId', 'college', 'username']
    await AsyncStorage.multiRemove(keys, (err) => {
      return Actions.reset('index')
    })
  }
  loadNotifcations () {
    this.ref.child(this.state.userId).child('notificationsBadges').remove()
    this.setState({badges:0})
    return Actions.replace('notifications')
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={sidebar.container}>
          <TouchableHighlight
            onPress={Actions.profile}
            underlayColor={'transparent'}
            style={[{flex:1,borderBottomWidth : (Platform.OS ==='ios') ? 0: 1}, styles.actionsContainer]}>
            <View style={sidebar.profile}>
              <View style={sidebar.profileContainer}>
              <Image resizeMode={'cover'} source={{uri: this.state.profilePicture}} style={sidebar.profilePicture} />
           </View>
           <View style={sidebar.profileText}>
             <Text style={sidebar.profileName}>{this.state.name}</Text>
             <Text style={sidebar.profileEmail}>{this.state.email}</Text>
           </View>
            </View>
          </TouchableHighlight>
          <View style={sidebar.menu}>
            <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={()=>Actions.replace('home')}>
              <Image source={require('../assets/images/homeicon.png')} style={[sidebar.home, styles.iconColor]} />  Home</Button>
              <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={()=>Actions.replace('courses')}>
                <Image source={require('../assets/images/courses.png')} style={[sidebar.home, styles.iconColor]} />  Find Courses</Button>
              <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={()=>Actions.replace('bookmarks')} >
                <Image source={require('../assets/images/bookmark.png')} style={[sidebar.home, styles.iconColor]} />  Bookmarks</Button>
              <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={()=>Actions.replace('recents')} >
                <Image source={require('../assets/images/recents.png')} style={[sidebar.home, styles.iconColor]} />  Recent Activities</Button>
                <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={()=>this.loadNotifcations()} >
                  <Image source={require('../assets/images/bell.png')} style={[sidebar.home, styles.iconColor]} />  Notifications
                  {this.state.badges !== 0 && <View style={sidebar.badge}><Text style={{color:'white', textAlign:'center'}}>{this.state.badges}</Text></View>}
                </Button>
                  <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={()=>Actions.replace('explore')} >
                    <Image source={require('../assets/images/explore.png')} style={[sidebar.home, styles.iconColor]} />  Explore</Button>
          </View>
        </View>
        <View style={[sidebar.line, styles.actionsContainer]}>
          <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={()=>Actions.replace('preferences')}><Image source={require('../assets/images/system.png')} style={[sidebar.home, styles.iconColor]} />Preferences</Button>
          <Button onPress={()=>this.logout()} style={[sidebar.secondaryContainer, styles.textColor]}><Image source={require('../assets/images/logout.png')} style={[sidebar.home, styles.iconColor]} />Logout</Button>
      </View>
    </View>
    );
    }
  }
const sidebar = {
  secondaryContainer:{
    fontSize: 18,
    padding:5,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'sans-serif',
  },
  container:{
    flex:3,
    marginTop:25,
  },
  profile:{
    flex:1,
    borderWidth:1,
    flexDirection:'row',
    borderColor:'white',
    backgroundColor:'white',
    justifyContent:'flex-start',
    alignItems:'center',
    shadowColor:'#000000',
    shadowOffset:{width: 5, height: 5},
    shadowOpacity:0.5,
    shadowRadius:5,
  },
  line:{
    justifyContent:'flex-end',
    alignItems:'center',
    borderTopWidth:3,
  },
  menu:{
    flex:4,
    justifyContent:'flex-start',
    alignItems:'flex-start',
    marginTop:10,
  },
  profileContainer:{
    width:70,
    height:70,
     borderColor:'transparent',
     borderWidth:2,
  },

  home:{
    margin: (Platform.OS === 'ios') ? 15 : 10,
    resizeMode: 'contain',
    width: 30,
    height: 30,
    alignItems:'flex-end',
  },
  profileText:{
    marginLeft: 15,
  },
  profilePicture:{
    width:70,
    height:70,
    borderColor:'transparent',
    borderRadius:35,
    borderWidth:3,
  },
  profileName:{
    color:'grey',
    fontSize:20,
  },
  profileEmail:{
    color:'grey',
    marginTop:5,
  },
  badge:{backgroundColor:'red',
  height:25, width:25,
  borderRadius:12,
  overflow:'hidden',
  flexWrap:'nowrap', flex:0,
  justifyContent:'center',
  alignItems:'center'
},
}

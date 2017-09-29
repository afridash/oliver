import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Platform, Image, AsyncStorage } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'

export default class DrawerContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this._defaultTheme = this._defaultTheme.bind(this)
    this._lightTheme = this._lightTheme.bind(this)
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  async _defaultTheme () {
    if (theme.name !== 'default') {
      theme.active()
      await AsyncStorage.setItem('theme', 'default')
    }
    this.forceUpdate()
  }
  async _lightTheme () {
    if (theme.name !== 'light') {
      theme.active('light')
      await AsyncStorage.setItem('theme', 'light')
    }
    this.forceUpdate()
  }
  static propTypes = {
    name: PropTypes.string,
    sceneStyle: ViewPropTypes.style,
    title: PropTypes.string,
  }

  static contextTypes = {
    drawer: React.PropTypes.object,
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={sidebar.container}>
          <View style={sidebar.profile}>
            <View style={sidebar.profileContainer}>
              <Image resizeMode={'contain'} source={require('../assets/images/profile_1.png')} style={sidebar.profilePicture} />
         </View>
         <View style={sidebar.profileText}>
           <Text style={sidebar.profileName}>Mabel Ogiriki</Text>
           <Text style={sidebar.profileEmail}>OliverApp@gmail.com</Text>
         </View>

          </View>
          <View style={sidebar.menu}>
            <Button style={sidebar.secondaryContainer} onPress={Actions.home}><Image source={require('../assets/images/homeicon.png')} style={sidebar.home} />  Home</Button>
              <Button style={sidebar.secondaryContainer} onPress={Actions.course}><Image source={require('../assets/images/courses.png')} style={sidebar.home} /> Courses</Button>
              <Button style={sidebar.secondaryContainer} onPress={Actions.bookmark}><Image source={require('../assets/images/bookmark.png')} style={sidebar.home} />  Bookmarks</Button>
          </View>

        </View>
        <View style={{flex:1, justifyContent:'flex-end', alignItems:'center', borderTopWidth:3, borderColor:'white'}}>
            <Button style={sidebar.secondaryContainer} onPress={Actions.logout}><Image source={require('../assets/images/logout.png')} style={sidebar.home} />Logout</Button>
        </View>
      </View>
    );
  }
}
const sidebar = {
  secondaryContainer:{
    color:'white',
    fontSize: 25,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'sans-serif',
  },
  container:{
    flex:2,
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
  },

  menu:{
    flex:4,
    //borderWidth:1,
    //borderColor:'yellow',
    justifyContent:'flex-start',
    alignItems:'flex-start',
    marginTop:10,
  },
  profileContainer:{
    width:70,
    height:70,
     borderColor:'grey',
     borderRadius:35,
     borderWidth:2,
  },

  home:{
    margin: 15,
    resizeMode: 'contain',
    width: 30,
    height: 30,
    alignItems:'flex-end',
    tintColor:'white',
  },
  profileText:{
    marginLeft: 15,
  },
  profilePicture:{
    margin:3,
    height:60,
    width:60,
    alignItems:'flex-end',
  },
  profileName:{
    color:'grey',
    fontSize:20,
  },
  profileEmail:{
    color:'grey',
    marginTop:5,
  },
}

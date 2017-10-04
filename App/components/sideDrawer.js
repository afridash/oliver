import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Platform, Image, AsyncStorage,TouchableHighlight } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'

export default class DrawerContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }
  componentWillMount () {
    theme.setRoot(this)
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
          <TouchableHighlight
            onPress={Actions.profile}
            underlayColor={'transparent'}
            style={{flex:1}}>
            <View style={sidebar.profile}>
              <View style={sidebar.profileContainer}>
              <Image resizeMode={'contain'} source={require('../assets/images/profile_1.png')} style={sidebar.profilePicture} />
           </View>
           <View style={sidebar.profileText}>
             <Text style={sidebar.profileName}>Mabel Ogiriki</Text>
             <Text style={sidebar.profileEmail}>OliverApp@gmail.com</Text>
           </View>
            </View>
          </TouchableHighlight>
          <View style={sidebar.menu}>
            <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={Actions.home}><Image source={require('../assets/images/homeicon.png')} style={[sidebar.home, styles.iconColor]} />  Home</Button>
              <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={Actions.courses}><Image source={require('../assets/images/courses.png')} style={[sidebar.home, styles.iconColor]} /> Courses</Button>
              <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={Actions.bookmark} onPress={Actions.bookmarks} ><Image source={require('../assets/images/bookmark.png')} style={[sidebar.home, styles.iconColor]} />  Bookmarks</Button>
          </View>

        </View>
        <View style={{flex:1, justifyContent:'flex-end', alignItems:'center', borderTopWidth:3, borderColor:'white'}}>
          <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={Actions.themes}>Themes</Button>
            <Button style={[sidebar.secondaryContainer, styles.textColor]} onPress={Actions.logout}><Image source={require('../assets/images/logout.png')} style={[sidebar.home, styles.iconColor]} />Logout</Button>
      </View>
    </View>
    );
  }
}
const sidebar = {
  secondaryContainer:{
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
    shadowColor:'#000000',
    shadowOffset:{width: 5, height: 5},
    shadowOpacity:0.5,
    shadowRadius:5,
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

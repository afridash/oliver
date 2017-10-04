import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Platform, Image, AsyncStorage } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'
import NavBar from './navBar'

export default class Profile extends React.Component {
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
        <NavBar title='Profile' />
        <View style={customStyles.container}>
          <View style={customStyles.profile}>
            <View style={customStyles.profileContainer}>
              <Image resizeMode={'contain'} source={require('../assets/images/profile_1.png')} style={customStyles.profilePicture} />

         </View>
          </View>
          <View style={customStyles.menu}>
            <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
            <Text style={[customStyles.text]} > Email</Text>
              <Text style={[customStyles.text]} > Mabel Ogiriki</Text>
          </View>
          <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
              <Text style={[customStyles.text]}>Institution</Text>
                <Text style={[customStyles.text]} > Niger Delta University</Text>
            </View>
            <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
              <Text style={[customStyles.text]} > Username</Text>
                <Text style={[customStyles.text]} > Maybel4life</Text>
            </View>
            <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
              <Text style={[customStyles.text]} > Password</Text>
              <Text style={[customStyles.text]} >  ******** </Text>
              <Image source={require('../assets/images/eye_icon.png')} style={[customStyles.home]} />

          </View>
        </View>
      </View>
    </View>
    );
  }
}
const customStyles = {
  text:{
    fontSize: 18,
    flex:1,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'sans-serif',
  },
  container:{
    flex:2,
    marginTop:15,
  },
  profile:{
    flex:3,
    flexDirection:'row',
    backgroundColor:'cyan',
    justifyContent:'center',
    alignItems:'center',
  },

  menu:{
    flex:4,
    backgroundColor:'white',
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },

  profileContainer:{
    width:100,
    height:100,
    borderColor:'grey',
    borderRadius:50,
    borderWidth:3,

  },

  home:{
    margin: 15,
    resizeMode: 'contain',
    width: 30,
    height: 30,
    alignItems:'flex-end',
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'flex-end',
    flexDirection:'row',
  },
  profileText:{
    marginLeft: 15,

  },
  profilePicture:{
    margin:7,
    height:80,
    width:80,
    alignItems:'center',
  },
}

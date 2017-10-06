import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, ViewPropTypes, Platform, Image, AsyncStorage,TouchableHighlight } from 'react-native';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'
import NavBar from './navBar'

export default class Profile extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      email:'',
      college:'',
      username:'',
      profilePicture:'none'
    }
  }
  async componentWillMount () {
    theme.setRoot(this)
    var email = await AsyncStorage.getItem('email')
    var profilePicture = await AsyncStorage.getItem('pPicture')
    var college = await AsyncStorage.getItem('college')
    var username = await AsyncStorage.getItem('username')
   this.setState({email, college, username,profilePicture})
  }

async componentWillReceiveProps (newprops) {
  var pic = await AsyncStorage.getItem('pPicture')
  this.setState({profilePicture:pic})
}
  readAddCourses() {
    this.data = []
    this.setState({users:[]})
    firebase.database().ref().child('users').child(this.state.userId).once('value', (snapshot)=>{
      snapshot.forEach((course)=>{
        this.data.push({key:course.key, show:false, email:course.val().email, college:course.val().college, username:course.val().username})
        this.setState({data:this.data})
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <NavBar title='Profile' />
        <View style={customStyles.container}>
          <View style={{flex:3, backgroundColor:'transparent'}}>
            <Image resizeMode={'cover'}  source={{uri: this.state.profilePicture}} style={customStyles.profile} blurRadius={20} >
            <View style={{flex:1}}>
              <View style={customStyles.profileContainer}>
                  <Image resizeMode={'cover'}  source={{uri: this.state.profilePicture}} style={customStyles.profilePicture} />
           </View>
           <View style={{flex:0.1, alignItems:'flex-end', justifyContent:'flex-end'}}>
             <View style={{flex:1, flexDirection:'row'}}>
               <TouchableHighlight
                 onPress={Actions.profilePicture}
                  underlayColor={'transparent'}
                 >
                 <Image resizeMode={'contain'}  source={require('../assets/images/pencil.png')} style={[customStyles.pencil, styles.iconColor]} />
               </TouchableHighlight>
             </View>
           </View>
         </View>
       </Image>
          </View>

          <View style={customStyles.menu}>
            <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
            <Text style={[customStyles.text]} > Email</Text>
              <Text style={[customStyles.text]} >{this.state.email} </Text>
          </View>
          <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
              <Text style={[customStyles.text]}>College</Text>
                <Text style={[customStyles.text]} > {this.state.college}</Text>
            </View>
            <View style={{flex:1, borderBottomWidth:1, flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
              <Text style={[customStyles.text]} > Username</Text>
                <Text style={[customStyles.text]} >{this.state.username}</Text>
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
    marginTop:5,

  },
  profile:{
    flex:3,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    borderRadius:5,
  },

  menu:{
    flex:4,
    backgroundColor:'white',
    justifyContent:'flex-start',
    alignItems:'flex-start',
  },

  profileContainer:{
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',

  },
  pencil:{
    flex:1,
    flexDirection:'row',
    resizeMode: 'contain',
    width: 30,
    height: 30,
    right:0,
    alignItems:'flex-end',
    justifyContent:'flex-end',

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
    width:100,
    height:100,
    borderColor:'white',
    borderRadius:50,
    borderWidth:3,
  },
}

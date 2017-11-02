import React,{Component} from 'react'
import {StyleSheet, Image, View,Text, Platform, TouchableHighlight} from 'react-native'
import Button from 'react-native-button';
import theme, { styles } from 'react-native-theme'
import { Actions } from 'react-native-router-flux';
export default class Settings extends Component {
render () {
  return (
    <View style={styles.container}>
      <View style={customStyles.container}>
        <TouchableHighlight
          onPress={Actions.sideDrawer}
          underlayColor={'transparent'}
          style={[{flex:1,borderBottomWidth : (Platform.OS ==='ios') ? 0: 1}, styles.actionsContainer]}>
          <View style={customStyles.profile}>
         <View style={customStyles.profileText}>
           <Button style={[customStyles.profileName]} >
           <Image source={require('../assets/images/arrow_right.png')} style={[customStyles.home, styles.iconColor]} />Preferences</Button>
         </View>
          </View>
        </TouchableHighlight>
        <View style={[customStyles.menu]}>
          <View style={[customStyles.space]}>
            <Button style={[customStyles.secondaryContainer, styles.textColor]} >
            <Image source={require('../assets/images/homeicon.png')} style={[customStyles.home, styles.iconColor]} />Home</Button>
            <View>
            <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
          </View>
        </View>
          <View style={[customStyles.space]}>
            <Button style={[customStyles.secondaryContainer, styles.textColor]} >
              <Image source={require('../assets/images/courses.png')} style={[customStyles.home, styles.iconColor]} />  Find Courses</Button>
              <View>
              <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
            </View>
          </View>
          <View style={[customStyles.space]}>
            <Button style={[customStyles.secondaryContainer, styles.textColor]} >
              <Image source={require('../assets/images/bookmark.png')} style={[customStyles.home, styles.iconColor]} />  Bookmarks</Button>
              <View>
              <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
            </View>
          </View>
          <View style={[customStyles.space]}>
            <Button style={[customStyles.secondaryContainer, styles.textColor, customStyles.separator ]} >
              <Image source={require('../assets/images/recents.png')} style={[customStyles.home, styles.iconColor]} />Recents </Button>
              <View>
              <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
            </View>
          </View>
          <View style={[customStyles.space]}>
                <Button style={[customStyles.secondaryContainer, styles.textColor]} >
                  <Image source={require('../assets/images/explore.png')} style={[customStyles.home, styles.iconColor]} />  About Us</Button>
                  <View>
                  <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
                </View>
              </View>
              <View style={[customStyles.space]}>
                  <Button style={[customStyles.secondaryContainer, styles.textColor]} onPress={()=>Actions.replace('themes')}><Image source={require('../assets/images/themes.png')} style={[customStyles.home, styles.iconColor]} />Themes</Button>
                  <View>
                  <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
                </View>
              </View>
                <View style={[customStyles.space]}>
                  <Button onPress={()=>this.logout()} style={[customStyles.secondaryContainer, styles.textColor]}><Image source={require('../assets/images/logout.png')} style={[customStyles.home, styles.iconColor]} />Logout</Button>
                  <View>
                  <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
                </View>
              </View>
        </View>
      </View>

  </View>
  )
}
}
const customStyles ={
  imageStyle:{
    marginLeft:15,
    alignSelf:'center',
    height:30,
    width:30
  },
  titleInfoStyle:{
    fontSize:16,
    color: '#8e8e93'
  },
  space:{
     flexDirection:'row',
    justifyContent:'space-between',

  },
  listItem:{
    padding:20,
  },
  listText:{
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    margin:5,
  },
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
  icon:{
    marginTop:10,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
  menu:{
    flex:4,
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
    marginLeft: 20,
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
    fontSize:30,
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

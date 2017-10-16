import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Platform,
  FlatList,
  Image,
  TouchableHighlight,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Firebase from '../auth/firebase'
const firebase = require('firebase')

import NavBar from './navBar'
export default class Universities extends Component {
  constructor (props) {
    super (props)
    this.state = {
      universities:[],
      index:0,
    }
    this.ref = firebase.database().ref().child('colleges')
    this.usersRef = firebase.database().ref().child('users')
    this.renderItem = this.renderItem.bind(this)
    this.userKey = ''
  }
  async componentWillMount () {
    theme.setRoot(this)
    this.userKey = await AsyncStorage.getItem('myKey')
    this.getColleges()
  }
  getColleges () {
    this.colleges = []
    this.ref.once('value', (snapshots)=>{
      snapshots.forEach((snapshot)=>{
        this.colleges.push({key:snapshot.key, name:snapshot.val().college})
        this.setState({colleges:this.colleges})
      })
    })
  }
  _onPressItem (index) {
    this.saveCollege(this.state.colleges[this.state.index])
    return Actions.home()
  }
  saveCollege (college) {
    this.usersRef.child(this.userKey).update({collegeId:college.key, college:college.name})
    AsyncStorage.multiSet([['college', college.name], ['collegeId', college.key]])
  }
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <TouchableHighlight onPress={()=>this._onPressItem(index)} underlayColor={'transparent'} style={{flex:1}}>
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
        <Text  style={[customStyles.listText, styles.textColor]}>{item.name}</Text>
      <Image source={require('../assets/images/arrow_right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>
      </View>
      </TouchableHighlight>
    </View>
      )
   }
  render () {
    return (
      <View style={styles.container}>
        <View style={customStyles.title}><Text style={[customStyles.header, styles.header]}>Pick Your University</Text></View>
        <View style={styles.secondaryContainer} >
          <View style={{flex:6, flexDirection:'row', marginTop:30}}>
            <FlatList
              data={this.state.colleges}
              ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
              renderItem={this.renderItem}
         />
          </View>
        </View>
      </View>
    )
  }
}
const customStyles = StyleSheet.create({
  container:{
    flex:10,
    margin:5,
    justifyContent:'center',
    alignItems:'flex-start',
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  listItem:{
    padding:20,
  },
  listText:{
    fontSize:20,
    fontWeight:'500',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    margin:5,
  },
  actionsContainer:{
    borderColor:'white',
    borderWidth:1,
    borderRadius:10,
    overflow:'hidden',
    margin:5,
    marginLeft:20,
    marginRight:20
  },
  actions:{
    padding:15,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  header:{
    marginTop:50,
    fontSize:30,
    padding:20,
    textDecorationLine:'underline',
    textDecorationColor:'white',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
    color:'#fafafa',
  },
  title: {
    flex:0.5,
    justifyContent:'center',
    alignItems:'center',
  },
  icon:{
    marginTop:10,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
})

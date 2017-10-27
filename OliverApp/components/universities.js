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
    this.picture ='https://firebasestorage.googleapis.com/v0/b/oliver-f5285.appspot.com/o/users%2Fprofile%2Fuserprofile.png?alt=media&token=e96bc455-8477-46db-a3a2-05b4a1031fe8'
  }
  async componentWillMount () {
    theme.setRoot(this)
    this.userKey = await AsyncStorage.getItem('myKey')
    this.getColleges()
  }
  async createAccount (college) {
    var p=false;
    await firebase.auth().createUserWithEmailAndPassword(this.props.email, this.props.password).catch(function(error){
      Alert.alert(error.message)
      p=true
    });
    if(!p){
      var user = firebase.auth().currentUser
         user.updateProfile({
          displayName: this.props.firstName + " "+this.props.lastName,
          photoURL:this.picture
        }).then(function() {
          // Update successful.
        }, function(error) {
          //console.log(error)
        })
        user.sendEmailVerification().then(function() {
            //Email sent
          }).catch(function(error) {
            // An error happened.
          })
     this.saveUserInfo(user.uid,this.props.email, this.props.firstName,this.props.lastName, this.props.username, college)
      this.saveLocalData(user.uid, college)
      return Actions.reset('drawer')
      this.setState({isLoading:false})
    }else{
      this.setState({isLoading:false})
    }
  }
  saveUserInfo(userKey, email, firstName, lastName, username, college){
    this.usersRef.child(userKey).set({
      firstName: firstName,
      lastName:lastName,
      email: email,
      username : username,
      userKey:userKey,
      profilePicture:this.picture,
      collegeId:college.key,
      college:college.name
      })
      firebase.database().ref().child('student_stats').child(userKey).child('signed_up').set(firebase.database.ServerValue.TIMESTAMP)
  }
  async saveLocalData(userID, college){
    await AsyncStorage.multiSet([["email", this.props.email],
                                 ['name', this.props.firstName+" "+this.props.lastName],
                                  ['myKey', userID],
                                  ['currentUser', userID],
                                  ['pPicture',this.picture],
                                  ['username',this.props.username],
                                  ['college', college.name],
                                  ['collegeId', college.key]
                                ])
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
  async _onPressItem (index) {
    if (this.props.calling){
      var lincoln = '-KxDQcHjbMhp6mTgkqnK'
      var verified = await AsyncStorage.getItem('verified')
      if (this.state.colleges[index].key === lincoln) {
        if (verified !== null && verified !== '1') {
            await this.saveCollege(this.state.colleges[index])
            alert ("LINCOLN VERFIED")
            alert(verified)
        }
      }else {
        await this.saveCollege(this.state.colleges[index])
      }
      return Actions.replace('profile')
    }
    else {
      this.createAccount(this.state.colleges[index])
    }
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

/*
*@author Richard Igbiriki October 6, 2017
*/
import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Platform,
  FlatList,
  Image,
  TextInput,
  RefreshControl,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import * as timestamp from '../auth/timestamp'

import NavBar from './navBar'
export default class Explore extends Component {
  constructor (props) {
    super (props)
    this.state = {
      activities:[],
      index:0,
      isLoading:true,
      noActivity:false,
      refreshing:false,
    }
    this.renderItem = this.renderItem.bind(this)
    this.ref = firebase.database().ref().child('explore')
  }
  async componentWillMount () {
    //Set theme styles
    theme.setRoot(this)
    //Retrieve user key
    var key = await AsyncStorage.getItem('collegeId')
    this.setState({collegeId:key})
    //Start component lifecycle with call to loading questions stored offline
    this.retrieveActivitiesOnline()
  }
  retrieveActivitiesOnline () {
    this.data = []
    this.setState({refreshing:true,isLoading:false,noActivity:false})
    this.ref.child(this.state.collegeId).limitToFirst(100).once('value',(snapshot)=>{
      if (snapshot.val()  !== null ) this.setState({refreshing:false, noActivity:false,isLoading:false})
      else this.setState({refreshing:false, noActivity:true,isLoading:false})
      snapshot.forEach((snap)=>{
          this.data.push({key:snap.key,courseId:snap.val().courseId, code:snap.val().courseCode, title:snap.val().course,percentage:snap.val().percentage,
                          createdAt:snap.val().createdAt, message:snap.val().message, username:snap.val().username, profilePicture:snap.val().profilePicture})
          this.setState({activities:this.data})
      })
    })
  }
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <View style={customStyles.secondaryContainer}>
        <Image source={{uri:item.profilePicture}} resizeMode={'cover'} style={customStyles.profilePicture} />
        <View style={customStyles.usernameContainer}>
          <Text style={[styles.textColor, customStyles.username]}>{item.username}</Text>
        </View>
        <View>
          <Text style={[styles.textColor, customStyles.timestamp]}>{timestamp.timeSince(item.createdAt)}</Text>
        </View>
      </View>
       <View style={{flex:1, margin:5, padding:10}}>
        <Text style={[styles.textColor, customStyles.message]}>{item.message}</Text>
        <Text style={[styles.textColor, customStyles.message]}>{item.percentage}% in {item.title} ({item.code})</Text>
      </View>
      <View>
        <Button
          containerStyle={[styles.secondaryButton, customStyles.secondaryButton]}
          style={customStyles.addButton}
          styleDisabled={{color: 'red'}}
          onPress={()=>Actions.start_exam({courseId:item.courseId, courseCode:item.code, course:item.title})}>
          Start
        </Button>
      </View>
    </View>
      )
   }
  renderFlatList () {
     return (
       <FlatList
         data={this.state.activities}
         ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
         renderItem={this.renderItem}
         refreshControl={
          <RefreshControl
          refreshing={this.state.refreshing}
             onRefresh={this.retrieveActivitiesOnline.bind(this)}
         />
        }
    />
     )
   }
   renderHeader () {
     return  (
       <View style={customStyles.inputContainer} >
         <TextInput
           style={customStyles.input}
           placeholder='Search'
           onChangeText={(text) => { this.searchcourses(text) }}
         />
       </View>
     )
   }
   searchcourses (text) {
     /*
     * Filter user explore posts by username or course title
     * If no result, update the view
     */
     var clone = this.data
     this.result = clone.filter ((activity) => { return activity.username.toLowerCase().includes(text.toLowerCase()) === true || activity.title.toLowerCase().includes(text.toLowerCase()) === true })
     if (this.result.length > 0)
     this.setState({activities:this.result, noSearchResult:false})
     else this.setState({noSearchResult:true})
   }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='Explore'/>
        <View style={styles.secondaryContainer} >
          <View style={{flex:1, flexDirection:'row'}}>{this.renderHeader()}</View>
          <View style={{flex:6, flexDirection:'row'}}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else if (this.state.noActivity) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={[customStyles.listText, styles.textColor]}> No Explorers</Text></View>)
                else if (this.state.noSearchResult) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}> :( Nothing Found</Text></View>)
              else return this.renderFlatList()
            })()
          }
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
  secondaryContainer:{
    flex:1,
    flexDirection:'row',
     padding:3
   },
  listItem:{
    padding:10,
  },
  timestamp:{
    fontSize:12,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  usernameContainer:{
    flex:1,
    alignItems:'flex-start',
    justifyContent:'center',
  },
  profilePicture:{
    width:50,
    height:50,
    borderRadius:25,
    borderColor:'white',
    borderWidth:1,
  },
  username:{
    marginLeft:10,
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  message:{
    marginLeft:5,
    fontSize:16,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    padding:5
  },
  actions:{
    padding:15,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    },

  icon:{
    marginTop:20,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
  input: {
    height: 50,
    flex: 1,
    fontSize: 16,
    color:'black',
    backgroundColor: '#fafafa',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    borderRadius: 10,
    textAlign: 'center'
  },
  inputContainer: {
    flex: 1,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  addButton : {
    fontSize: 20,
    color: 'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  secondaryButton: {
    padding:10,
    flex:1,
    height:45,
    margin:1,
    overflow:'hidden',
    borderRadius:10,
  },
})
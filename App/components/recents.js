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
  RefreshControl,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
import Firebase from '../auth/firebase'
const firebase = require('firebase')
import * as timestamp from '../auth/timestamp'

import NavBar from './navBar'
export default class Activity extends Component {
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
    this.ref = firebase.database().ref().child('activities')
  }
  async componentWillMount () {
    //Set theme styles
    theme.setRoot(this)
    //Retrieve user key
    var key = await AsyncStorage.getItem('myKey')
    this.setState({userId:key})
    //Start component lifecycle with call to loading questions stored offline
    this.retrieveActivitiesOffline()
  }
  async retrieveActivitiesOffline () {
    //Retrieved and parse stored data in AsyncStorage
    //If no such data, read questions from firebase, then store them locally
    var activities = []
    var stored = await AsyncStorage.getItem('activities')
    if (stored !== null && stored !== '1') activities = JSON.parse(stored)
    if (activities.length === 0 || activities === null) {
      this.retrieveActivitiesOnline ()
    }else{
      this.data = activities
      this.setState({activities:activities, noActivity:false,isLoading:false})
    }
  }
  retrieveActivitiesOnline () {
    this.data = []
    this.setState({refreshing:true,isLoading:false,noActivity:false})
    this.ref.child(this.state.userId).once('value',(snapshot)=>{
      if (snapshot.val()  !== null ) this.setState({refreshing:false, noActivity:false,isLoading:false})
      else this.setState({refreshing:false, noActivity:true,isLoading:false})
      snapshot.forEach((snap)=>{
          this.data.push({key:snap.key,code:snap.val().code, title:snap.val().title,total:snap.val().total,
                          score:snap.val().score, createdAt:snap.val().createdAt, show:false, percentage:snap.val().percentage})
          this.setState({activities:this.data})
          AsyncStorage.setItem('activities', JSON.stringify(this.data))
      })
    })

  }
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
        <Text style={[customStyles.listText, styles.textColor]}>{item.title}</Text>
        <Text style={[customStyles.listText, styles.textColor]}>{item.code}</Text>
      </View>
       <View style={{flex:1}}>
        <View style={customStyles.actionsContainer}>
        <Text style={[customStyles.actions, styles.textColor]}>Score: {item.score} out of {item.total}</Text>
        <Text style={[customStyles.actions, styles.textColor]}>Percentage: {item.percentage}%</Text>
      </View>
      <View style={{flexDirection:'row', alignItems:'flex-end',justifyContent:'flex-end'}}>
        <Text style={[customStyles.actions, styles.textColor]}>{timestamp.timeSince(item.createdAt)}</Text>
      </View>
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
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='Activities'/>
        <View style={styles.secondaryContainer} >
          <View style={{flex:6, flexDirection:'row'}}>
            {(()=>{
              if (this.state.isLoading) return (
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                  <Text style={[customStyles.listText, styles.textColor]}>Loading...</Text></View>
              )
              else if (this.state.noActivity) return (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                <Text style={[customStyles.listText, styles.textColor]}> No Recent Activity</Text></View>)
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
  listItem:{
    padding:20,
  },
  listText:{
    fontSize:20,
    fontWeight:'500',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
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
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    },

  icon:{
    marginTop:20,
    resizeMode: 'contain',
    width: 20,
    height: 20,
    alignItems:'flex-end',
  },
})

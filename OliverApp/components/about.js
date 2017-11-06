import React,{Component} from 'react'
import Firebase from '../auth/firebase'
import {View, Text, Platform, ScrollView} from 'react-native';
import NavBar from './navBar'
import theme, { styles } from 'react-native-theme'
const firebase = require('firebase')
export default class About extends Component {
  render() {
    return (
      <View style={styles.container}>
        <NavBar backButton={true} title='Contact' />
        <ScrollView style={{flex:1}}>
          <Text style={[styles.textColor, customStyles.header]}>About </Text>
          <Text style={[styles.textColor, customStyles.body]}> We at Afridash are happy to introduce Oliver -- your one stop shop for exam preparation on your campus. With your help, we have built the perfect app to keep track of your courses, and provide you with a smooth experience to practice past questions from those courses. We simulated a practice exam with the objectives, and provided you a way to study theory questions.
        </Text>
        <Text style={[styles.textColor, customStyles.body, customStyles.header]}>Features</Text>
        <Text style={[styles.textColor, customStyles.body, customStyles.header]}>Offline Capabilities</Text>
        <Text style={[styles.textColor, customStyles.body]}>Saving you from having to be online to retrieve questions and courses was one of our major focus, and we did it! You can view courses, bookmarks, questions, and activities offline...once you have downloaded them the first time.</Text>
        <Text style={[styles.textColor, customStyles.body, customStyles.header]}>Activities</Text>
        <Text style={[styles.textColor, customStyles.body]}>We help you keep track of your activities in practice exams. Recent activities is our way of saying...great job!</Text>
        <Text style={[styles.textColor, customStyles.body, customStyles.header]}>Explore</Text>
        <Text style={[styles.textColor, customStyles.body]}>You did great, you want others to be inspired, or challenged? Share to EXPLORE. Users across your campus will be able see your performance and be challenged to do the same. On EXPLORE, you can search for other users to see what they've shared, or search for a course to see all EXPLORERS from that course.</Text>
        <Text style={[styles.textColor, customStyles.body, customStyles.header]}>Exams</Text>
        <Text style={[styles.textColor, customStyles.body]}>We have developed a practice exam environment that randomizes questions so you are never bored of practicing. The more questions we have, the more fun and random your experience will be. And we strive to add more questions everyday!</Text>
        <Text style={[styles.textColor, customStyles.body, customStyles.header]}>Theme</Text>
        <Text style={[styles.textColor, customStyles.body]}>Want a more customizable interface that fits your every mood? Dont worry we also have that covered. Guess what? you also get to change it as many times as you want for FREE!</Text>
        <Text style={[styles.textColor, customStyles.body, customStyles.header]}>Bookmarks</Text>
        <Text style={[styles.textColor, customStyles.body]}>Seen a question you want to remember later? Just Bookmark IT! and when on the rush with no internet you can also view those specially bookmarked questions OFFLINE too!</Text>
      </ScrollView>
      <View style={{justifyContent:'center', alignItems:'center'}}>
        <Text style={[styles.textColor, customStyles.footer]}>Version 2.0.3 </Text>
      </View>
      </View>
    );
  }
}
const customStyles={
  header:{
    alignSelf:'center',
    margin:10,
    padding:10,
    fontSize:20,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  body:{
    marginLeft:10,
    marginRight:10,
    padding:10,
    fontSize:15,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  header:{
    fontFamily:20,
    marginLeft:10,
    marginRight:10,
    padding:10,
    fontWeight:'500',
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
  footer:{
    margin:10,
    padding:10,
    fontSize:15,
    fontFamily:(Platform.OS === 'ios') ? 'verdana' : 'serif',
  },
}

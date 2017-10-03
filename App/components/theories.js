import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Platform,
  FlatList,
  Image,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'

import NavBar from './navBar'
export default class Theories extends Component {
  constructor (props) {
    super (props)
    this.state = {
      questions:[{question:'What is the definition of an atom? Where in the world is mount everest found? Who discovered the river nile?', answer:'I do not fully understand the question. Please rephrase'},
                {question:'What is the definition of an atom? ',  answer:'Hmm, I see what\s happening here. You\'re face to face with greatness and it\'s strange! '},
              {question:'Where in the world is mount everest found? Who discovered the river nile?', answer:'Lol ok, since that\'s how we want to play this game'},
            {question:'What is the definition of an atom? Who discovered the river nile?', answer:'Finally, we can say we are done! Do not have to answer any dumb questions! '}],
      index:0,
      title:'Course Code',
    }
    this.renderItem = this.renderItem.bind(this)
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  _onPressItem (index) {
    var clone = this.state.questions
    clone[index].show = !clone[index].show
    this.setState({questions:clone})
  }
  renderItem({ item, index }) {
   return (
     <View
      style={customStyles.listItem}
    >
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
        <Text onPress={()=>this._onPressItem(index)} style={[customStyles.listText, styles.textColor]}>{index+1} {item.question}</Text>
        {!item.show ? <Image source={require('../assets/images/right.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/> : <Image source={require('../assets/images/left.png')} style={[styles.iconColor, customStyles.icon]} resizeMode={'contain'}/>}
      </View>
      {item.show && <View style={{flex:1}}>
        <View style={customStyles.actionsContainer}>
        <Text style={[customStyles.actions, styles.textColor]}>{item.answer}</Text>
      </View>
      </View>
    }
    </View>
      )
   }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title='Course Code' />
        <View style={styles.secondaryContainer} >
          <View style={{flex:6, flexDirection:'row'}}>
            <FlatList
              data={this.state.questions}
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

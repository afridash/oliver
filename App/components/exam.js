import React, {Component} from 'react'
import {
  View,
  Text,
  AsyncStorage,
  Platform,
  Image,
  Modal,
  FlatList,
  TouchableHighlight,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'

import NavBar from './navBar'
export default class Exams extends Component {
  constructor (props) {
    super (props)
    this.state = {
      questions:[{question:'What is the definition of an atom? Where in the world is mount everest found? Who discovered the river nile?', optionA:'Angiosperms', optionB:'Gymnosperms', optionC:'Monocotyledons', optionD:'Dicotyledons', selected:'', answer:'B'},
                {question:'What is the definition of an atom? ', optionA:'Angio', optionB:'Gymno', optionC:'Mono', optionD:'Dico', selected:'', answer:'B'},
              {question:'Where in the world is mount everest found? Who discovered the river nile?', optionA:'None', optionB:'True', optionC:'Maybe', optionD:'All', selected:'', answer:'B'},
            {question:'What is the definition of an atom? Who discovered the river nile?', optionA:'Lagos', optionB:'Kano', optionC:'Kaduna', optionD:'Abuja', selected:'', answer:'B'}],
      index:0,
      title:'Course Code',
      finished:false,
      modalVisible:false,
    }
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  restart () {
    this.setState({index:0, finished:false})
  }
  selectOption (option) {
    var clone = this.state.questions
    clone[this.state.index].selected = option
    this.setState({questions:clone})
  }
  showNextQuestion () {
    if (this.state.index < this.state.questions.length - 1)
    this.setState({index:this.state.index + 1})
    else this.setState(prevState =>({finished:!prevState.finished}))
  }
  showPrevQuestion () {
    if (this.state.index > 0)
    this.setState({index:this.state.index - 1})
  }
  showQuestion (){
    var question = this.state.questions[this.state.index]
    return (
      <View style={{flex:1}}>
        <View style={{flex:1, margin:10, padding:10}}>
          <Text style={[customStyles.question, styles.textColor]}>{question.question}</Text>
          <View style={[customStyles.actionsContainer]}>
            <Text onPress={()=>this.setState({modalVisible:!this.state.modalVisible})} style={[customStyles.actions, styles.textColor]}>Show Summary</Text>
          </View>
        </View>
        <View style={{flex:1.5, margin:20,}}>
          <View style={[customStyles.actionsContainer,{backgroundColor:question.selected === 'A' ? '#607d8b' : 'transparent'}]}>
          <Text onPress={()=>this.selectOption('A')} style={[customStyles.actions, styles.textColor]}>{question.optionA}</Text>
        </View>
        <View style={[customStyles.actionsContainer, {backgroundColor:question.selected === 'B' ? '#607d8b' : 'transparent'}]}>
          <Text onPress={()=>this.selectOption('B')} style={[customStyles.actions, styles.textColor]}>{question.optionB}</Text>
        </View>
        <View style={[customStyles.actionsContainer, {backgroundColor:question.selected === 'C' ? '#607d8b' : 'transparent'}]}>
          <Text onPress={()=>this.selectOption('C')} style={[customStyles.actions, styles.textColor]}>{question.optionC}</Text>
        </View>
        <View style={[customStyles.actionsContainer, {backgroundColor:question.selected === 'D' ? '#607d8b' : 'transparent'}]}>
          <Text onPress={()=>this.selectOption('D')} style={[customStyles.actions, styles.textColor]}>{question.optionD}</Text>
        </View>
        </View>
      </View>
    )
  }
  showSummary () {
    return (
      <View style={{flex:1}}>
        <View style={{flex:0.5, margin:10, padding:10}}>
          <Text style={[customStyles.result, styles.textColor]}>Result</Text>
        </View>
        <View style={{flex:1.5, margin:20,}}>
        <Text style={[customStyles.result, styles.textColor]}>Score: 3/4</Text>
        <View style={[customStyles.actionsContainer]}>
          <Text onPress={()=>this.setState({modalVisible:!this.state.modalVisible})} style={[customStyles.actions, styles.textColor]}>Show Summary</Text>
        </View>
        </View>
      </View>
    )
  }
  _keyExtractor = (item, index) => item.id
  renderItem({ item, index }) {
   return (
     <View
       key={item.id}
      style={customStyles.listItem}
    >
      <Text style={[customStyles.listText, styles.textColor]}>{index+1}. {item.question}</Text>
      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between'}}>
        <View style={customStyles.actionsContainer}>
        <Text style={[customStyles.actions, styles.textColor]}>Suggested Answer: {item.answer}</Text>
      </View>
      <View style={customStyles.actionsContainer}>
        <Text style={[customStyles.actions, styles.textColor]}>Selected: {item.selected}</Text>
      </View>
      </View>
    </View>
      )
   }
  showSummaryModal () {
    return  (
      <Modal
      animationType={"slide"}
      transparent={false}
      visible={this.state.modalVisible}
      onRequestClose={() => {alert("Modal has been closed.")}}
      >
        <View style={styles.container}>
          <View style={{flex:1, marginTop:30, borderTopLeftRadius:10,borderTopRightRadius:10, borderTopWidth:2, borderColor:'grey', overflow:'hidden', padding:5}}>
            <View style={{flex:1,justifyContent:'flex-start',alignItems:'flex-end'}}>
              <TouchableHighlight onPress={() =>
                this.setState({modalVisible:!this.state.modalVisible})}>
                <Text style={[styles.textColor,{padding:1, fontSize:20, fontFamily:'Didot'}]}>Done</Text>
              </TouchableHighlight>
            </View>
            <View style={{flex:12}}>
              <FlatList
                data={this.state.questions}
                ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
                renderItem={this.renderItem}
                keyExtractor={this._keyExtractor}
              />
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  render () {
    return (
      <View style={styles.container}>
        <NavBar title={this.state.title} progress={this.state.index+1 + '/' + this.state.questions.length} />
        {!this.state.finished &&
          <View style={{flex:1}}>
            {this.showQuestion()}
            <View style={[{flex:0.1,flexDirection:'row', justifyContent:'space-between', alignItems:'center'}, styles.progress]}>
              <Button onPress={()=>this.showPrevQuestion()}  ><Image source={require('../assets/images/left.png')} style={[customStyles.icons, styles.iconColor]} /></Button>
              <Button onPress={Actions.home}><Image source={require('../assets/images/cancel.png')} style={[styles.iconColor, {width:25,height:25, padding:10}]} resizeMode={'contain'} /></Button>
              <Button onPress={()=>this.showNextQuestion()} ><Image source={require('../assets/images/right.png')} style={[customStyles.icons, styles.iconColor]} /></Button>
            </View>
          </View>
        }
        {this.state.finished &&
          <View style={{flex:1}}>
            {this.showSummary()}
            <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
              <Button
                containerStyle={styles.secondaryButton}
                style={customStyles.addButton}
                styleDisabled={{color: 'red'}}
                onPress={()=>this.restart()}>
                Another One!
              </Button>
            </View>
          </View>
        }
        {this.showSummaryModal()}
      </View>
    )
  }
}
const customStyles = {
  question:{
    fontSize:20,
    padding:10,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  actionsContainer:{
    borderColor:'white',
    borderWidth:1,
    borderRadius:10,
    overflow:'hidden',
    margin:5,
    marginLeft:20,
    marginRight:20,
  },
  actions:{
    padding:15,
    fontSize:18,
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    },
    icons:{
      margin: 10,
      resizeMode: 'contain',
      width: 40,
      height: 40,
      alignItems:'flex-end',
    },
    separator:{
      height:1,
      backgroundColor:'grey',
    },
    buttonContainer:{
      flex:0.1,
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      margin:5,
    },
    addButton : {
      fontSize: 20,
      color: 'white',
      fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
    },
    result:{
      fontSize:30,
      fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
      padding:10,
      fontWeight:'bold',
      textAlign:'center',
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
}

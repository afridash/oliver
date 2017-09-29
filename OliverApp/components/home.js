import React, {Component} from 'react'
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  FlatList,
  Platform,
} from 'react-native'
import {Actions} from 'react-native-router-flux'
import theme, { styles } from 'react-native-theme'
import Button from 'react-native-button'
export default class Home extends Component {
  constructor (props) {
    super (props)
    this.state = {
      data:[{key:'1',show:false, name:"Richard Igbiriki",}, {key:'2',show:false, name:"Richard Igbiriki",}, {key:'3',show:false, name:"Richard Igbiriki",}, {key:'4',show:false, name:"Richard Igbiriki",}]
    }
  }
  componentWillMount () {
    theme.setRoot(this)
  }
  _onPressItem (item) {
    var key
   this.selected = this.state.data.filter((d,index)=> {
     if (item.key === d.key){
       key = index
       return true
     }
  })
  var clone = this.state.data
  clone[key].show = !clone[key].show
  this.setState({data:clone})
}
  _renderItem = ({item}) => (
    <View
      id={item.id}
      style={customStyles.listItem}
    //onPressItem={this._onPressItem}
    //selected={!!this.state.selected.get(item.id)}
    >
      <Text onPress={()=>this._onPressItem(item)} style={customStyles.listText}>{item.key} {item.name}</Text>
      <View style={{display: item.show ? 'flex' : 'none'}}>
        <Text>Study Theory Questions</Text>
        <Text>Practice Exam</Text>
        <Text>Bookmark</Text>
      </View>
    </View>
  )
  render () {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
        />
        <View style={{flex:1}} >
          <View style={customStyles.container}>
            <FlatList
              ItemSeparatorComponent={()=><View style={customStyles.separator}></View>}
              data={this.state.data}
              renderItem={this._renderItem}
            />
          </View>
          <View style={[styles.buttonContainer,customStyles.buttonContainer]}>
            <Button
              containerStyle={styles.secondaryButton}
              style={customStyles.addButton}
              styleDisabled={{color: 'red'}}
              onPress={() => this._handlePress()}>
              Add Course
            </Button>
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
    flexDirection:'row',
  },
  separator:{
    height:1,
    backgroundColor:'grey',
  },
  buttonContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    borderTopWidth:3,
  },
  addButton : {
    fontSize: 20,
    color: 'white',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
  listItem:{
    padding:20,
  },
  listText:{
    fontSize:20,
    color:'white',
    fontWeight:'500',
    fontFamily:(Platform.OS === 'ios') ? 'Didot' : 'serif',
  },
})

import React, {Component} from 'react'
import {View, Text, Image, Alert} from 'react-native'
var randomImages = [
    require('../assets/images/notepad.png'),
    require('../assets/images/simulated.png'),
    require('../assets/images/exam1.png'),
];
export default class Slider extends Component {
  constructor (props){
    super (props)
    this.state = {
      count:0,
      images:randomImages,
      image:randomImages[0],
      informations:['Find courses from your institution', 'Study past questions from your institution', 'Practice simulated exams and bookmark great questions'],
      information:'Find courses from your institution'
    }
    this.images = []
    this.changeImage = this.changeImage.bind(this)
    this.holder
  }
  componentDidMount () {
    this.holder =  setInterval(this.changeImage, 3000);
  }
  changeImage () {
    var image = this.state.images[this.state.count]
    var info =  this.state.informations[this.state.count]
    this.setState({image:image, count:this.state.count+1, information:info})
    if (this.state.count > 2) {
      this.setState({count:0})
    }
  }
  componentWillUnmount () {
    clearInterval(this.holder)
  }
  render () {
    return (
      <View style={this.props.style}>
        <Image
       style={this.props.logoStyle}
       source={this.state.image}
       resizeMode={'contain'}
     />
     <Text style={this.props.informationStyle}>{this.state.information}</Text>
   </View>
    )
  }
}

import React, { Component } from 'react'
import oliver from './oliver.jpg'
import './App.css'
import Home from './components/home'
import About from './components/about'
import Features from './components/features'
import Screenshots from './components/screenshots'
import Review from './components/review'
import Downloads from './components/downloads'
import Subscribe from './components/subscribe'
import CopyRight from './components/copyright'
export default class App extends Component {
  render() {
    return (
      <div>
        <Home></Home>
        <About></About>
        <Features></Features>
        <Screenshots></Screenshots>
        <Review></Review>
        <Downloads></Downloads>
        <Subscribe></Subscribe>
        <CopyRight></CopyRight>

      </div>
    );
  }
}

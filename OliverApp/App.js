import React from 'react';
import { StyleSheet, AsyncStorage, NetInfo} from 'react-native';
import {
  Scene,
  Router,
  Actions,
  Reducer,
  ActionConst,
  Overlay,
  Tabs,
  Modal,
  Drawer,
  Stack,
  Lightbox,
} from 'react-native-router-flux';
import theme, { styles } from 'react-native-theme'
import Index from './components/index'
import Login from './components/login'
import SignUp from './components/signup'
import Reset from './components/reset'
import Home from './components/home'
import Add from './components/add'
import Profile from './components/profile'
import Exams from './components/exam'
import Bookmarks from './components/bookmarks'
import Theories from './components/theories'
import Courses from './components/courses'
import Universities from './components/universities'
import * as main from './assets/styles/main.js'
import NavBar from './components/navBar'
import DrawerContent from './components/sideDrawer'
import Themes from './components/themes'
import Recents from './components/recents'
import ViewFull from './components/view'
import Explore from './components/explore'
import Theory from './components/viewTheory'
import Notifications from './components/notifications'
import Objectives from './components/objectives'
import VerifyPin from './components/verification'
import Preferences from './components/preferences'
import MenuIcon from './assets/images/menu_burger.png';

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    return defaultReducer(state, action);
  };
};
export default class App extends React.Component {
  constructor (props) {
    super (props)
    this.handleEnter = this.handleEnter.bind(this)
  }
  async componentWillMount () {
    theme.setRoot(this)
    var activeTheme = await AsyncStorage.getItem('theme')
    if (activeTheme !== null) {
      if (activeTheme !== 'default') theme.active(activeTheme)
      else {
        theme.active()
      }
    }else {
      theme.active()
    }
    NetInfo.isConnected.addEventListener('connectionChange', this._handleConnectionChange);
  }
  _handleConnectionChange = (isConnected) => {
    AsyncStorage.setItem('status', isConnected.toString())
  }
  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this._handleConnectionChange)
  }
  async handleEnter () {
    try {
      var key = await AsyncStorage.getItem('myKey')
      if (key === null) return Actions.reset('index')
    } catch (e) {
      return Actions.reset('index')
    }
  }
  render() {
    return (
      <Router
        createReducer={reducerCreate}
        SceneStyle={styles}
        >
        <Overlay>
            <Lightbox>
              <Stack
                hideNavBar
                key="root"
              >
                <Scene key='index' component={Index} />
                <Scene key='login' component={Login}  />
                <Scene key='signup' component={SignUp} />
                <Scene key='universities' component={Universities}  />
                <Scene key='resetpassword'  component={Reset} />
                <Drawer
                  initial
                  hideNavBar
                  key="drawer"
                  contentComponent={DrawerContent}
                  drawerImage={MenuIcon}
                >
                  {/*
                    Wrapper Scene needed to fix a bug where the tabs would
                    reload as a modal ontop of itself
                  */}

                  <Scene hideNavBar>
                    <Scene key="home" initial component={Home} />
                      <Scene key="start_exam" component={Exams}  />
                      <Scene key="add_course" component={Add} />
                      <Scene key="themes" component={Themes} />
                      <Scene key="bookmarks" component={Bookmarks} />
                      <Scene key="theory" component={Theories} />
                      <Scene key="objectives" component={Objectives} />
                      <Scene key="courses" component={Courses} />
                      <Scene key="profile" component={Profile} />
                      <Scene key="recents" component={Recents} />
                      <Scene key="view" component={ViewFull} />
                      <Scene key="explore" component={Explore} />
                      <Scene key="viewTheory" component={Theory} />
                      <Scene key="notifications" component={Notifications} />
                      <Scene key="getCode" component={VerifyPin} />
                      <Scene key="preferences" component={Preferences} />
                  </Scene>
                </Drawer>
              </Stack>
            </Lightbox>
        </Overlay>
      </Router>
    );
  }
}
const customStyles = StyleSheet.create({
  navBarTitle:{
    color:'#FFFFFF'
  },
  barButtonTextStyle:{
      color:'#FFFFFF'
  },
  barButtonIconStyle:{
      tintColor:'rgb(255,255,255)'
  },
  backButtonTextStyle: {
    tintColor: 'white'
  },
})

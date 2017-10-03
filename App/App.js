import React from 'react';
import { StyleSheet, AsyncStorage} from 'react-native';
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
import Exams from './components/exam'
import Bookmarks from './components/bookmarks'
import Theories from './components/theories'
import Courses from './components/courses'
import * as main from './assets/styles/main.js'
import NavBar from './components/navBar'
import DrawerContent from './components/sideDrawer'
import Themes from './components/themes'
import MenuIcon from './assets/images/menu_burger.png';

const reducerCreate = params => {
  const defaultReducer = new Reducer(params);
  return (state, action) => {
    return defaultReducer(state, action);
  };
};
export default class App extends React.Component {

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
                <Scene key='resetpassword'  component={Reset} />
                <Drawer
                  hideNavBar
                  key="drawer"
                  initial
                  contentComponent={DrawerContent}
                  drawerImage={MenuIcon}
                >
                  {/*
                    Wrapper Scene needed to fix a bug where the tabs would
                    reload as a modal ontop of itself
                  */}

                  <Scene hideNavBar>
                    <Scene key="home" component={Home}  />
                      <Scene key="start_exam"   component={Exams}  />
                      <Scene key="add_course" initial component={Add} />
                      <Scene key="themes" component={Themes} />
                      <Scene key="bookmarks" component={Bookmarks} />
                      <Scene key="theory" component={Theories} />
                      <Scene key="courses" component={Courses} />
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

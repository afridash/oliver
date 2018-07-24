import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css'
import './index.css';
import {AddNew} from './components/AddNew'
import {AddQuestions} from './components/AddQuestions'
import {View} from './components/View'
import {Stats} from './components/Stats'
import NavBar from './components/navBar'
import Policy from './components/policy'
import Home from './components/App'
import Dashboard from './components/AppHome'
import Practice from './components/Practice'
import Bookmarks from './components/bookmarks'
import Explore from './components/explore'
import Objective from './components/objective'
import Theories from './components/theories'
import PracticeSummary from './components/PracticeSummary'
import Login from './components/Login'
import RecentActivities from './components/recentActivities'
import Notifications from './components/notifications'
import ExploreView from './components/exploreView'
import Notification from './components/notification'
import Students from './components/students'
import Student from './components/student'
import Theory from './components/theory'
import Courses from './components/courses'
import Search from './components/search'
import Leaderboard from './components/leaderboard'
import Social from './components/social'
import Post from './components/post'
import Followers from './components/followers'
import Profile from './components/profile'
import App from './App'
import Pay from './components/pay'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter >
  <div>
    <Switch>
       <Route exact path={"/"} component={App}/>
         <Route exact path={"/pay"} component={Pay} />
        <Route exact path={"/questions"} component={Home} />
        <Route exact path={"/students"} component={Students} />
        <Route exact path={"/student/:id/:courseId"} component={Student} />
       <Route exact path={"/add"} component={AddNew} />
       <Route path={"/addquestions"} component={AddQuestions} />
       <Route path={'/view'} component={View} />
       <Route path={'/stats'} component={Stats} />
        <Route path={'/policy'} component={Policy} />
       <Route path={'/Login'} component={Login}/>
       <Route exact path={'/search'} component={Search}/>
      <Route exact path={'/search/:id'} component={Search}/>
       <NavBar>
         <Route exact path={"/dashboard"} component={Dashboard} />
          <Route path={"/Practice/:id"} component={Practice} />
          <Route exact path={"/explore"} component={Explore} />
          <Route exact path={'/explore/:id'} component={ExploreView} />
          <Route exact path={"/objective/:id"} component={Objective} />
          <Route exact path={"/theories/:id"} component={Theories} />
          <Route exact path={"/bookmarks"} component={Bookmarks} />
          <Route exact path={"/leaderboard"} component={Leaderboard} />
          <Route exact path={"/profile"} component={Profile} />
          <Route exact path={"/profile/:id"} component={Profile} />
          <Route exact path={"/social"} component={Social} />
          <Route exact path={"/social/:id"} component={Social} />
          <Route exact path={"/post/:id"} component={Post} />
          <Route exact path={"/followers/"} component={Followers} />
          <Route exact path={"/followers/:id"} component={Followers} />
          <Route exact path={"/PracticeSummary"} component={PracticeSummary} />
          <Route path={'/recents'} component={RecentActivities} />
          <Route exact path={'/notifications'} component={Notifications} />
          <Route exact path={'/courses'} component={Courses} />
          <Route exact path={'/notifications/:id'} component={Notification} />
          <Route path={'/theory/:id/:question'} component={Theory} />
       </NavBar>

    </Switch>
  </div>
</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();

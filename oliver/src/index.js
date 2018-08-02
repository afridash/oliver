import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css'
import './index.css';
//App Links
import Policy from './components/policy'
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
import NavBar from './components/navBar'
import registerServiceWorker from './registerServiceWorker'
//In-House Links
import Home from './in-house/App'
import {AddQuestions} from './in-house/AddQuestions'
import {View} from './in-house/View'
import {Stats} from './in-house/Stats'
import College from './in-house/college'
import Faculty from './in-house/faculty'
import Department from './in-house/Department'
import LoginA from './in-house/Login'
import AdminPay from './in-house/Admin-Pay'
ReactDOM.render(
  <BrowserRouter >
  <div>
    <Switch>
       <Route exact path={"/"} component={App}/>
         <Route exact path={"/pay"} component={Pay} />
          <Route exact path={"/in-house/login"} component={LoginA} />
          <Route exact path={"/in-house/home"} component={Home} />
          <Route exact path={"/in-house/college/:id"} component={College} />
          <Route exact path={"/in-house/college/:id/:faculty"} component={Faculty} />
          <Route exact path={"/in-house/college/:id/:faculty/:department"} component={Department} />
          <Route exact path={"/in-house/admin/pay"} component={AdminPay} />
          <Route exact path={"/students"} component={Students} />
          <Route exact path={"/student/:id/:courseId"} component={Student} />
          <Route exact path={"/add/:college/:faculty/:department/:course"} component={AddQuestions} />
          <Route exact path={'/view/:college/:faculty/:department/:course'} component={View} />
          <Route path={'/in-house/stats/:id'} component={Stats} />
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

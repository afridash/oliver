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
import AppHome from './components/AppHome'
import Practice from './components/Practice'
import Bookmarks from './components/bookmarks'
import Explore from './components/explore'
import Objective from './components/objective'
import Theory from './components/theory'
import PracticeSummary from './components/PracticeSummary'
import Login from './components/Login'
import RecentActivities from './components/recentActivities'
import Notifications from './components/notifications'
import ExploreView from './components/exploreView'
import Question from './components/question'
import Students from './components/students'
import Student from './components/student'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter >
  <div>
    <Switch>
       <Route exact path={"/"} component={App}/>
        <Route exact path={"/questions"} component={Home} />
        <Route exact path={"/students"} component={Students} />

        <Route exact path={"/student/:id/:courseId"} component={Student} />
       <Route exact path={"/add"} component={AddNew} />
       <Route path={"/addquestions"} component={AddQuestions} />
       <Route path={'/view'} component={View} />
       <Route path={'/stats'} component={Stats} />
        <Route path={'/policy'} component={Policy} />
       <Route path={'/Login'} component={Login}/>
       <NavBar>
         <Route exact path={"/AppHome"} component={AppHome} />
          <Route path={"/Practice/:id"} component={Practice} />
          <Route exact path={"/explore"} component={Explore} />
          <Route exact path={"/objective/:id"} component={Objective} />
          <Route exact path={"/theory/:id"} component={Theory} />
          <Route exact path={"/bookmarks"} component={Bookmarks} />
          <Route exact path={"/PracticeSummary"} component={PracticeSummary} />
          <Route path={'/recentActivities'} component={RecentActivities} />
          <Route path={'/notifications'} component={Notifications} />
          <Route path={'/explore/:id'} component={ExploreView} />
          <Route path={'/question/:id'} component={Question} />
       </NavBar>

    </Switch>
  </div>
</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();

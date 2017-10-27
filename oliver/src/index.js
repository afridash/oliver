import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import {AddNew} from './components/AddNew'
import {AddQuestions} from './components/AddQuestions'
import {View} from './components/View'
import {Stats} from './components/Stats'
import Home from './components/App'
import Students from './components/students.js'
import Student from './components/student.js'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BrowserRouter >
  <div>
    <Switch>
       <Route exact path={"/"} component={App} />
        <Route exact path={"/questions"} component={Home} />
        <Route exact path={"/students"} component={Students} />
        <Route exact path={"/student"} component={Student} />
       <Route exact path={"/add"} component={AddNew} />
       <Route path={"/addquestions"} component={AddQuestions} />
       <Route path={'/view'} component={View} />
       <Route path={'/stats'} component={Stats} />
    </Switch>
  </div>
</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();

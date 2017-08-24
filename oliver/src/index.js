import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Switch, BrowserRouter, hashHistory} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BrowserRouter>
  <div>
    <Switch>
       <Route exact path={"/"} component={App} />
    </Switch>
  </div>
</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();

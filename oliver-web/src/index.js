import React from 'react';
import ReactDOM from 'react-dom';
import {Route, Switch, BrowserRouter} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import App from './App';
import Policy from './policy';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BrowserRouter >
  <div>
    <Switch>
       <Route exact path={"/"} component={App} />
       <Route exact path={"/policy"} component={Policy} />
    </Switch>
  </div>
</BrowserRouter>, document.getElementById('root'));
registerServiceWorker();

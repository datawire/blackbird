import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';

import Header from './components/Header';
import Poller from './components/Poller';
import Tutorials from './components/Tutorials';
import LinkWidget from './components/LinkWidget';

const App = () =>
  <div className="app">
    <Header />
    <div className="container">
      <div className="diagnostics">
        <a href="/ambassador/" className="blue-button">Diagnostics</a>
      </div>
      <h4 className="label">Demo Microservices</h4>
      <div className="module">
        <div className="module-header">
          <h1 className="text-left">Blackbird Demo App</h1>
          <span className="env active">Prod</span>
          <span className="env">Dev</span>
        </div>
        <div className="pollers">
          <Poller endpoint="python-api"/>
          <Poller endpoint="java-spring-api"/>
          <Poller endpoint="python-api"/>
        </div>
      </div>
      <h4 className="label">Get Started</h4>
      <Tutorials />
    </div>
    <LinkWidget />
  </div>;

export default App;

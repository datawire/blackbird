import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid } from 'semantic-ui-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';

import Poller from './components/Poller';
import Carousel from './components/Carousel';

import jetpack from './jetpack.svg';

const App = () =>
  <div className="app">
    <Grid columns={15}>
      <Grid.Row className="welcome">
        <Grid.Column width={6}>
          <h1>Welcome!</h1>
        </Grid.Column>
        <Grid.Column width={9}>
          <p className="welcome-text">
            Are you tired of slow code/test/debug cycles on Kubernetes? Are you an application developer on
            Kubernetes who just wants auto-reload to work again? Our open source tools are designed for developers
            who are building cloud-native applications — but don’t want to compromise on their personal
            productivity.
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={6}>
          <Poller endpoint="api"/>
          <Poller endpoint="java-spring-api"/>
          <Poller endpoint="java-api"/>
        </Grid.Column>
        <Grid.Column width={9}>
          <Carousel>
            {/* Slide start */}
            <div>
              <div className="text-center">
                <h3>Feature 1</h3>
                <p>This is the best feature in the world</p>
              </div>
              <ul>
                <li>step 1</li>
                <li>step 2</li>
                <li>step 3</li>
              </ul>
              <img alt="Jetpack" style={{ width: 200, margin: '100px auto' }} src={jetpack} />
            </div>
            {/* Slide end */}

            {/* Slide start */}
            <div>
              <div className="text-center">
                <h3>Feature 2</h3>
                <p>This is the 2nd best feature in the world</p>
              </div>
              <ul>
                <li>step 1</li>
                <li>step 2</li>
                <li>step 3</li>
              </ul>
              <img alt="Jetpack" style={{ width: 200, margin: '100px auto' }} src={jetpack} />
            </div>
            {/* Slide end */}

            {/* Slide start */}
            <div>
              <div className="text-center">
                <h3>Feature 3</h3>
                <p>This is the 3rd best feature in the world</p>
              </div>
              <ul>
                <li>step 1</li>
                <li>step 2</li>
                <li>step 3</li>
              </ul>
              <img alt="Jetpack" style={{ width: 200, margin: '100px auto' }} src={jetpack} />
            </div>
            {/* Slide end */}

          </Carousel>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </div>;

export default App;

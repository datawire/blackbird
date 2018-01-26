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
          <h1>Congratulations!</h1>
        </Grid.Column>
        <Grid.Column width={9}>
          <p className="welcome-text">
            This Kubernetes cluster is successfully running the Blackbird demo application, which consists of several microservices. Take a tour of Blackbird below:
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={6}>
          <Poller endpoint="python-api"/>
          <Poller endpoint="java-spring-api"/>
        </Grid.Column>
        <Grid.Column width={9}>
          <Carousel>
            {/* Slide start */}
            <div>
              <div className="text-center">
                <h3>Deploy your changes, quickly</h3>
              </div>
              <p>
              Blackbird integrates <code>Forge</code>, which makes it easy to deploy your service from source to production. You've already used Forge to deploy this application, which consists of multiple services. To make a change to your code, try the following:
              </p>
              <ul>
                <li>Open <code>blackbird/api/app.py</code> in your code editor.</li>
                <li>Change the return value of the service to a different value.</li>
                <li>Run <code>forge deploy</code> on the command line.</li>
                <li>See how the code for the API service on the left changes.</li>
              </ul>
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

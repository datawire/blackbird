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
                <h3>Make a code change</h3>
              </div>
              <p>
              Blackbird integrates <code>Forge</code>, which makes it easy to deploy your service from source to Kubernetes. You've already used Forge to deploy this application, which consists of multiple services. In this tutorial, we'll make a code change to a single service, and push that change to development view.
              </p>
              <ol>
                <li>Create a Git branch with the <code>dev</code> prefix:
                <p><code>git checkout -b dev/my-first-change</code></p>
                </li>
                <li>Make a change to your microservice.
                <ul>
                <li>If you are using Python, edit `python-api/App.py`. Change it to return * * instead of ( ).
                <li>if you are using Java, do xxx.
                </ul>
                </li>
                <li>Run <code>forge deploy</code> on the command line. This will automatically deploy your code change to a development environment. Forge automatically detects your branch name, and will deploy your code change (and its dependencies) to a preview URL.</li>
                <li>Locate the <code>my-first-change</code> on the developer console, and click on the link to see your changes in the development environment.</li>
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

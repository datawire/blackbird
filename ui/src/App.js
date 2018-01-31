import React from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Grid, Container } from 'semantic-ui-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';

import Poller from './components/Poller';
import Tutorials from './components/Tutorials';

const App = () =>
  <div className="app">
    <Container>
      <Grid columns={15}>
        <Grid.Row className="welcome">
          <Grid.Column width={6}>
            <h1 className="text-left">Blackbird Demo App</h1>
          </Grid.Column>
          <Grid.Column width={9}>
            <a href="/ambassador/" className="tour-button">Diagnostics</a>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={5}>
            <Poller endpoint="python-api"/>
          </Grid.Column>
          <Grid.Column width={5}>
            <Poller endpoint="java-spring-api"/>
          </Grid.Column>
          <Grid.Column width={5}>
            <Poller endpoint="python-api"/>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={15}>
            <Tutorials />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  </div>;

export default App;

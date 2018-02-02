import React, { Component } from 'react';
import Joyride from 'react-joyride';
import { Modal } from 'semantic-ui-react';
import 'react-joyride/lib/react-joyride-compiled.css';
import 'semantic-ui-css/semantic.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './App.css';

import Header from './components/Header';
import Poller from './components/Poller';
import Tutorials from './components/Tutorials';
import LinkWidget from './components/LinkWidget';

class App extends Component {

  constructor() {
    super();

    this.state = {
      showWelcomeModal: true,
      showTour: false
    };

    this.hideWelcomeModal = this.hideWelcomeModal.bind(this);
    this.toggleTour = this.toggleTour.bind(this);
    this.handleCallback = this.handleCallback.bind(this)
  }

  toggleTour() {
    this.setState({
      showWelcomeModal: false,
      showTour: !this.state.showTour
    });
    this.joyride.reset();
  }

  hideWelcomeModal() {
    this.setState({
      showWelcomeModal: false
    });
  }

  handleCallback(event) {
    if (event.type === 'finished' || event.action === 'close') {
      this.toggleTour();
    }
  }

  render() {
    return (
    <div className="app">
      <Header
        startTour={this.toggleTour}
      />
      <div className="container">
        <div className="diagnostics">
          <a href="/ambassador/" className="blue-button step3">Diagnostics</a>
        </div>
        <h4 className="label">Demo Microservices</h4>
        <div className="module step1">
          <div className="module-header">
            <h1 className="text-left">Demo App</h1>
            <a href="/" className="env active">Prod</a>
          </div>
          <div className="pollers">
            <Poller endpoint="python-api"/>
            <Poller endpoint="java-spring-api"/>
            <Poller endpoint="nodejs-api"/>
          </div>
        </div>
        <h4 className="label">Get Started</h4>
        <Tutorials />
      </div>
      <LinkWidget />
      <Modal size={'tiny'} open={this.state.showWelcomeModal} onClose={this.hideWelcomeModal}>
        <Modal.Header>
          Congratulations!
        </Modal.Header>
        <Modal.Content>
          <p>You’ve successfully installed the Datawire Reference Architecture.</p>
        </Modal.Content>
        <Modal.Actions>
          <button className="link-button" onClick={this.hideWelcomeModal}>skip</button>
          <button className="blue-button small" onClick={this.toggleTour}>Take Tour</button>
        </Modal.Actions>
      </Modal>
      <Joyride
        ref={c => (this.joyride = c)}
        autoStart
        scrollToFirstStep
        allowClicksThruHole
        showStepsProgress
        showBackButton={false}
        type="continuous"
        scrollOffset={75}
        steps={[{
          title: 'Demo Microservices',
          text: 'These are sample microservices written in Python, Java, and NodeJS that can be easily modified to try different aspects of the reference architecture.',
          selector: '.step1',
          position: 'top-left'
        },
        {
          title: 'Get Started',
          text: 'These walkthroughs illustrate key features of the reference architecture.',
          selector: '.step2',
          position: 'top-left',
        },
        {
          title: 'Diagnostics',
          text: 'The reference architecture integrates the Ambassador API Gateway, which includes real-time diagnostics of its configuration.',
          selector: '.step3',
          position: 'top-left',
        },
        {
          title: 'Development Environments',
          text: 'The reference architecture supports isolated development environments mapped to GitHub branches. You can switch to a dev environment here.',
          selector: '.step4',
          position: 'top-right',
          isFixed: true
        },
        {
          title: 'Help',
          text: 'Need help? Chat with us online, read more documentation, or speak with an expert.',
          selector: '.step5',
          position: 'top-left',
          isFixed: true
        }]}
        run={this.state.showTour} // or some other boolean for when you want to start it
        locale={{ back: 'Back', close: 'Close', last: 'Done', next: 'Next', skip: 'Skip' }}
        callback={this.handleCallback}
      />
    </div>);
  }
}
export default App;

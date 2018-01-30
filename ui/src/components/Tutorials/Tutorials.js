import React, { Component } from 'react';

class Tutorials extends Component {
  constructor() {
    super();
    this.state = {
      currentIdx: 0
    };

    this.changeTutorial = this.changeTutorial.bind(this);
  }

  changeTutorial(idx) {
    this.setState({
      currentIdx: idx
    });
  }

  render() {
    const { currentIdx } = this.state;

    return (
    <div className="tutorials text-left">
      <h2>Get Started</h2>
      <p>These tutorials will help you get the most out of Datawire applications.</p>
      <div className="tutorial-content">
        <ul className="options">
          <li onClick={() => this.changeTutorial(0)}>Code Faster</li>
          <li onClick={() => this.changeTutorial(1)}>Monitoring</li>
          <li onClick={() => this.changeTutorial(2)}>Canary</li>
        </ul>
        <div className="content">
          { currentIdx === 0 &&
            <div className="tutorial">
              <ol>
                <li>
                  Step 1
                </li>
                <li>
                  Step 2
                </li>
                <li>
                  Step 3
                </li>
              </ol>
            </div>
          }
          { currentIdx === 1 &&
            <div className="tutorial">
              <ol>
                <li>
                  Step 4
                </li>
                <li>
                  Step 5
                </li>
                <li>
                  Step 6
                </li>
              </ol>
            </div>
          }
          { currentIdx === 2 &&
            <div className="tutorial">
              <ol>
                <li>
                  Step 7
                </li>
                <li>
                  Step 8
                </li>
                <li>
                  Step 9
                </li>
              </ol>
            </div>
          }
        </div>
      </div>
    </div>);
  }
}

export default Tutorials;
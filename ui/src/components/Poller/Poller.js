import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';

class Poller extends Component {
  constructor(props) {
    super(props);
    this.state = { responses: [] };
    this.active = false;
  }

  componentDidMount() {
    this.active = true;
    this.poll();
  }

  componentWillUnmount() {
    this.active = false;
  }

  poll() {
    var start = new Date().getTime();
    fetch(this.props.endpoint, {credentials: "same-origin"}).then(response => response.text()).then(text => {
      this.setState(prev => {
        var now = new Date().getTime();
        var elapsed = now - start;
        var responses = prev.responses.concat([{latency: elapsed, body: text}]);
        var n = responses.length;
        var max = 1000;
        if (n > max) {
          responses = responses.slice(n - max, n);
        }
        return { responses: responses }
      });
      if (this.active) {
        setTimeout(() => this.poll(), 1000);
      }
    }).catch(err => console.log(err));
  }

  latency(responses, profile) {
    var sum = 0;
    var count = 0;
    for (var j = 0; j < responses.length; j++) {
      var response = responses[j];
      if (response.body.indexOf(profile) !== -1) {
        sum += response.latency;
        count += 1;
      }
    }
    if (count) {
      var avg = (sum/count).toFixed(2);
      return avg;
    } else {
      return "-"
    }
  }

  render() {
    var items = [];
    for (var i = this.state.responses.length - 1; i >= 0; i--) {
      items.push(<p key={i}>{this.state.responses[i].body}</p>);
      if (items.length > 2) {
        break;
      }
    }

    var stable = this.latency(this.state.responses, "stable");
    var canary = this.latency(this.state.responses, "canary");

    return (
      <Card>
        <Card.Content className="poller-name">{this.props.endpoint}</Card.Content>
        <Card.Content className="poller-content">{items}</Card.Content>
        <Card.Content extra>latency: {stable}, {canary}</Card.Content>
      </Card>
    );
  }
}

export default Poller;

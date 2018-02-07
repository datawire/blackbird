import React, { Component } from 'react';

// Filters out the ambassador links, so only root urls with a prefix of 'dev-' are shown
const filterLinks = (links) =>
  links.routes.filter(route =>
    route.prefix.startsWith('dev-') && (route.prefix.match(/[^/]+/g) || []).length === 1);

class LinkWidget extends Component {

  constructor() {
    super();
    this.state = {
      open: false,
      links: [],
      active: false
    };

    this.toggleWidget = this.toggleWidget.bind(this);
    this.loadLinks = this.loadLinks.bind(this);
  }

  loadLinks() {
    fetch('/ambassador/?json=true', { credentials: 'same-origin' })
      .then(response => response.json())
      .then((links) => {
        this.setState({
          links: filterLinks(links)
        });
        if (this.active) {
          setTimeout(() => this.loadLinks(), 1000);
        }
      }).catch(err => console.log(err));
  }

  toggleWidget() {
    this.setState({
      open: !this.state.open
    })
  }

  componentDidMount() {
    this.active = true;
    this.loadLinks();
  }

  componentWillUnmount() {
    this.active = false;
  }

  render() {
    const { open, links } = this.state;
    return(
      <div className="LinkWidget">
        { open ?
        <div className="widget-body">
          <div className="widget-title">
            Development Environments
          </div>
          <div className="widget-links">
            <ul>
              { links.length ?
                links.map((link, i) =>
                  <li key={i}>
                    <a target="_blank" rel="noopener noreferrer" href={ `/${link.prefix}/` }>{ link.prefix }</a>
                  </li>
                ) :
                <p>No development environments currently deployed.</p>
              }
            </ul>
          </div>
        </div> : null }
        <button onClick={this.toggleWidget} className="widget-button step4">
          { open ? 'Dismiss' : 'Development Environments' }
        </button>
      </div>
    )
  }
}

export default LinkWidget;
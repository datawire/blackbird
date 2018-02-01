import React, { Component } from 'react';

const filterLinks = (links) =>
  links.routes.filter(route =>
    route.prefix.startsWith('/dev-') && (route.prefix.match(/[^/]+/g) || []).length === 1);

class LinkWidget extends Component {

  constructor() {
    super();
    this.state = {
      open: true,
      links: []
    };

    this.toggleWidget = this.toggleWidget.bind(this);
    this.loadLinks = this.loadLinks.bind(this);
  }

  loadLinks() {
    fetch('/ambassador/?json=true', {credentials: "same-origin"})
      .then(response => response.json())
      .then((links) => {
        this.setState({
          links: filterLinks(links)
        })
      }).catch(err => console.log(err));
  }

  toggleWidget() {
    this.setState({
      open: !this.state.open
    })
  }

  componentDidMount() {
    this.loadLinks();
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
              {
                links.map((link, i) =>
                  <li key={i}>
                    <a target="_blank" rel="noopener noreferrer" href={ link.prefix }>{ link.prefix }</a>
                  </li>
                )
              }
            </ul>
          </div>
        </div> : null }
        <button onClick={this.toggleWidget} className="widget-button">
          { open ? 'Dismiss' : 'Development Environments' }
        </button>
      </div>
    )
  }
}

export default LinkWidget;
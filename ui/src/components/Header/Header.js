import React from 'react';

// import the images
import logo from '../../images/datawire-logo.svg';
import arrow from '../../images/down-arrow.svg';
import forge from '../../images/forge-icon.svg';
import ambassador from '../../images/ambassador-icon.svg';
import telepresence from '../../images/telepresence-icon.svg';
import blackbird from '../../images/blackbird-icon.svg';
import bestPracticesDocumentation from '../../images/best-practices-icon.svg';
import gitter from '../../images/gitter-chat-icon.svg';
import expertHelp from '../../images/expert-help-icon.svg';
import productTour from '../../images/product-tour-icon.svg';
import github from '../../images/github-icon.svg';


const Header = () =>
  <header className="site-header">
    <a target="_blank" className="logo" href="https://www.datawire.io/?utm_source=blackbird&utm_medium=web&utm_campaign=demo" rel="noopener noreferrer">
      <img alt="Datawire" src={logo} />
    </a>
    <div className="menu products">
      <span>Products <img alt="" src={arrow} /></span>
      <ul className="dropdown">
        <li>
          <a target="_blank" href="https://forge.sh/?utm_source=blackbird&utm_medium=web&utm_campaign=demo" rel="noopener noreferrer">
            <div className="icon">
              <img alt="" src={forge} />
            </div>
            <span>Forge</span>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.getambassador.io/?utm_source=blackbird&utm_medium=web&utm_campaign=demo" rel="noopener noreferrer">
            <div className="icon">
              <img alt="" src={ambassador} />
            </div>
            <span>Ambassador</span>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.telepresence.io/?utm_source=blackbird&utm_medium=web&utm_campaign=demo" rel="noopener noreferrer">
            <div className="icon">
              <img alt="" src={telepresence} />
            </div>
            <span>Telepresence</span>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.datawire.io" rel="noopener noreferrer">
            <div className="icon">
              <img alt="" src={blackbird} />
            </div>
            <span>Blackbird</span>
          </a>
        </li>
      </ul>
    </div>
    <div className="menu help">
      <span>Help <img alt="" src={arrow} /></span>
      <ul className="dropdown">
        <li>
          <a target="_blank" href="https://www.datawire.io/faster/?utm_source=blackbird&utm_medium=web&utm_campaign=demo" rel="noopener noreferrer">
            <div className="icon">
              <img alt="" src={bestPracticesDocumentation} />
            </div>
            <span>Best Practices Documentation</span>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://gitter.im/datawire/home" rel="noopener noreferrer">
            <div className="icon">
              <img alt="" src={gitter} />
            </div>
            <span>Gitter Chat</span>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://www.datawire.io/demo/?utm_source=blackbird&utm_medium=web&utm_campaign=demo" rel="noopener noreferrer">
            <div className="icon">
              <img alt="" src={expertHelp} />
            </div>
            <span>Get Expert Help</span>
          </a>
        </li>
        <li>
          <a href="">
            <div className="icon">
              <img alt="" src={productTour} />
            </div>
            <span>Product Tour</span>
          </a>
        </li>
        <li>
          <a target="_blank" href="https://github.com/datawire" rel="noopener noreferrer">
            <div className="icon">
              <img alt="" src={github} />
            </div>
            <span>GitHub</span>
          </a>
        </li>
      </ul>
    </div>
  </header>;

export default Header;
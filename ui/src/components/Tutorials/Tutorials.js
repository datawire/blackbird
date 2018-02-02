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
    <div className="tutorials text-left step2">
      <div className="tutorial-header">
        <h2>Datawire Reference Architecture</h2>
        <p>The Datawire Reference Architecture illustrates some of the key aspects of a productive development workflow. The architecture is built using the <a href="https://www.getambassador.io">Ambassador API Gateway</a>, the <a href="https://forge.sh">Forge deployment system</a>, and <a href="https://www.telepresence.io">Telepresence</a> for local development. </p>
      </div>
      <div className="tutorial-content">
        <ul className="options">
          <li className={ currentIdx === 0 ? 'active' : '' } onClick={() => this.changeTutorial(0)}>
            <strong>Make a code change.</strong>
            <span>Developers need to be able to quickly code and test a change in Kubernetes -- without impacting production.</span>
          </li>
          <li className={ currentIdx === 1 ? 'active' : '' } onClick={() => this.changeTutorial(1)}>
            <strong>Canary test your change.</strong>
            <span>With a distributed application, testing with real-world traffic via a canary test is critical.</span></li>
          <li className={ currentIdx === 2 ? 'active' : '' } onClick={() => this.changeTutorial(2)}>
            <strong>Code locally.</strong>
            <span>Local development gives developers real-time feedback and lets them use their own tools. This will show you how you can configure your workflow to support local development.</span></li>
        </ul>
        <div className="content">
          { currentIdx === 0 &&
            <div className="tutorial">
             <p>
             The reference architecture integrates <a href="https://forge.sh"><code>Forge</code></a> to make it easy to deploy your service from source to Kubernetes. You've already used Forge to deploy this application, which consists of multiple services. In this walk through, we'll make a code change to a single service, and push that change to a development environment.
             </p>
              <ol>
                <li>
                  Create a Git branch with a prefix of <code>dev</code>: <p><code>git checkout -b dev/my-first-change</code></p>
                </li>
                <li>
                  Make a change to your microservice.
                  <ul>
                   <li>If you prefer editing Python:
                     <ul>
                     <li>Open <code>python-api/App.py</code>.</li>
                     <li>Uncomment the line <code>environment="TEST"</code>.</li>
                     </ul>
                   </li>
                   <li>If you prefer editing Java:
                     <ul>
                     <li>Open <code>HelloController.java</code> in the <code>java-spring-api</code> service.</li>
                     <li>Uncomment the line <code>environment="TEST"</code>.</li>
                     </ul>
                    </li>
                    <li>If you prefer editing JavaScript:
                      <ul>
                      <li>Open <code>nodejs-api/server.js</code>.</li>
                      <li>Uncomment the line <code>environment = 'TEST'</code>.</li>
                      </ul>
                  </ul>
                </li>
                <li>
                  Run <code>forge deploy</code> from your terminal in the <code>blackbird</code> top level directory. Forge will recursively deploy any services at the current working directory and below. Forge will only deploy services that have changed on disk. In this case, Forge detects that changes were made on a development branch, and deploy all these changes to a development environment. Under the hood, Forge uses the <code>Dockerfile</code>, a templated Kubernetes manifest, and metadata in a <code>service.yaml</code> file to build and deploy your service into Kubernetes.
                </li>
                <li>
                  View the changes by clicking on the appropriate branch name (e.g., <code>dev/my-first-change</code>) in the developer console. You should see that the microservice you have changed now displays the word TEST.
                </li>
              </ol>
              <p>Further reading</p>
              <ul>
              <li><a href="https://www.datawire.io/faster/dev-workflow-intro/">A development workflow for Kubernetes services</a></li>
              <li><a href="https://www.datawire.io/faster/shared-dev/">Shared development models and multi-service applications</a></li>
              </ul>
            </div>
          }
          { currentIdx === 1 &&
            <div className="tutorial">
              <p>We've made a change on a development branch, and now it's time to roll it out to users. We can do this with a canary test. This requires close integration between your development workflow and your operational infrastructure. In the reference architecture, we use <a href="https://www.getambassador.io">Ambassador</a> as our API Gateway, and <a href="https://forge.sh">Forge</a> to manage our development workflow.</p>
              <ol>
                <li>
                  We've defined a <i>profile</i> for canary testing that specifies that 50% of the traffic will be routed to a canary service. On your development branch, let's use this profile to deploy the same code as a canary.
                  <p><code>forge --profile canary deploy</code></p>
                </li>
                <li>
                  If you go back to the production view, you'll see that the modified microservice will now switch between the environment (e.g., stable) and TEST 50% of the time. Ambassador is using Envoy's weighted round robin algorithm to route traffic between the two services.
                </li>
                <li>
                  Ambassador includes integrated diagnostics to make it easy to troubleshoot routing configuration. Click on the Diagnostics button to get a real-time view of the currently configured routes in Ambassador.
                </li>
                <li>
                  To fully deploy your changes into production, switch to the master branch, merge your changes, and redeploy.
                  <pre>{`git checkout master
git merge dev/my-first-change
forge deploy
                  `}</pre>
                  </li>
                </ol>
                <p>Further reading</p>
                <ul>
                <li><a href="https://www.datawire.io/faster/canary-workflow/">Canary deployments, A/B testing, and microservices with Ambassador</a></li>
                <li><a href="https://www.getambassador.io">Ambassador API Gateway</a></li>
                </ul>
            </div>
          }
          { currentIdx === 2 &&
            <div className="tutorial">
              <p>In this walkthrough, we'll show you can code in real time against the cluster using <a href="https://www.telepresence.io">Telepresence</a>. We'll also demonstrate the use of a fully containerized development environment. By containerizing our development environment, we can insure identical runtime environments between development and production. Moreover, any developer who needs to work on the containerized service can use the exact same toolchain as every other developer.</p>
              <ol>
                <li>
                  We will use the <code>python-api</code> service in this tutorial. First, we will build a local Docker container for development.
                  <p><pre>{`cd python-api
docker build . -t python-api-dev`}</pre></p>
                </li>
                <li>
                  We will use Telepresence to 1) start your service in the local container and 2) route requests to this service from your remote Kubernetes cluster to your local container. We will also use a volume mount to mount our local filesystem into the Docker container.
                  <p><code>telepresence --namespace datawire --swap-deployment python-api-stable --docker-run --rm -i -t -v $(pwd)/service python-api-dev</code></p>
                </li>
                <li>
                  Wait for Telepresence to start up, and enter your password when prompted. Once Telepresence has started, open <code>python-api/app.py</code> in your favorite code editor. Edit the code, save your changes, and see them reflected immediately in the dashboard.
                </li>
              </ol>
              <p>Further reading</p>
              <ul>
              <li><a href="https://www.telepresence.io/tutorials/docker">Fast development workflow with Docker and Kubernetes</a></li>
              <li><a href="https://www.telepresence.io">Telepresence</a></li>
              </ul>
            </div>
          }
        </div>
      </div>
    </div>);
  }
}

export default Tutorials;

# Blackbird

Datawire Blackbird enables developers to code faster on Kubernetes through a cloud-native development workflow.

# Quick start

1. Install Docker for Mac from the *edge*, and enable Kubernetes support: see https://docs.docker.com/docker-for-mac/kubernetes/ for details.

2. Install Forge following the install instructions here: https://forge.sh/docs/tutorials/quickstart.

3. Make sure you have a Docker Registry account at https://hub.docker.com.

4. Run `forge setup` and enter in your Docker Registry information.

5. Clone this repo, and in the top level directory of the repo, type `forge deploy`. This will deploy all the services into Kubernetes.

6. Once the deploy is finished, go to http://localhost to see the application.

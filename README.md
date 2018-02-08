# Blackbird Reference Architecture

This is a reference architecture that illustrates how [Telepresence](https://www.telepresence.io), [Forge](https://forge.sh), and [Ambassador](https://www.getambassador.io) can be integrated to provide an end-to-end development workflow.

Note: this reference architecture is for illustrative purposes only. It is not tuned for production!

## Prerequisites

* MacOS or Linux system
* Kubernetes 1.6 or later cluster. Unfortunately, Minikube does not have full RBAC support yet, and the reference architecture uses RBAC.
* `kubectl` configured to talk to your cluster
* A Docker registry account on Docker Hub, Google Container Registry, Amazon ECR, Quay, etc.

## Quick start

Run the install script which will clone the Blackbird repository and install the Forge and Telepresence clients locally.

```
curl https://github.com/datawire/blackbird/blob/master/blackbird-install.sh | bash
```

You'll then want to deploy the Blackbird repository into your cluster. You can do this with Forge.

```
cd blackbird
forge setup  # sets up your Docker credentials
forge deploy # deploys all the demo services
```

Note that the deployment may take awhile. The reference architecture installs demo Java, NodeJS, and Python services, so it will take a few minutes to download the necessary dependencies and build the services.

## Questions?

Join our [Gitter chat](https://gitter.im/datawire/users).

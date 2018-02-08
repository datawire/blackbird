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
curl https://raw.githubusercontent.com/datawire/blackbird/master/blackbird-install.sh | bash
```

You'll then want to deploy the Blackbird repository into your cluster. You can do this with Forge.

```
cd blackbird
forge setup  # sets up your Docker credentials
forge deploy # deploys all the demo services
```

Note that the deployment may take awhile. The reference architecture installs demo Java, NodeJS, and Python services, so it will take a few minutes to download the necessary dependencies and build the services.

Once deployment is complete, you should have a number of pods running in the `datawire` namespace.

```
kubectl get pod -n datawire
NAME                                      READY     STATUS    RESTARTS   AGE
ambassador-77496977dd-fr8rp               2/2       Running   0          3h
java-spring-api-stable-69c97b99c9-xm9kc   1/1       Running   0          5h
nodejs-api-stable-646fbc999d-zh2qd        1/1       Running   0          5h
python-api-stable-5799cdc89d-wg85h        1/1       Running   0          5h
ui-stable-749846897c-hk466                1/1       Running   0          4h
```

Get the external IP address of the Ambassador service, and open that IP in your browser. You should see the Reference Architecture walk-through.

```
kubectl get svc ambassador -n datawire
NAME         CLUSTER-IP     EXTERNAL-IP     PORT(S)        AGE
ambassador   10.43.245.71   35.129.8.157   80:31807/TCP    5h
```

## Questions?

Join our [Gitter chat](https://gitter.im/datawire/users) or email hello@datawire.io.

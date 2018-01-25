#!/bin/bash

UNAME=$(uname)

if [ "$UNAME" != "Linux" -a "$UNAME" != "Darwin" ] ; then
    echo "Sorry, Blackbird is not supported on this OS."
    echo "For more details on supported platforms, see https://www.datawire.io."
    exit 1
fi

# Check if service exists
SERVICE=$(kubectl get service ambassador -n datawire)

if [[ $SERVICE = *"NotFound"* ]]; then
  echo "Your deployment was not configured successfully."
  echo "Please double-check the installation, or open an issue at https://github.com/datawire/blackbird/"
  exit 1
fi

# Get IP on GKE
HOST=$(kubectl get service ambassador -n datawire --output jsonpath='{.status.loadBalancer.ingress[0].ip}')

# Not GKE; try AWS
if [ -z "$HOST" ] ; then
  HOST=$(kubectl get service ambassador -n datawire --output jsonpath='{.status.loadBalancer.ingress[0].hostname}')
fi

# TODO: support minikube
# Docker / Kubernetes
if [ -z "$HOST" ] ; then
  HOST="localhost"
fi

AMBASSADORURL="http://${HOST}"

if [ "$UNAME" = "Darwin" ] ; then
    open $AMBASSADORURL
else
    xdg-open $AMBASSADORURL
fi

# Minikube
# AMBASSADORURL=$(minikube service --url ambassador)

# Draft 2: Service Descriptor
#
# A Service Descriptor is a high-level source of information for describing how a service is supposed to move from a singular 
# artifact (e.g. Docker Image) into a running actualized service. Under the hood this descriptor is transformed by Deployd into
# a number of Kubernetes and Terraform files and operations (and may touch even more than that).
# 
# *NOTE*: Keep in mind this is not Kubernetes or Terraform specific. It's designed to be provider agnostic.
#
# When deployment requests are received by Deployd then this configuration should be read in and used to generate all the
# necessary configuration files + generate an execution plan. The output of that transformation step is then applied to the
# fabric.

---
# Name of the Service deployed in the World
name: hello

# The Deployable artifact which in this hypothetical service descriptor is a Docker image.
deployable:
  type: docker-image
  registry: docker.io
  name: datawire/hello

# Controls the mechanism for how an update is performed.
update:
  # The update strategy (default: rolling, available: blue-green, append-only, rolling)
  strategy: rolling

  # Additional parameters that can be passed to configure how the update is performed, for example, the number of
  # pods rolled in each step.
  parameters: { }

# Network configuration that the developer is allowed to define.
network:

  # "frontend" is discoverable entry point into the system. In a vanilla Kubernetes setup this means mapping a
  # "frontend" to one or more Service manifests.
  #
  # *NOTE*: Frontends more than anything need a lot of definition because they are the access point to a service and
  #         that has implications for updates in the system. For example, blue-green deployments in Kubernetes work by
  #         manipulating the labels and selectors associated with Deployments and Services respectively.
  #
  frontends:
      # how the underlying fabric exposes a service in a vanilla kubernetes the values are mapped as:
      #
      #   none                   -> v1.Service.spec.type = 'None'
      #                          -> v1.Service.spec.clusterIP = 'None'
      #
      #   internal               -> v1.Service.spec.type = 'ClusterIP'
      #
      #   external               -> v1.Service.spec.type = 'NodePort'
      #
      #   external:load-balancer -> v1.Service.spec.type = 'LoadBalancer'
    - type: external
      ports:
          # Must reference one of the backend ports defined below. Using a "name" rather than a hard-coded port is strongly
          # recommended in Kubernetes because it means there is a level of indirection and ports can be changed safely between
          # service versions... from the docs (https://kubernetes.io/docs/user-guide/services/#defining-a-service):
          #
          #       "Note that a Service can map an incoming port to any targetPort. By default the
          #        targetPort will be set to the same value as the port field. Perhaps more
          #        interesting is that targetPort can be a string, referring to the name of a
          #        port in the backend Pods. The actual port number assigned to that name can be
          #        different in each backend Pod. This offers a lot of flexibility for deploying
          #        and evolving your Services. For example, you can change the port number that
          #        pods expose in the next version of your backend software, without breaking
          #        clients"
        - target: rest-api

          # The allowed transport protocol (can be automatically inferred from the target backend)
          protocol: tcp

          # The port to be exposed.
          port: 80

  # "backends" are the exposed ports on the container, for example, the hypothetical "Hello" service exposes two ports,
  # one port is for the REST API while another port hosts an administrative API only the author cares about.
  #
  # It's a good practice in Kubernetes to use "name" rather than hard coded ports so we really should try to enforce that.
  backends:
      # name is a "mapped" from the frontend -> backend.
    - name: rest-api
      protocol: tcp # The allowed transport protocol (default: tcp, allowed: tcp, udp)
      
      # The port that the container is listening to.
      port: 5001

    - name: admin-api
      port: 5002

# Requirements are hard dependencies that must be satisfied by the deployment system before the deployment system
# attempts to start a container. Consider a system that needs TWO PostgreSQL 9.6 *database servers*. When Deployd
# processes the descriptor the following things occur:
#
# requirements.each {
#   if (requirement.type in World.ModuleRepository) {
#     if exists(service.name, requirement.name) and no_diff(requirement.params, existing.params) {
#       val exportedVariables = requirement.exports // these are injected into the kubernetes container (e.g. URL, port, username, password).
#       satisfied()
#     } else {
#       createOrUpdateDependency()
#     }
#   }
#   else {
#     abort()
#   }
# }
#
requirements:
  - name: users
    type: postgresql-v96
    params:
      iops: 100

  - name: votes
    type: postgresql-v96
    params:
      iops: 50


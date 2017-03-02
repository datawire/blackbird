# Service Descriptor (Draft: 2017-03-02)

The service descriptor (Servicefile? Can someone think of a better name?) is a service developers primary input to configure a microservices deployment system and is designed to be a primary input into tooling that can use the information contained within to orchestrate internal processes. To that end a service descriptor has the following goals:

- Define metadata about the service (name, description, source repository etc.) that can be consumed by other tooling.
- Define how the service artifact (e.g. Docker image) is resolved so that tooling can use this information to launch the service.
- Define how the service is updated (e.g. rolling or blue-green) so that tooling can use this information to upgrade a running service.
- Define the infrastructure dependencies for a service, for example, "Service requires PostgreSQL" so that tooling can fulfill those dependencies. 

## Specification

This is a very rough English specification. It will eventually be turned into something more formal with things like constraints specified via a schema language.

## Serialization Format

A Datawirefile is stored and transmitted as a [YAML](http://www.yaml.org/) document.

**NOTE:** We're not wedded to YAML. It just happens to be easy to get started with. The only requirement is that any chosen format have a straightforward means to be converted to JSON for tooling purposes.

## Structure

A descriptor file is composed of a root YAML document that contains additional YAML data types.

- MUST start with the customary YAML `---` line.
- MAY contain a field `__format_version` (type = String:Date, fmt = YYYY-MM-DD) which indicates the version of the specification. If the `__format_version` field is absent or `null` then the latest version MUST BE assumed by tooling.
- MUST contain a field `name` (type = String) that indicates the name of the service.
- MUST contain a field `deployable` (type = Deployable) that describes how the deployable artifact is packaged and resolved.
- MUST contain a field `networking` (type = Networking) that describes the ingress path to talk to the service.
- MAY contain a field `update` (type = [Update](#Update-Strategy)) that describes the deployment and upgrade strategy to use.
- MAY contain a field `requirements` (type = Requirements) that specifies required infrastructure dependencies.
- MAY contain a field `info` (type = [Info](#Information)) that specifies generic information about the service. 

## Information

An information block is an arbitrary map of key/value <String -> Any> that can be used to provide useful context or information to other humans or tooling. 

## Update Strategy

Describe how the service should be upgraded. Different strategies are preferable for a variety of reasons. This specification suggests a couple generic strategies all deployment systems consuming the descriptor should implement, but tooling can respond to any set of options.

If the update strategy is left undefined in the descriptor then "rolling" is assumed.

| Strategy    | Description | 
| ----------- | ----------- |
| rolling     | use a simple rolling strategy to update service nodes. |
| blue-green  | use the blue-green swap strategy to update service nodes. |
| append-only | continually add new versions of services without removing old versions. |

```yaml
update:
  strategy: rolling
  parameters: {
    nodes_per_cycle: 2 # tell the deployment system how many nodes to "roll" with each cycle.
  }
```

## Deployable Artifact

Describe how the service is packaged (e.g. Docker image) and where the deployable artifact can be acquired from.

### Format: Docker Image

| Field     | Type, Format |  Description                    | Default   |
| --------- | ------------ | ------------------------------- | --------- |
| registry  | string, URI  | Docker registry address         | docker.io |
| name      | string       | Docker image repository name    |           |
| resolver  | TagResolver  | Docker tag resolution mechanism | provided  |

Exampe using a static docker tag resolver.

```yaml
deployable:
  format: docker
  registry: docker.io
  name: datawire/hello
  resolver:
    type: provided 
```

#### Tag Resolver

To deploy a Docker image the tag is required. Depending on workflows and tooling there are three ways this 

##### Provided Resolver

A provided resolver indicates the Docker tag to use is provided "on-demand" at deployment time. The use case for this is when an external tool will tell the deployment system what Docker image to use just before deploying.

```yaml
resolver:
  type: provided 
```

##### Query Resolver

A query resolver indicates the deployment system should reach out to a remote endpoint and ask what image to use. The use case for this is when an external tool will update a file or database somewhere with this information.

```yaml
resolver:
  type: query
  address: <URL>
```

## Networking

Describe the networking requirements for the service.

### Frontend

The frontend is discoverable entry point into the system.

### Backends

A backend is the exposed ports on the container, for example, a hypothetical "Hello" service exposes two ports: one port is for the REST API while another port hosts an administrative API only the author cares about.

## Requirements

Requirements are hard dependencies that must be satisfied by the deployment system before the deployment system attempts to start a service.

## Example Descriptor

```yaml
# Draft 2017-03-02: Service Descriptor

---
name: hello

deployable:
  type: docker
  registry: docker.io
  name: datawire/hello
  resolver:
    type: provided

update:
  strategy: rolling
  parameters: { }

network:
  frontend:
    type: external
    ports:
      - target: rest-api
        port: 80

  backends:
    - name: rest-api
      protocol: tcp
      port: 5001
    - name: admin-api
      port: 5002

requirements:
  - name: users
    type: postgresql-v96
    params:
      iops: 100

  - name: votes
    type: postgresql-v96
    params:
      iops: 50
      initial_storage_capacity: 300Gb

```

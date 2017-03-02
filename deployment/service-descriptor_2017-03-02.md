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

The frontend is discoverable entry point into the system. Current specification says services only have one real frontend (many ports may be mapped from it). This constraint might be lifted.

```yaml
  frontend:
    type: external
    ports:
      - target: rest-api
        port: 80
```

The `frontend.type` controls how the frontend is exposed. There are several types that have different implications:

| Type | Description |
| ---- | ----------- |
| none | headless service (e.g. not "discoverable" via DNS |
| internal | service does not have an external addressable IP:Port address |
| external | service has many external addressable IP:Port (per node) |
| external:load-balancer | service has one external IP:Port that load balances across all nodes |

The frontend also has a list of open ports. Each port in this list is designed to "map" to a backend port.

### Backends

A backend is the exposed ports on the container, for example, a hypothetical "Hello" service exposes two ports: one port is for the REST API while another port hosts an administrative API only the author cares about.

Exposed ports are named and the name is signifgant as frontend ports are mapped to backend ports by their name. Given a configuration such as below:

```yaml
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
```

What is being stated here is that external Port TCP:80 forwards to backend TCP:5001.

| Field | Type, Format | Description |
| ----- | ------------ | ----------- |
| name  | string       | name of the port |
| protocol | string (tcp, udp) | the protocol for the port |
| port  | int (1..65535) | the actual port number |

## Requirements

Requirements are cloud infrastructure that needs to be created before a service is launched. The mechanism of creation is left to the deployment system. The `type` parameter on each requirement is customizable and maps to an implementation of how that requirement will be fulfilled (e.g. via Terraform).

```yaml
requirements:
  - name: users
    type: postgresql-v96
    parameters:
      iops: 100
```

| Field      | Type, Format |  Description                    | Default   |
| ---------- | ------------ | ------------------------------- | --------- |
| name       | string       | Name of the thing being created. Used to inject config into a container (e.g. ${NAME}_DB_USERNAME as an env var). | |
| type       | string       | The type of thing to create. Totally user defined and implementation specific to the deployment system.  | |
| parameters | map<string, string>  | developer configurable options (e.g. IOPS). | |

## Example Descriptor

Below is an example descriptor based off this specification to give a bit of a "feel" for how this would actually look.

```yaml
---
# Draft 2017-03-02: Service Descriptor

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
    parameters:
      iops: 100

  - name: votes
    type: postgresql-v96
    parameters:
      iops: 50
      initial_storage_capacity: 300Gb

```

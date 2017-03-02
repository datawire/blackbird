# Service Descriptor (Draft: 1)

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
- MAY contain a field `update` (type = Update) that describes the deployment and upgrade strategy to use.
- MAY contain a field `requirements` (type = Requirements) that specifies required infrastructure dependencies.

## Deployable Artifact

Describes how the service is packaged (e.g. Docker image) and where the deployable artifact can be acquired from.

### Format: Docker Image

| Field     | Value | Type |
| --------- | ----- | ---- |
| registry  | Docker registry address | string |
| name      | Docker image repository | string |
| resolver  | How the Docker tag should be resolved | DockerTagResolver |

Exampe using a static docker tag resolver.

```yaml
deployable:
  format: docker
  registry: docker.io
  name: datawire/hello
  resolver:
    type: static 
    tag: 1.0
```

#### Tag Resolver

##### Static Resolver

A static tag resolver indicates the Docker tag to use is hard-coded into the descriptor. The use case for this is when an external tool will update the descriptor.

```yaml
resolver:
  type: static 
  tag: 1.0
```

##### Provided Resolver

A provided tag resolver indicates the Docker tag to use is provided "on-demand" at deployment time. The use case for this is when an external tool will tell the deployment system what Docker image to use just before deploying.

```yaml
resolver:
  type: provided 
```

## Networking

## Requirements


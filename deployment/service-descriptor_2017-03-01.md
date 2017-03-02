# Service Descriptor (Draft: 2017-03-01)

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

## Artifact

## Networking

## Requirements

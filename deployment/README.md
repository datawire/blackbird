# Blackbird Deployment

The goal of blackbird deployment is to provide tools and services that
make it easy to build a state of the art deployment pipeline for a
microservices application.

We use the term "application" to refer to the overall network of
microservices, and "service" to refer to an individual service within
the application.

Our initial assumptions are that the target infrastructure for
deployments consists of a kubernetes cluster running services
(i.e. your business logic) plus a set of terraform-maintained "backing
services" that live outside of kubernetes (e.g. your databases).

The first phase of this project is to define a standard format for all
the metadata and configuration information necessary to deploy a
service into an instance of the application on top of a supported
tech/provider stack.

Because it is useful to be able to deploy multiple instances of an
application (e.g. for dev purposes, testing, and/or staging), and
because we want our tooling to be able to support multiple different
cloud providers and technology choices, it is useful to divide the
total configuration info into these categories:

1. <b>Service Descriptor</b>

  This includes static configuration (i.e. configuration that does not
  change regardless of where/how it is deployed), along with
  definitions of all the dependencies that need to be injected from
  the runtime environment in order for the service to function
  (e.g. database URLs, downstream services, etc).

2. <b>Target Config</b>

  This includes the information necessary to access and manipulate a
  given deployment target.

This document is a WIP spec for the [Service Descriptor](service-descriptor_2017-03-02.md)

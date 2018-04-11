# Monitoring

If you're interested in seeing Ambassador integrated with Prometheus and Grafana, this directory contains the configuration necessary to set up a Prometheus Operator and Grafana with Ambassador.

Note that this is *alpha*.

To set this up:

1. Run `kubectl apply -f` on each of the YAML files. (You need to create the `prom-operator.yaml` and `prom-rbac.yaml` first, and then wait a bit for the pods for these to deploy before applying the rest of the YAML.)

2. In Grafana, log in as admin/admin. (This is configured as a LoadBalancer service, so you should have a separate IP for this if you're using AWS, GKE, or another service that supports LoadBalancer types.)

3. Configure the data source to point to http://prometheus.datawire:9090 with type Prometheus.

4. Import the dashboard from https://grafana.com/dashboards/4698.

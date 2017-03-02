# Blackbird Deployment

<div class="mermaid">
graph LR
  subgraph Kubernetes in Cloud
    code["k8s.Pod: yourcode"]
    s1["k8s.Service: yourcode"]-->code
    code-->s2["k8s.Service: thing1"]
    code-->s3["k8s.Service: thing2"]
    code-->c1>"Cloud Database (AWS RDS)"]
  end
</div>

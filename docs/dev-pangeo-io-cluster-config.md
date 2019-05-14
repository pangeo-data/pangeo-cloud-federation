dev-pangeo-io-cluster
=====================

This document summarizes the `dev-pangeo-io-cluster` configuration and will be useful for users when picking ideal pod specifications for Jupyter and Dask applications. It was last updated Tue May 14 2019.


## Node-Pools
```bash
$ gcloud container node-pools list --cluster dev-pangeo-io-cluster

NAME            MACHINE_TYPE   DISK_SIZE_GB  NODE_VERSION
core-pool       n1-standard-2  100           1.11.8-gke.6
temp-dask-pool  n1-highmem-4   100           1.11.8-gke.6
dask-pool       n1-highmem-4   100           1.11.8-gke.6
jupyter-pool    n1-highmem-16  100           1.11.8-gke.6
```

## Node-Pool Descriptions

The node-pool descriptions for each node pool, including labels and taints, are listed below:
<!-- for pool in core-pool temp-dask-pool dask-pool jupyter-pool; do echo $ gcloud container node-pools describe --cluster  dev-pangeo-io-cluster $pool; gcloud container node-pools describe --cluster  dev-pangeo-io-cluster $pool; echo " "; done -->
```bash
$ gcloud container node-pools describe --cluster dev-pangeo-io-cluster core-pool
config:
  diskSizeGb: 100
  diskType: pd-standard
  imageType: COS
  labels:
    hub.jupyter.org/node-purpose: core
  machineType: n1-standard-2
  oauthScopes:
  - https://www.googleapis.com/auth/devstorage.read_only
  - https://www.googleapis.com/auth/logging.write
  - https://www.googleapis.com/auth/monitoring
  - https://www.googleapis.com/auth/service.management.readonly
  - https://www.googleapis.com/auth/servicecontrol
  - https://www.googleapis.com/auth/trace.append
  serviceAccount: default
initialNodeCount: 3
instanceGroupUrls:
- https://www.googleapis.com/compute/v1/projects/pangeo-181919/zones/us-central1-b/instanceGroupManagers/gke-dev-pangeo-io-cluster-core-pool-55304abd-grp
management:
  autoRepair: true
maxPodsConstraint:
  maxPodsPerNode: '110'
name: core-pool
podIpv4CidrSize: 24
selfLink: https://container.googleapis.com/v1/projects/pangeo-181919/zones/us-central1-b/clusters/dev-pangeo-io-cluster/nodePools/core-pool
status: RUNNING
version: 1.11.8-gke.6

$ gcloud container node-pools describe --cluster dev-pangeo-io-cluster temp-dask-pool
autoscaling:
  enabled: true
  maxNodeCount: 100
config:
  diskSizeGb: 100
  diskType: pd-standard
  imageType: COS
  labels:
    k8s.dask.org/node-purpose: worker
  machineType: n1-highmem-4
  oauthScopes:
  - https://www.googleapis.com/auth/devstorage.read_only
  - https://www.googleapis.com/auth/logging.write
  - https://www.googleapis.com/auth/monitoring
  - https://www.googleapis.com/auth/service.management.readonly
  - https://www.googleapis.com/auth/servicecontrol
  - https://www.googleapis.com/auth/trace.append
  preemptible: true
  serviceAccount: default
instanceGroupUrls:
- https://www.googleapis.com/compute/v1/projects/pangeo-181919/zones/us-central1-b/instanceGroupManagers/gke-dev-pangeo-io-clus-temp-dask-pool-8bacb14c-grp
management:
  autoRepair: true
maxPodsConstraint:
  maxPodsPerNode: '110'
name: temp-dask-pool
podIpv4CidrSize: 24
selfLink: https://container.googleapis.com/v1/projects/pangeo-181919/zones/us-central1-b/clusters/dev-pangeo-io-cluster/nodePools/temp-dask-pool
status: RUNNING
version: 1.11.8-gke.6

$ gcloud container node-pools describe --cluster dev-pangeo-io-cluster dask-pool
autoscaling:
  enabled: true
  maxNodeCount: 10
config:
  diskSizeGb: 100
  diskType: pd-ssd
  imageType: COS
  labels:
    k8s.dask.org/node-purpose: worker
  machineType: n1-highmem-4
  oauthScopes:
  - https://www.googleapis.com/auth/devstorage.read_only
  - https://www.googleapis.com/auth/logging.write
  - https://www.googleapis.com/auth/monitoring
  - https://www.googleapis.com/auth/service.management.readonly
  - https://www.googleapis.com/auth/servicecontrol
  - https://www.googleapis.com/auth/trace.append
  preemptible: true
  serviceAccount: default
  taints:
  - effect: NO_SCHEDULE
    key: k8s.dask.org_dedicated
    value: worker
instanceGroupUrls:
- https://www.googleapis.com/compute/v1/projects/pangeo-181919/zones/us-central1-b/instanceGroupManagers/gke-dev-pangeo-io-cluster-dask-pool-f89fa71c-grp
management:
  autoRepair: true
maxPodsConstraint:
  maxPodsPerNode: '110'
name: dask-pool
podIpv4CidrSize: 24
selfLink: https://container.googleapis.com/v1/projects/pangeo-181919/zones/us-central1-b/clusters/dev-pangeo-io-cluster/nodePools/dask-pool
status: RUNNING
version: 1.11.8-gke.6

$ gcloud container node-pools describe --cluster dev-pangeo-io-cluster jupyter-pool
autoscaling:
  enabled: true
  maxNodeCount: 10
config:
  diskSizeGb: 100
  diskType: pd-ssd
  imageType: COS
  labels:
    hub.jupyter.org/node-purpose: user
  machineType: n1-highmem-16
  oauthScopes:
  - https://www.googleapis.com/auth/devstorage.read_only
  - https://www.googleapis.com/auth/logging.write
  - https://www.googleapis.com/auth/monitoring
  - https://www.googleapis.com/auth/service.management.readonly
  - https://www.googleapis.com/auth/servicecontrol
  - https://www.googleapis.com/auth/trace.append
  serviceAccount: default
  taints:
  - effect: NO_SCHEDULE
    key: hub.jupyter.org_dedicated
    value: user
instanceGroupUrls:
- https://www.googleapis.com/compute/v1/projects/pangeo-181919/zones/us-central1-b/instanceGroupManagers/gke-dev-pangeo-io-cluste-jupyter-pool-0752f5af-grp
management:
  autoRepair: true
  autoUpgrade: true
maxPodsConstraint:
  maxPodsPerNode: '110'
name: jupyter-pool
podIpv4CidrSize: 24
selfLink: https://container.googleapis.com/v1/projects/pangeo-181919/zones/us-central1-b/clusters/dev-pangeo-io-cluster/nodePools/jupyter-pool
status: RUNNING
version: 1.11.8-gke.6
```

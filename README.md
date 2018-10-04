# About

This repository contains the reproducible configuration for deploying a Pangeo
instance on Google Kubernetes Engine.

It contains scripts to automatically redeploy when the image definition or
chart parameters are changed.

# Setup

The first step to using this automation is to create a Kubernetes cluster and
install the server-side component Tiller on it (used for deploying applications
with the Helm tool). Scripts to do so can be found here:
https://github.com/pangeo-data/pangeo/tree/master/gce/setup-guide

* Modify the script `gce-pangeo-environment.sh` with the parameters for your deployment
* Run the following scripts:
```
. gce-pangeo-environment.sh
./1_create_cluster.sh
./2_configure_kubernetes.sh
```

## Install git-crypt

You will need to install
[`git-crypt`](https://www.agwa.name/projects/git-crypt/). `git-crypt` is used
to encrypt the secrets that are used for deploying your cluster.

# Configure this repository

Once you have a cluster created, you can begin customizing the configuration.

* Create a fork of this repository in GitHub.
* Rename the deployments/example.pangeo.io directory to your desired name
`git mv example.pangeo.io newname.pangeo.io`
* Regenerate the git-crypt key. This will be used to encrypt the secrets
that are used for your deployment.
  * `git crypt init`
* Create a CircleCI job for the repo. You will need to add environment 
variables to configure your job:

| Name | Description |
| ---- | ----------- |
| GCR_READWRITE_KEY | The JSON output of `gcloud iam service-accounts keys create` (ask Pangeo administrator to configure this) |
| GIT_CRYPT_KEY | The base64 encoded output of `git crypt export-key` |
| GKE_CLUSTER | The name that your cluster was created with |
| GOOGLE_PROJECT | The identifier of the project where your cluster was created |
| GOOGLE_REGION | The Google compute region where your cluster is located (e.g. us-central1) |
| GOOGLE_ZONE | The Google compute zone where your cluster is located (e.g. us-central1-b) |
| IMAGE_NAME | The container registry image to build and use for your notebook and worker containers (e.g. us.gcr.io/pangeo-181919/example-pangeo-io-notebook) |
| DEPLOYMENT | The name of the directory in `deployments` you wish to deploy (e.g.,  example.pangeo.io) |



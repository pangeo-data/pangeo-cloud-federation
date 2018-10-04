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
to encrypt the secrets that are used for deploying your cluster. Please read this [HOW GIT-CRYPT WORKS](https://www.agwa.name/projects/git-crypt/) if new to it. 

# Configure this repository

Once you have a cluster created, you can begin customizing the configuration.

* Create a fork of this repository in GitHub.
* Rename the deployments/example.pangeo.io directory to your desired name
  * `git mv example.pangeo.io newname.pangeo.io`
* Regenerate the git-crypt key. This will be used to encrypt the secrets
that are used for your deployment.
  * `git crypt init`
* Create a CircleCI job for the repo. 
  * Log in or Sign up [here](https://circleci.com). Go to [dashboard](https://circleci.com/dashboard). 
  * Click add project under your github account name. 
  * Click Set Up Project for the example.pangeo.io-deploy repo. Click Linux. Click Start building at bottom. 
  * You will need to add the below environmental variables to your CircleCI configuration:

| Name | Description |
| ---- | ----------- |
| GCR_READWRITE_KEY | The JSON output of `gcloud iam service-accounts keys create` (ask Pangeo administrator to configure this) |
| GIT_CRYPT_KEY | The base64 encoded output of `git crypt export-key key.txt` Delete `key.txt` afterwards!|
| GKE_CLUSTER | The name that your cluster was created with |
| GOOGLE_PROJECT | The identifier of the project where your cluster was created |
| GOOGLE_REGION | The Google compute region where your cluster is located (e.g. us-central1) |
| GOOGLE_ZONE | The Google compute zone where your cluster is located (e.g. us-central1-b) |
| IMAGE_NAME | The container registry image to build and use for your notebook and worker containers (e.g. us.gcr.io/pangeo-181919/example-pangeo-io-notebook) |
| DEPLOYMENT | The name of the directory in `deployments` you wish to deploy (e.g.,  example.pangeo.io) |

* Make a commit to test if the job succeeded. If it failed troubleshoot it... 

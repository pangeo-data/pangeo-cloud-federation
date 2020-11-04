This repository manages the continuous deployment of the [Pangeo](http://pangeo.io/) Cloud Federation
JupyterHub Kubernetes clusters using [hubploy](https://github.com/yuvipanda/hubploy).
It contains scripts to automatically redeploy when the image definition or
chart parameters are changed. Changing the image will typically take ~20 minutes, and changing a Helm config variable ~1 minute.

# Clusters

Name    | Cloud: region      |  Staging [![CircleCI](https://circleci.com/gh/pangeo-data/pangeo-cloud-federation/tree/staging.svg?style=svg)](https://circleci.com/gh/pangeo-data/pangeo-cloud-federation/tree/staging)                             | Production [![CircleCI](https://circleci.com/gh/pangeo-data/pangeo-cloud-federation/tree/prod.svg?style=svg)](https://circleci.com/gh/pangeo-data/pangeo-cloud-federation/tree/prod)
--                |-                   |-                                            |-
gcp-uscentral1b   | GCP: us-central1-b | https://staging.us-central1-b.gcp.pangeo.io | https://us-central1-b.gcp.pangeo.io
aws2              | AWS: us-west-2     | https://staging.aws-uswest2.pangeo.io       | https://aws-uswest2.pangeo.io
ooi               | Azure: eastus      | https://staging.ooi.pangeo.io               | https://ooi.pangeo.io

## Instructions to add a new hub

#### Setup a Kubernetes Cluster

The first step to using this automation is to create a Kubernetes cluster. Scripts to do so using Google Cloud Platform can be found [here](https://github.com/pangeo-data/pangeo/tree/master/gce/setup-guide). For other cloud providers (e.g. AWS, Azure), follow the [Zero-to-JupyterHub](https://zero-to-jupyterhub.readthedocs.io/en/latest/create-k8s-cluster.html) guide.

#### Install git-crypt

You will need to install
[`git-crypt`](https://www.agwa.name/projects/git-crypt/). `git-crypt` is used
to encrypt the secrets that are used for deploying your cluster. Please read this [HOW GIT-CRYPT WORKS](https://www.agwa.name/projects/git-crypt/) if new to it.

#### Configure this repository

Once you have a cluster created, you can begin customizing the configuration.

* Create a fork of this repository in GitHub and clone your fork. (Note: the default branch is staging.)
* Request a git-crypt symmetric key from the maintainers of this repo to be used for your deployment secrets files.
* Initialize git-crypt using the unlock command.
  * `git-crypt unlock /path/to/your.key`
* Copy the one of the deployments to a directory with your deployment name (we'll use `foobar` as our deployment name from here on).
  * `cp -r example foobar`
* **Add your deployment's secrets directory to .gitattributes.** IMPORTANT: before pushing to GitHub ensure encryption with `git-crypt status | grep secrets`
* Configure the JupyterHub config files. These are found in `deployments/foobar/config`.
* Configure the `hubploy.yaml` config file.
* Configure the deployment secrets found in `deployments/foobar/config`.
  * Information on what needs to be in hubploy.yaml and in the secrets directory can be found [here](docs/readme-secrets.md).
* Configure your deployments image. This is found in `deployments/foobar/image`.
  * Edit the files in the binder directory to change the contents of the user Docker image. The specification for these files comes from [repo2docker](https://repo2docker.readthedocs.io/en/latest/).
  * Add or modify the README.md and Jupyter notebooks. These will be in each user's home directory.

### Troubleshooting

* `Error: UPGRADE FAILED: "example.pangeo.io-staging" has no deployed releases`
  * If your first deploy of an application fails. Run `helm delete example-staging --purge` anywhere you have run `gcloud container clusters get-credentials`

### Testing

We have some rudimentary testing of deployments. The tests are located in the file ``test.py``.
Tests should be grouped according to which cloud deployment they should run on (all, GCP only, etc.)

There were some manual setup steps

* Sign up for the cloud with a regular user (we're using `pangeo-bot`)
* Create an API token, upload to CircleCI

### Monitoring

We've deployed prometheus and grafana to monitor cluster usage. These metrics are publicially visible:

* GCP: http://grafana.us-central1-b.gcp.pangeo.io/grafana/
* AWS: http://grafana.aws-uswest2.pangeo.io/grafana/

These are deployed indendently of CI. The GCP deployment is done in deployments/gcp-uscentral1b/Makefile, with the `metrics` target.

```
$ cd deployments/gcp-uscentral1b
$ make metrics
```

Configuration is in the `metrics` folder. We expose it with an nginx-ingress, which was configured to have a static IP on Google Cloud and added to our DNS to server from the URL above.

Likewise with the aws / icesat2 deployment.

### Workflow

All pull requests should be made to the `staging` branch. When a change has been verified and is ready for
deployment, `staging` can be merged into `prod`. This repository is set up with continuous deployment upon pushes
to both `staging` and `prod`.

### Related Projects

- [Pangeo](http://pangeo.io/): main website for the Pangeo project.
- [Pangeo Helm Chart](https://github.com/pangeo-data/helm-chart): A simple helm chart that wraps the jupyterhub helm chart to support horizontal compute scaling with Dask.
- [Zero to JupyterHub](https://zero-to-jupyterhub.readthedocs.io/en/latest/): A tutorial to help install and manage JupyterHub on a cloud with Kubernetes.
- [HubPloy](https://hubploy.readthedocs.io/en/latest/): a suite of commandline tools & a python library for continuous deployment of JupyterHub on Kubernetes (with Zero to JupyterHub)
- [Repo2Docker](https://repo2docker.readthedocs.io/en/latest/): a tool to build, run, and push Docker images from source code repositories that run via a Jupyter server.

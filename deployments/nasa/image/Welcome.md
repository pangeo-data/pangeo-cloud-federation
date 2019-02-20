<center>
    <img src="nasa-logo.png" width="25%" align="center">
    <img src="pangeo_simple_logo.png" width="50%" align="center">
</center>

# Welcome to nasa.pangeo.io! 

This is a [JupyterHub](https://jupyterhub.readthedocs.io/en/stable/) running on Amazon Web Services (AWS). You have access to a scalable cluster based on [Kubernetes and Dask](http://kubernetes.dask.org/en/latest/).

Pangeo is a community effort and big-data platform for the geosciences. This particular Pangeo project is aimed at processing NASA Earth Observation data on AWS. The main motivation is NASA moving a 100 Petabyte+ archive of imagery to AWS - read more [here](https://earthdata.nasa.gov/about/eosdis-cloud-evolution). The JupyterHub environment you are now in enables interactive and scalable analysis next to those datasets, circumventing the need to duplicate and download large archives.

A file browser listing example notebooks is available to the left. 

Dask dashboard plots are available to the right.  These will activate when you
run the cells in your Jupyter notebooks that create a Dask `Client`.

To get started, open a new notebook in the notebooks/ directory on the left.

## Learn More

- For more information about Pangeo in general please visit [pangeo.io](https://pangeo.io).

## Acknowledgments

Pangeo is supported, in part, by the National Science Foundation (NSF) and the National Aeronautics and Space Administration (NASA). Amazon Web Services (AWS) has provided cloud computing via the [Earth on AWS program] (https://aws.amazon.com/earth/).

# Workaround for lack of nodeAffinity for dask-gateway objects.
# This configuration can be moved to the helm configuration for dask-gateway>0.8
import contextlib
import sys
import subprocess
import hubploy.auth


if __name__ == "__main__":
    # We use kubectl to copy and exec the tests on a singleuser
    # server. This needs a kubeconfig, and so we call this,
    # use hubploy to handle auth, and call the tests in a subprocess.
    deployment = sys.argv[1]
    namespace = sys.argv[2]

    auth = hubploy.auth.cluster_auth(deployment)

    if not hasattr(auth, "__enter__"):
        # Older versions of hubploy.
        auth = contextlib.nullcontext()

    with auth:
        for obj in ["traefik-gcp-uscentral1b-{}-dask-gateway".format(namespace),
                    "api-gcp-uscentral1b-{}-dask-gateway".format(namespace),
                    "controller-gcp-uscentral1b-{}-dask-gateway".format(namespace)]:
            cmd = './kubectl -n {namespace} patch deployment {obj} --patch="$(cat deployments/gcp-uscentral1b/patches/patch.yaml)"'.format(namespace=namespace, obj=obj)
            ret = subprocess.check_output(cmd, shell=True)

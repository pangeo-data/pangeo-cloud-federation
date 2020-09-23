import dask_gateway


class TestCommon:
    """Tests that should run on all deployments"""

    def test_connect_cluster(self):
        cluster = dask_gateway.GatewayCluster()
        client = cluster.get_client()
        cluster.scale(1)
        client.wait_for_workers(1)


class TestGCP:
    """GCP-specific tests"""
    def test_scratch_bucket(self):
        assert 0  # deliberately fail for now.


if __name__ == "__main__":
    # We use kubectl to copy and exec the tests on a singleuser
    # server. This needs a kubeconfig, and so we call this,
    # use hubploy to handle auth, and call the tests in a subprocess.
    import sys
    import subprocess
    import hubploy.auth

    deployment = sys.argv[1]
    with hubploy.auth.cluster_auth(deployment):
        subprocess.check_output(['./run_tests.sh'])

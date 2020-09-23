import os

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
        scratch = os.environ["PANGEO_SCRATCH"]
        assert scratch == "gs://pangeo-scratch/pangeo-bot/"

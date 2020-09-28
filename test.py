import os

import pytest

import dask_gateway


@pytest.mark.common
class TestCommon:
    """Tests that should run on all deployments"""

    def test_connect_cluster(self):
        cluster = dask_gateway.GatewayCluster()
        client = cluster.get_client()
        cluster.scale(1)
        client.wait_for_workers(1)


@pytest.mark.gcp
class TestGCP:
    """GCP-specific tests"""
    @pytest.mark.xfail(reason="PANGEO_SCRATCH is set in start")
    def test_scratch_bucket(self):
        scratch = os.environ["PANGEO_SCRATCH"]
        assert scratch == "gs://pangeo-scratch/pangeo-bot/"

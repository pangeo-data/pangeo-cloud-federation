import dask_gateway


def inc(x):
    return x + 1


class TestCommon:
    """Tests that should run on all deployments"""

    def test_connect_cluster(self):
        cluster = dask_gateway.GatewayCluster()
        client = cluster.get_client()
        cluster.scale(1)
        client.wait_for_workers(1)

        result = client.map(inc, range(2))
        result = client.gather(result)


class TestGCP:
    """GCP-specific tests"""
    def test_scratch_bucket(self):
        pass

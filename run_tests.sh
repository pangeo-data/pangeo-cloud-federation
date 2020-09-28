#!/usr/bin/env bash
export TOKEN=${JUPYTERHUB_TOKEN_GCP_USCENTRAL1B_STAGING}

if [[ ${CIRCLE_BRANCH} == "staging" ]]; then
  export JUPYTERHUB_URL="https://staging.us-central1-b.gcp.pangeo.io"
else
  export JUPYTERHUB_URL="https://us-central1-b.gcp.pangeo.io"
fi

curl -LO "https://storage.googleapis.com/kubernetes-release/release/v1.19.0/bin/linux/amd64/kubectl"
chmod +x kubectl

# Start a server
echo "[Staring singleuser server]"
curl -X POST -H "Authorization: token ${TOKEN}" ${JUPYTERHUB_URL}/hub/api/users/pangeo-bot/server

while [[ $(./kubectl -n ${CIRCLE_BRANCH} get pods jupyter-pangeo-2dbot -o 'jsonpath={..status.conditions[?(@.type=="Ready")].status}') != "True" ]]; do echo "waiting for pod" && sleep 1; done

# Copy the test file
./kubectl -n ${CIRCLE_BRANCH} cp test.py jupyter-pangeo-2dbot:/tmp/test.py
./kubectl -n ${CIRCLE_BRANCH} cp pytest.ini jupyter-pangeo-2dbot:/tmp/pytest.ini

# Run the tests
echo "[Running tests]"
./kubectl -n staging exec jupyter-pangeo-2dbot -- /srv/conda/envs/notebook/bin/pytest -v -m "common or gcp" /tmp/test.py
RET=$?

echo "[Cleaning up]"
# Cleanup
curl -X DELETE -H "Authorization: token ${TOKEN}" "${JUPYTERHUB_URL}/hub/api/users/pangeo-bot/server"

exit $RET

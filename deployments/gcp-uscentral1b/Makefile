PROJECT?=pangeo-181919
NAMESPACE?=staging
RELEASE?=us-central1b-$(NAMESPACE)
ZONE?=us-central1-b
CLUSTER?=pangeo-uscentral1b

# Creation of the Kubernetes Cluster for Google
#
# Notes
# -----
# The pangeo-rbac stuff is untested.
#
# References
# ----------
# https://cloud.google.com/kubernetes-engine/docs/how-to/node-auto-provisioning
# https://cloud.google.com/kubernetes-engine/docs/how-to/workload-identity

# ----------------------------------------------------------------------------
# Kubernetes Cluster
#
#
# TODO: enable nodepool auto-provisioning
		# --enable-autoprovisioning --min-cpu 1 --min-memory 1 --max-cpu 1000 --max-memory 5200 \
		# --autoprovisioning-service-account=pangeo \

test:
	@echo $(CLUSTER) $(WORKER_POOL)
	@echo $(ARGS)

cluster:
	echo "[Creating cluster pool in $(ZONE)]"
	gcloud container clusters create $(CLUSTER) \
		--num-nodes=1 \
		--zone=$(ZONE) \
		--labels=cluster=$(CLUSTER) \
		--cluster-version=latest \
		--no-enable-ip-alias \
		--no-enable-legacy-authorization \
		--no-enable-basic-auth \
		--enable-autoupgrade --enable-autorepair --max-surge-upgrade=1 \
		--machine-type=n1-standard-1 \
		--enable-autoscaling --min-nodes=1 --max-nodes=2 \
		--node-labels="hub.jupyter.org/nodepurpose=core" \
		--enable-autoprovisioning --autoprovisioning-config-file autoprovisioning.json \
		--enable-vertical-pod-autoscaling \
		--workload-metadata=GKE_METADATA \
		--workload-pool=$(PROJECT).svc.id.goog \
		--enable-stackdriver-kubernetes
		# --autoprovisioning-service-account=pangeo  # maybe need to do this after the initial setup
		# --enable-ip-alias
		# --enable-private-nodes
		# --enable-private-endpoint
		# --master-ipv4-cidr 172.16.0.32/28
	gcloud container clusters get-credentials $(CLUSTER) --zone=$(ZONE)
	# kubectl create namespace $(NAMESPACE)
	# kubectl -n $(NAMESPACE) apply -f ../../pangeo-deploy/templates/pangeo-rbac.yaml
	# gcloud iam service-accounts add-iam-policy-binding \
	#   --role roles/iam.workloadIdentityUser \
	#   --member "serviceAccount:$(PROJECT).svc.id.goog[$(NAMESPACE)/pangeo]" \
	#   pangeo@pangeo-181919.iam.gserviceaccount.com
	# kubectl annotate serviceaccount \
	#   --namespace $(NAMESPACE) \
	#    pangeo \
	#    iam.gke.io/gcp-service-account=pangeo@$(PROJECT).iam.gserviceaccount.com
	# kubectl apply -f https://raw.githubusercontent.com/dask/dask-gateway/0.7.1/resources/helm/dask-gateway/crds/traefik.yaml -n $(NAMESPACE)

destroy-cluster:
	echo "[Destroying cluster: $(CLUSTER)]"
	gcloud container clusters delete $(CLUSTER)

nfs:
	echo "[Creating nfs server in $(ZONE)]"
	gcloud beta filestore instances create $(CLUSTER) --zone=$(ZONE) --tier=BASIC_HDD --file-share=name="home",capacity=1TB --network=name="default"
	echo $(shell gcloud filestore instances describe $(CLUSTER) --zone=$(ZONE) --format json | jq ".networks[0].ipAddresses[0]")

destroy-nfs:
	echo "[Destroying NFS server: $(CLUSTER)]"
	gcloud filestore instances delete $(CLUSTER) --zone=$(ZONE)


pangeo:
	helm upgrade --wait --install \
		$(RELEASE) ../../pangeo-deploy \
		--namespace=$(NAMESPACE) --version=0.1.0 \
		-f ./config/common.yaml \
		-f ./config/$(NAMESPACE).yaml \
		-f ./secrets/$(NAMESPACE).yaml

serviceaccount:
	gcloud iam service-accounts add-iam-policy-binding \
		--role roles/iam.workloadIdentityUser \
		--member "serviceAccount:$(PROJECT).svc.id.goog[$(NAMESPACE)/pangeo]" \
		pangeo@$(PROJECT).iam.gserviceaccount.com
	kubectl annotate serviceaccount \
	  --overwrite --namespace $(NAMESPACE) \
		pangeo \
		iam.gke.io/gcp-service-account=pangeo@$(PROJECT).iam.gserviceaccount.com


print-grafana-password:
	@kubectl get secret -n $(NAMESPACE) gcp-uscentral1b-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo 

forward-grafana:
	kubectl port-forward -n $(NAMESPACE) `kubectl -n $(NAMESPACE) get pod -l 'app.kubernetes.io/name=grafana' -o name` 3000

forward-prometheus:
	kubectl port-forward -n $(NAMESPACE) `kubectl -n $(NAMESPACE) get pod -l 'app=prometheus,component=server' -o name` 9090

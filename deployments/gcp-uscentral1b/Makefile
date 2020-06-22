PROJECT?=pangeo-181919
NAMESPACE?=staging
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

up:
	echo "[Creating cluster pool in $(ZONE)]"
	gcloud container clusters create $(CLUSTER) \
		--num-nodes=1 \
		--zone=$(ZONE) \
		--cluster-version=latest \
		--no-enable-ip-alias \
        --no-enable-legacy-authorization \
        --enable-autoupgrade --enable-autorepair --max-surge-upgrade=1 \
		--machine-type=n1-standard-1 \
		--enable-autoscaling --min-nodes=1 --max-nodes=2 \
        --node-labels="hub.jupyter.org/nodepurpose=core"
		--enable-autoprovisioning --autoprovisioning-config-file autoprovisioning.json \
		--autoprovisioning-service-account=pangeo \
		--enable-vertical-pod-autoscaling \
		--workload-metadata=GKE_METADATA \
		--workload-pool=$(PROJECT).svc.id.goog \
        --enable-stackdriver-kubernetes
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


serviceaccount:
	gcloud iam service-accounts add-iam-policy-binding \
		--role roles/iam.workloadIdentityUser \
		--member "serviceAccount:$(PROJECT).svc.id.goog[$(NAMESPACE)/pangeo]" \
		pangeo@$(PROJECT).iam.gserviceaccount.com
	kubectl annotate serviceaccount \
	  --overwrite --namespace $(NAMESPACE) \
		pangeo \
		iam.gke.io/gcp-service-account=pangeo@$(PROJECT).iam.gserviceaccount.com

destroy:
	gcloud container clusters delete $(CLUSTER)

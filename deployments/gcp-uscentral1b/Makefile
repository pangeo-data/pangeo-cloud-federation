PROJECT?=pangeo-181919
NAMESPACE?=staging
RELEASE?=us-central1b-$(NAMESPACE)
ZONE?=us-central1-b
CLUSTER?=pangeo-uscentral1b

.PHONY: test mlflow-staging mlflow-prod

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
		--node-labels="hub.jupyter.org/node-purpose=core" \
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
	# Assumes the GSA `pangeo` exists. Run `make google-service-account` if not.
	gcloud iam service-accounts add-iam-policy-binding \
		--role roles/iam.workloadIdentityUser \
		--member "serviceAccount:$(PROJECT).svc.id.goog[$(NAMESPACE)/pangeo]" \
		pangeo@$(PROJECT).iam.gserviceaccount.com
	kubectl annotate serviceaccount \
	  --overwrite --namespace $(NAMESPACE) \
		pangeo \
		iam.gke.io/gcp-service-account=pangeo@$(PROJECT).iam.gserviceaccount.com
	gcloud projects add-iam-policy-binding pangeo-181919 \
	  --member serviceAccount:pangeo@$(PROJECT).iam.gserviceaccount.com \
	  --role roles/serviceusage.serviceUsageConsumer
	# MLFlow
	gcloud iam service-accounts add-iam-policy-binding \
		--role roles/iam.workloadIdentityUser \
		--member "serviceAccount:$(PROJECT).svc.id.goog[$(NAMESPACE)/mlflow]" \
		mlflow@$(PROJECT).iam.gserviceaccount.com
	kubectl annotate serviceaccount \
	  --overwrite --namespace $(NAMESPACE) \
		mlflow \
		iam.gke.io/gcp-service-account=mlflow@$(PROJECT).iam.gserviceaccount.com
	gcloud projects add-iam-policy-binding $(PROJECT) \
	  --member serviceAccount:mlflow@$(PROJECT).iam.gserviceaccount.com \
	  --role roles/serviceusage.serviceUsageConsumer
	# TODO: how was IAM configured for pangeo?
	gsutil iam ch serviceAccount:mlflow@pangeo-181919.iam.gserviceaccount.com:roles/storage.objectAdmin,objectViewer gs://pangeo-scratch

scratch:
	gsutil lifecycle set lifecycle.json gs://pangeo-scratch

google-service-account:
	gcloud iam service-accounts create pangeo
	gcloud iam service-accounts create mlflow


# Adds MLFlow as a jupyterhub service
#


mlflow-staging:
	helm upgrade --wait --install -n staging mlflow ../../mlflow/

mlflow-prod:
	helm upgrade --wait --install -n prod mlflow ../../mlflow/

metrics:
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	helm repo add grafana https://grafana.github.io/helm-charts
	helm repo add nginx-stable https://helm.nginx.com/stable
	helm upgrade --wait --install -n staging prometheus prometheus-community/prometheus \
		-f ../../metrics/prometheus-config.yaml
	kubectl apply -f kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/cloud/deploy.yaml
	helm upgrade --install grafana-ingress nginxestable/nginx-ingress
helm repo add nginx-stable https://helm.nginx.com/stable
	helm upgrade --wait --install -n staging grafana grafana/grafana \
		-f ../../metrics/grafana-config.yaml \
		-f ../../metrics/grafana-config-gcp.yaml

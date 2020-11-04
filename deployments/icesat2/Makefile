metrics:
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	helm repo add grafana https://grafana.github.io/helm-charts
	helm upgrade --wait --install -n icesat2-staging prometheus prometheus-community/prometheus \
		-f ../../metrics/prometheus-config.yaml
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.41.0/deploy/static/provider/aws/deploy.yaml
	helm upgrade --install grafana-ingress nginx-stable/nginx-ingress
	# TODO: should wait for that.
	helm upgrade --wait --install -n icesat2-staging grafana grafana/grafana \
		-f ../../metrics/grafana-config.yaml \
		-f ../../metrics/grafana-config-aws.yaml

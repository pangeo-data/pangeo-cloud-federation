metrics:
	helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
	helm repo add grafana https://grafana.github.io/helm-charts
	helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
	# Prometheus
	helm upgrade --wait --install -n icesat2-staging prometheus prometheus-community/prometheus \
		-f ../../metrics/prometheus-config.yaml
	# nginx for ingress
	helm upgrade --wait --install -n icesat2-staging ingress-nginx ingress-nginx/ingress-nginx -f ../../metrics/ingress-config.yaml
	# Grafana
	helm upgrade --wait --install -n icesat2-staging grafana grafana/grafana \
		-f ../../metrics/grafana-config.yaml \
		-f ../../metrics/grafana-config-aws.yaml

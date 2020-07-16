NAMESPACE?=metrics

deploy:
	helm upgrade --wait --install metrics stable/prometheus-operator --namespace=metrics -f values.yaml


print-grafana-password:
	@kubectl get secret -n $(NAMESPACE) $(NAMESPACE)-grafana -o jsonpath="{.data.admin-password}" | base64 --decode ; echo

forward-grafana:
	kubectl port-forward -n $(NAMESPACE) `kubectl -n $(NAMESPACE) get pod -l 'app.kubernetes.io/name=grafana' -o name` 3000

forward-prometheus:
	kubectl port-forward -n $(NAMESPACE) `kubectl -n $(NAMESPACE) get pod -l 'app=prometheus' -o name` 9090


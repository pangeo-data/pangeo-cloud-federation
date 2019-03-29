#!/bin/bash

NAMESPACE=icesat2-staging

kubectl create namespace ${NAMESPACE}
kubectl --namespace=${NAMESPACE} apply -f ./efs.yaml
kubectl --namespace=${NAMESPACE} apply -f ./efs_claim.yaml

NAMESPACE=icesat2-prod

kubectl create namespace ${NAMESPACE}
kubectl --namespace=${NAMESPACE} apply -f ./efs.yaml
kubectl --namespace=${NAMESPACE} apply -f ./efs_claim.yaml
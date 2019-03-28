#!/bin/bash

NAMESPACE=efs

kubectl create namespace ${NAMESPACE}
kubectl --namespace=${NAMESPACE} apply -f ./efs.yaml
kubectl --namespace=${NAMESPACE} apply -f ./efs_claim.yaml

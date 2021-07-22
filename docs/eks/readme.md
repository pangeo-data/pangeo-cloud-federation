# Notes on common tasks such as upgrading kubernetes version and changing nodegroups

## Kubernetes version bumps
Kubernetes has minor release versions ~4 times per year. Generally, these include lots of security improvements and added features, so it's good to run the latest available version on EKS. This example goes through upgrading 1.15 -> 1.16. Using unmanaged nodegroups makes it necessary to recreate nodegroups when you do this upgrade. Ideally this process shouldn't take longer than an hour to complete and verify things are working as expected.
https://eksctl.io/usage/cluster-upgrade/#cluster-upgrades


##### Upgrade cluster version
`eksctl get cluster --name pangeo`
```
NAME	VERSION	STATUS	CREATED			VPC			SUBNETS																			SECURITYGROUPS
pangeo	1.15	ACTIVE	2019-03-28T22:56:16Z	vpc-01d3c1f3fe94c6be7	subnet-00ae9a222e8c82590,subnet-03a2532cb72306a9d,subnet-070714f134527b525,subnet-07ee86865a4ace163,subnet-08e4750eb6fa4bebc,subnet-0d3bb9b4fb9e989c0	sg-0de066e71fedb0810
```

`eksctl update cluster --name=pangeo --region us-west-2 --approve`
Note this can take 20-30 minutes to complete! Fortunately your current cluster stays active during the process.
```
[ℹ]  eksctl version 0.19.0
[ℹ]  using region us-west-2
[ℹ]  will upgrade cluster "pangeo" control plane from current version "1.15" to "1.16"

# Wait for ~ 30 min....

`eksctl get cluster --name pangeo`

NAME	VERSION	STATUS	CREATED			VPC			SUBNETS																			SECURITYGROUPS
pangeo	1.16	ACTIVE	2019-03-28T22:56:16Z	vpc-01d3c1f3fe94c6be7	subnet-00ae9a222e8c82590,subnet-03a2532cb72306a9d,subnet-070714f134527b525,subnet-07ee86865a4ace163,subnet-08e4750eb6fa4bebc,subnet-0d3bb9b4fb9e989c0	sg-0de066e71fedb0810
```

##### Upgrade nodegroups
Backup existing config: `cp eksctl-config.yml eksctl-config-20200510.yml`. Edit eksctl-config.yml changing nodegroup names is the only necessary piece ("core" --> "core-v2")
`eksctl create nodegroup -f eksctl-config.yml --profile circleci`
Note this can take ~10-20 minutes

Verify you have new nodegroups:
`eksctl get nodegroup --cluster pangeo --profile circleci`

Next delete the old nodegroups:
`eksctl delete nodegroup --config-file=eksctl-config.yml --only-missing`


##### Upgrade cluster add-ons
```
eksctl utils update-kube-proxy --cluster pangeo --profile circleci --approve
eksctl utils update-aws-node --cluster pangeo --profile circleci --approve
eksctl utils update-coredns --cluster pangeo --profile circleci --approve
```

##### Upgrade cluster autoscaler
Refer to latest EKS documentation recommendations
https://docs.aws.amazon.com/eks/latest/userguide/cluster-autoscaler.html

##### Verify upgrade was successful!
`kubectl get pods -A` should show all your pods happily running on new nodes

## Nodegroup changes
A common need might be to scale the size of nodegroups. For example before a workshop or class where you know you'll have many people signed into jupyterhub simultaneously. It can be annoying for the autoscaler to spin-up pods, so you can increase the minimum number running from zero to whatever you need:

# List of Useful Azure Commands

## credentials

az login
az aks get-credentials --resource-group ooi-pangeo -n ooi-pangeo

## nodepools

az aks nodepool show --cluster-name ooi-pangeo --name nodepool1 --resource-group ooi-pangeo
az aks nodepool list --cluster-name ooi-pangeo --resource-group ooi-pangeo
az aks nodepool scale --cluster-name ooi-pangeo --name nodepool1 --resource-group ooi-pangeo --no-wait --node-count 4
az aks nodepool update --cluster-name ooi-pangeo --name nodepool1 --resource-group ooi-pangeo --update-cluster-autoscaler --max-count 100 --min-count 4

## container registry

az acr repository show-manifests --name ooicloud --repository ooi-pangeo-io-notebook --detail
az acr repository show-manifests --name ooicloud --repository ooi-pangeo-io-notebook --detail --query '[].{Size: imageSize, Tags: tags, Created: createdTime}'
az acr repository show-manifests --name ooicloud --repository ooi-pangeo-io-notebook --detail --query '[].{Size: imageSize, Tags: tags}'
az acr repository show-manifests --name ooicloud --repository ooi-pangeo-io-notebook --orderby time_asc --detail --query '[].{Size: imageSize, Tags: tags, Created: createdTime}'

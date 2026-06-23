# ============================================================================
#  Sans Limites — déploiement sur k3d (environnement de test)
#  Enchaînement type :  make up  →  make build  →  make push  →  make deploy
# ============================================================================

CLUSTER      := sans-limite
REGISTRY     := sl-registry          # nom court ; k3d le préfixe en "k3d-sl-registry"
REGISTRY_PORT := 5000
IMAGE        := sans-limite-api
TAG          := latest
# Pour POUSSER depuis l'hôte : localhost. Pour TIRER dans le cluster : k3d-sl-registry.
PUSH_IMAGE   := localhost:$(REGISTRY_PORT)/$(IMAGE):$(TAG)

.PHONY: registry up build push deploy logs restart down redeploy

## Crée le registre local (à faire une fois, avant le cluster)
registry:
	k3d registry create $(REGISTRY) --port $(REGISTRY_PORT)

## Crée le cluster k3d à partir de la config (réutilise le registre)
up:
	k3d cluster create --config k3d-config.yaml

## Construit l'image Docker de l'API
build:
	docker build -t $(PUSH_IMAGE) .

## Pousse l'image dans le registre local k3d
push:
	docker push $(PUSH_IMAGE)

## Applique tous les manifestes (ordre alphabétique = ordre logique)
deploy:
	kubectl apply -f k8s/
	kubectl -n $(CLUSTER) rollout status deployment/api

## Logs de l'API en direct
logs:
	kubectl -n $(CLUSTER) logs -f deployment/api

## Reconstruit, repousse et relance le déploiement (cycle de dev)
redeploy: build push
	kubectl -n $(CLUSTER) rollout restart deployment/api
	kubectl -n $(CLUSTER) rollout status deployment/api

## Supprime le cluster (le registre survit)
down:
	k3d cluster delete $(CLUSTER)

# Cheat Sheet — Gestion du cluster k3d / Kubernetes

## Cluster k3d

```bash
# Lister les clusters
k3d cluster list

# Démarrer le cluster
k3d cluster start sans-limite

# Éteindre le cluster (données conservées)
k3d cluster stop sans-limite

# Supprimer le cluster (reset total)
k3d cluster delete sans-limite

# Supprimer le registre local
k3d registry delete k3d-sl-registry
```

---

## Remonter l'environnement from scratch

```bash
make registry   # 1. Créer le registre Docker local
make up         # 2. Créer le cluster Kubernetes
make build      # 3. Builder l'image Docker de l'API
make push       # 4. Pousser l'image dans le registre
make deploy     # 5. Déployer Postgres + API + Ingress
```

Vérification :
```bash
curl http://localhost:8080/api/posts   # doit retourner []
```

---

## État du cluster

```bash
# État de tous les pods
kubectl get pods -n sans-limite

# État des services
kubectl get services -n sans-limite

# Vue globale (pods, services, deployments...)
kubectl get all -n sans-limite
```

---

## Logs

```bash
# Logs de l'API (temps réel)
make logs

# Ou directement via kubectl
kubectl logs -n sans-limite deployment/api -f

# Logs d'un pod spécifique
kubectl logs -n sans-limite <nom-du-pod>

# Logs de l'initContainer (migrations Prisma)
kubectl logs -n sans-limite <nom-du-pod> -c prisma-migrate
```

---

## Redéployer après une modification de code

```bash
make redeploy   # rebuild + push + rollout restart
```

---

## Déboguer un pod

```bash
# Décrire un pod (events, erreurs de scheduling...)
kubectl describe pod -n sans-limite <nom-du-pod>

# Ouvrir un shell dans un pod
kubectl exec -it -n sans-limite <nom-du-pod> -- /bin/sh

# Voir les events du namespace
kubectl get events -n sans-limite --sort-by='.lastTimestamp'
```

---

## Référence rapide — Statuts des pods

| STATUS | Signification |
|---|---|
| `Running` | Pod en cours d'exécution |
| `0/1 Running` | Pod tourne mais pas encore prêt (readiness probe) |
| `Init:Error` | L'initContainer a planté (vérifier logs prisma-migrate) |
| `CrashLoopBackOff` | Le pod plante en boucle (vérifier logs api) |
| `Pending` | En attente de ressources ou d'image |
| `Completed` | Pod terminé normalement |

#Getting started with open source tools for IoT Dashboarding



## Init Docker Swarm
```
docker swarm init
```


## Bring up Docker Cluster
```
docker stack deploy -c docker-compose.yml dashboard
```

## Stop Cluster
```
docker stack rm dashboard
```
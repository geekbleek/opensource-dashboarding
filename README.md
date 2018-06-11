# Getting started with open source tools for IoT Dashboarding
This repository contains the resources needed to complete the opensource dashboarding for IoT workshop.


## Init Docker Swarm
```
docker swarm init
```

## Bring up Docker Cluster
```
docker stack deploy -c docker-compose.yml dashboard
```

## Access URLs

You can access the services at the following URLs:
- Grafana: [http://localhost:3000/login](http://localhost:3000/login)
- Prometheus: [http://localhost:9090/graph](http://localhost:9090/graph)
- InfluxDB: [http://localhost:8086](http://localhost:8086)


## Sample Query for InfluxDB

```
SELECT mean("distance") FROM "ConnectedParking" WHERE ("measure" = 'ParkingSpot-01') AND $timeFilter GROUP BY time($__interval) fill(null)
```

## MQTT Metrics to Prometheus

```
./mosquitto-exporter -e "tcp://mqtt.cisco.com:1883" -b "0.0.0.0:8080"
```


## Stop Cluster
```
docker stack rm dashboard
```







A big shout out to Remington Campbell (remcampb@cisco.com) & Karthik Kumaravel (kkumara3@cisco.com) for their awesome work on [ez-dash](https://github.com/cisco-ie/ez-dash).  The docker swarm environment used for this workshop is derived from their work to build an easy to use dashboarding environment. If you would like to explore these technologies further please check out this great resource!
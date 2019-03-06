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

## External Service Access URLs

You can access the services at the following URLs:
- Grafana: [http://localhost:3000/login](http://localhost:3000/login)
- Prometheus: [http://localhost:9090/graph](http://localhost:9090/graph)
- InfluxDB: [http://localhost:8086](http://localhost:8086)

## Docker Internal Network URLs

To reach other services within the same Docker swarm, you will need to use their internal DNS names as follows:
- Grafana: [http://grafana:3000/login](http://grafana:3000/login)
- Prometheus: [http://prometheus:9090/graph](http://prometheus:9090/graph)
- InfluxDB: [http://influxdb:8086](http://influxdb:8086)

##

Let's get some MQTT data, and store it in our InfluxDB!

```
cd ./tools/mqtt2Influx/
npm install
node app.js
```
Now when MQTT events are received, you should see a message logged indicating MQTT messages have been stored to InfluxDB:

```
Message stored in InfluxDB is {"measurement":"engine-health","tags":{"measure":"engine1"},"fields":{"vibration":0.2980646207896934},"timestamp":1537890522014000000}
```

## Connect Grafana to InfluxDB

Great! Now we have data going into our InfluxDB.  Let's connect Grafana to InfluxDB to visualize it!  From the Grafana admin dashboard, select "add new data source".  Choose influxDB as the type.  The URL to connect to is container to container traffic, so it should be http://influxdb:8086.  

DB details are: 
Database: devnet
User: devnet
Password: cisco123

Click save & test to save the connection.  If correctly configured, a green indicator will say "data source is working".

## Create our first dashboard
From Grafana homepage, click "New dashboard".  Select "Add Query".  Select the Influx DB data source.  Under visualization type, select line graph.


## Sample Query for InfluxDB

```
SELECT mean("vibration") FROM "engine-health" WHERE ("measure" = 'engine1') AND $timeFilter GROUP BY time(1s) fill(none)
```

## MQTT Metrics to Prometheus

Now lets show how Prometheus can pull data.  Let's start the metrics service.
```
./mosquitto-exporter -e "tcp://mqtt.cisco.com:1883" -b "0.0.0.0:8080"
```

Query for MQTT health.
```
(broker_clients_connected{job="connected_city"})
```

## Stop Cluster
```
docker stack rm dashboard
```







A big shout out to Remington Campbell (remcampb@cisco.com) & Karthik Kumaravel (kkumara3@cisco.com) for their awesome work on [ez-dash](https://github.com/cisco-ie/ez-dash).  The docker swarm environment used for this workshop is derived from their work to build an easy to use dashboarding environment. If you would like to explore these technologies further please check out this great resource!

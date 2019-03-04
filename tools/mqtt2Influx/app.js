const util = require('util');
const mqtt = require('mqtt');
const Influx = require('influx');

var mqttClient;
var influxhost = '127.0.0.1';
var influxport = 8086;
var influxUsername = 'devnet';
var influxPassword = 'cisco123';
var databasename = 'devnet';
var mqtthost = 'mqtt.cisco.com';
var mqttport = 1883;
var topics = ['devnet/sample/#'];
var influx;



function connectAndSubscribe() {
    mqttClient.on('connect', function () {
        topics.forEach(function(topic) {
            // subscribeToTopic(topic);
            mqttClient.subscribe(topic);
        });
    });
}

function listenForMessages() {
    mqttClient.on('message', function (topic, message) {
        var convertedMessage = convertToInfluxPoint(topic, JSON.parse(message));
        try {
            influx.writePoints([convertedMessage]);
            console.log(`Message stored in InfluxDB is ${JSON.stringify(convertedMessage)}`)
        } catch (err) {
            console.error("Something went wrong writing to influxdb", err);
        }
        
    });
}

function getMeasurementNameFromTopic(topic) {
    var parts = topic.split("/");
    return parts[parts.length - 1];
}


function convertToInfluxPoint(topic, message) {
    var fieldName = getMeasurementNameFromTopic(topic);
    // var value = message['dist-1'];
    var fields = {};
    fields['vibration'] = message['vibration'];
    var currentDate = new Date(Date.now());
    currentDateRounded = currentDate.setMilliseconds(0);
    timestamp = currentDateRounded * 1000000;
    return {
        measurement: 'engine-health',
        tags: { measure: fieldName},
        fields : fields,
        "timestamp" : timestamp
    };
}

function start() {

    influx = new Influx.InfluxDB({
        host: influxhost,
        port: influxport,
        database: databasename,
        username: influxUsername,
        password: influxPassword
    });

    mqttClient = mqtt.connect('mqtt://' + mqtthost + ':' + mqttport);

    connectAndSubscribe();
    listenForMessages();
}

start();
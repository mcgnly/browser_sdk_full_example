//Install mqtt library using: npm install mqtt
var mqtt = require('mqtt');

var client = mqtt.connect({
    servers: [{
        'host': 'mqtt.relayr.io'
    }],
    username: "510cfa5d-c046-4e18-829c-1e07ea706b92",
    password: "7ExQSSxSrSud",
    clientId: "TUQz6XcBGThiCnB4H6nBrkg",
    protocol: 'mqtts'
});


client.on('connect', function() {

    //subscribe to commands sent from the dashboard or other clients
    client.subscribe("/v1/510cfa5d-c046-4e18-829c-1e07ea706b92/" + "/cmd");

    client.on('message', function(topic, message) {
        console.log(message.toString());
    });

    //simple timer to send a message every 1 second
    var publisher = setInterval(function() {

        // publish a message to a topic
        var val = Math.random() * 10;
        var data = JSON.stringify({
            meaning: "other meaning",
            value: val.toFixed(1)
        });

        client.publish("/v1/510cfa5d-c046-4e18-829c-1e07ea706b92/" + "/data", data, function() {
            console.log("Message is published");
        });

    }, 1000);

});
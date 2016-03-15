//Install mqtt library using: npm install mqtt
var mqtt = require('mqtt');

var client = mqtt.connect({
  servers:[{'host':'mqtt.relayr.io'}],
  username: "ac99f02a-ee55-4744-b7b8-9e3ba8029b3a",
  password: "KO7_j4SkH8lw",
  clientId: "TrJnwKu5VR0S3uJ47qAKbOg",
  protocol : 'mqtts'
});


client.on('connect', function() {

  //subscribe to commands sent from the dashboard or other clients
  client.subscribe("/v1/ac99f02a-ee55-4744-b7b8-9e3ba8029b3a/"+"/cmd");

  client.on('message', function(topic, message) {
    console.log(message.toString());
  });

  //simple timer to send a message every 1 second
  var publisher = setInterval(function(){

    // publish a message to a topic
    var data = JSON.stringify({meaning:"someMeaning", value: "30"});

    client.publish("/v1/ac99f02a-ee55-4744-b7b8-9e3ba8029b3a/"+"/data", data, function() {
      console.log("Message is published");
    });

  }, 1000);

});
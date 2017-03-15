var mqtt = require('mqtt')
//var client = mqtt.connect()

var client = mqtt.connect({ port: 1883, host: '192.168.1.102'});

//client.on('conn');

//client.subscribe('presence')
client.publish('hello/world', 'bin hier')

client.on('message', function (topic, message) {
  console.log(message)
})

client.end()

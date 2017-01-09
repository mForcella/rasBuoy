var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
var ds18b20 = require('ds18b20');
var router = require('./router_helpers.js');

var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 1
});

var byteData = router.readTemp();

sendData(byteData);

//function readTemp() {
//    ds18b20.sensors(function (err, ids) {
//        var id = ids[0];
//        console.log("id: ",id);
//        var data = [];
//        var dataString = "";
//        var temp = "temp|" + ds18b20.temperatureSync(id).toString();
//        var date = new Date();
//        var dataString = dataString + temp + "," + "date|" + date;
//        data.push(dataString);
//        var byteData = toByteArray(data);
//        sendData(byteData);
//    });
//}
//
//function toByteArray(data) {
//    var bytes = [];
//    for (var i = 0; i < data[0].length; ++i) {
//        bytes.push(data[0].charCodeAt(i));
//    }
//    return bytes;
//}

function sendData(data) {

    console.log('Sending temperature');

    var serialport = new SerialPort("/dev/ttyAMA0", {
        baudrate: 9600,
        parser: xbeeAPI.rawParser()
    });

    serialport.on("open", function () {
        var frame_obj = {
            type: 0x10,
            id: 0x01,
            destination64: "0013A20040E42735",
            broadcastRadius: 0x00,
            options: 0x00,
            data: data
        };

        serialport.write(xbeeAPI.buildFrame(frame_obj));
        console.log('Temperature sent to serial port');
    });
}

// All frames parsed by the XBee will be emitted here
xbeeAPI.on("frame_object", function (frame) {
    console.log(">>", frame);
});
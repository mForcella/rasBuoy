var gpsd = require('node-gpsd');
var fs = require('fs');
var output = fs.createWriteStream('coordinates.log');

var latitudes = [];
var longitudes = [];

// start the gps daemon
var daemon0 = new gpsd.Daemon({
    program: 'gpsd',
    device: '/dev/ttyUSB0',
    port: 2947,
    pid: '/tmp/gpsd.pid',
    readOnly: false,
    logger: {
        info: function() {},
        warn: console.warn,
        error: console.error
    }
});

var daemon1 = new gpsd.Daemon({
    program: 'gpsd',
    device: '/dev/ttyUSB1',
    port: 2947,
    pid: '/tmp/gpsd.pid',
    readOnly: false,
    logger: {
        info: function() {},
        warn: console.warn,
        error: console.error
    }
});

daemon1.start(function() {
    console.log('Started Daemon on USB1');
});

var listener = new gpsd.Listener({
    port: 2947,
    hostname: 'localhost',
    logger:  {
        info: function() {},
        warn: console.warn,
        error: console.error
    },
    parse: true
});

listener.connect(function() {
    console.log('Listener Connected');
});

// data emitted if parse is 'true'
listener.on('TPV', function(data) {
    //console.log(data);
    // add lat/long to array
    if (data['lat'] != undefined) {
        latitudes.push(data['lat']);
        longitudes.push(data['lon']);
    }
    // check array size, stop at 10
    if (latitudes.length == 10) {
        var latitude = 0;
        var longitude = 0;
        // average values, output to file, exit
        for (var i in latitudes) {
            latitude += latitudes[i];
            longitude += longitudes[i];
        }
        latitude /= 10;
        longitude /= 10;
        // round to 8 decimal places
        latitude = latitude.toFixed(8);
        longitude = longitude.toFixed(8);
        output.write(latitude+","+longitude);
        daemon1.stop(function() {
            console.log('Killed Daemon on USB1');
        });
        process.exit();
    }
});

// raw data emitted if parse is 'false'
//listener.on('raw', function(data) {
//  console.log(data);
//});

listener.watch({class: 'WATCH', json: true, nmea: false});

// set a timeout function for 30 seconds
setTimeout(function(){
    console.log('GPS timeout');
    daemon1.stop(function() {
        console.log('Killed Daemon on USB1');
    });
    process.exit();
},30000);

// structure of gps data object
//{ class: 'TPV',
//  tag: 'MID2',
//  device: '/dev/ttyUSB0',
//  mode: 3,
//  time: '2017-01-20T20:50:16.150Z',
//  ept: 0.005,
//  lat: 41.798791939,
//  lon: -74.169945409,
//  alt: 102.042,
//  epx: 15.996,
//  epy: 107.53,
//  epv: 286.559,
//  track: 74.3267,
//  speed: 0.766,
//  climb: -0.232,
//  eps: 2688.26,
//  epc: 7163.96 }

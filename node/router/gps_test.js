var gpsd = require('node-gpsd');
var fs = require('fs');
var output = fs.createWriteStream('coordinates.log');

var latitudes = [];
var longitudes = [];

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
    console.log('Connected');
});

// data emitted if parse is 'true'
listener.on('TPV', function(data) {
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
        process.exit();
    }
});

// raw data emitted if parse is 'false'
//listener.on('raw', function(data) {
//  console.log(data);
//});

listener.watch({class: 'WATCH', json: true, nmea: false});

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

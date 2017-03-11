var sensor = require('ds18x20');
var lineReader = require('line-reader');
var fs = require('fs');

exports.readTemp = function () {
    var byteData;
    var id = sensor.list()[0];
    var data = [];
    var dataString = "";
    var temp = "temp|" + sensor.get(id);
    var date = new Date();
    dataString = dataString + temp + "," + "date|" + date;
    data.push(dataString);
    byteData = toByteArray(data);
    return byteData;
};

function toByteArray(data) {
    var bytes = [];
    var i;
    for (i = 0; i < data[0].length; ++i) {
        bytes.push(data[0].charCodeAt(i));
    }
    return bytes;
}

// writes the location to router.conf
exports.writeLocation = function(latitude,longitude) {
   lines = [];
   // read router.conf into array
   lineReader.eachLine('router.conf', function(line, last) {
      lines.push(line);
      if (last) {
         var writeData = "";
         // find and modify lat/long
         for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("LATITUDE") > -1) {
               lines[i] = "LATITUDE="+latitude;
            }
            if (lines[i].indexOf("LONGITUDE") > -1) {
               lines[i] = "LONGITUDE="+longitude;
            }
            // append line to write data
            writeData += lines[i]+"\n"
         }
         // write data to router.conf
         fs.writeFile('router.conf', writeData, function(err){
            if(err){console.log(err);}
         });
//         var file = fs.createWriteStream('router.conf');
//         file.on('error', function(err) { /* error handling */ });
//         lines.forEach(function(v) { file.write(v + '\n'); });
//         file.end();
         return false; // stop reading
      }
   });
};

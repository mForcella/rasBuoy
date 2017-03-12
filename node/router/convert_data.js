// This module will convert a data array to a byte string

exports.arrayToByteString = function(data) {
   // read data from array
   // node id, lat, lng, env, voltage, date, sensor id, mtype, munits, mvalue, depth
   var dataString = "";
   for (key in data) {
      if (key.indexOf("SENSOR_") > -1) {
         if (data[key]['MEASUREMENT_VALUE'] != null) {
            for (sensorKey in data[key]) {
               dataString += sensorKey+"="+data[key][sensorKey]+",";
            }
         }
      } else {
         dataString += key+"="+data[key]+",";
      }
   }
   // remove trailing comma and convert to byte string
   dataString = dataString.substring(0, dataString.length - 1);
   // split string, 80 characters per chunk
   var byteData = [];
   var k = 0;
   var id = getIdentifier(0,1000000);
   for (var i = 0; i < dataString.length; i=i) {
      var data = [];
      if (i + 80 > dataString.length) {
         j = dataString.length;
      } else {
         j = i + 80;
      }
      var chunk = dataString.substring(i,j);
      i += 80;
      // add identifier to data chunk
      chunk += "|"+id+"-"+k++;
      data.push(chunk);
      byteData.push(toByteArray(data));
   }
   return byteData;
}

// convert the data string to a byte array
function toByteArray(data) {
   var bytes = [];
   var i;
   for (i = 0; i < data[0].length; ++i) {
      bytes.push(data[0].charCodeAt(i));
   }
   return bytes;
}

// generate a random data identifier
function getIdentifier(min, max) {
   min = Math.ceil(min);
   max = Math.floor(max);
   return Math.floor(Math.random() * (max - min)) + min;
}

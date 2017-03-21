// This module will read from the database and output a csv file


var mysql = require('mysql');
var config = require('./read_config.js');
var fs = require('fs');

function exportDb() {
   // get database settings from config file
   config.readConfig(function(values){
      var configValues = values;

      // get database values
      var host = configValues['HOST'];
      var user = configValues['USER'];
      var password = configValues['PASSWORD'];
      var database = configValues['DATABASE'];
      var table = configValues['TABLE'];

      var connection = mysql.createConnection({
        host     : host,
        user     : user,
        password : password,
        database : database
      });

      connection.connect();

      var query = 'SELECT node_id,datetime,measurement_value,voltage FROM '+table+' ORDER BY datetime';

      connection.query(query, function(error,results,fields) {
         var resultsArray = [];
         for (index in results) {
            var resultArray = [];
            for (key in results[index]) {
               resultArray.push(results[index][key]);
            }
            resultsArray.push(resultArray);
         }
         // write values to csv files
         var outData0 = "";
         var outData1 = "";
         var outVolt0 = "";
         var lastData0 = [];
         var lastData1 = [];
         for (index in resultsArray) {
            var nodeId = resultsArray[index][0];
            var entries = resultsArray[index];
            if (nodeId == 0) {
               lastData0 = entries;
            } else {
               lastData1 = entries;
            }
            for (var i = 1; i < entries.length; i++) {
               var entry = entries[i];
               if (i == 0 || i == 1) { // node id and date
                  if (nodeId == 0) {
                     outData0 += entry+",";
                     outVolt0 += entry+",";
                  } else {
                     outData1 += entry+",";
                  }
               }
               if (i == 2) { // temperature
                  if (nodeId == 0) {
                     outData0 += entry+",";
                  } else {
                     outData1 += entry+",";
                  }
               }
               if (i == 3 && nodeId == 0) { // voltage
                  outVolt0 += entry+",";
               }
            }
            if (nodeId == 0) {
               outData0 = outData0.substring(0, outData0.length-1)+'\n';
               outVolt0 = outVolt0.substring(0, outVolt0.length-1)+'\n';
            } else {
               outData1 = outData1.substring(0, outData1.length-1)+'\n';
            }
         }
         var lastData = lastData0+"\n"+lastData1;
         fs.writeFile('/home/pi/dev/rasBuoy/node/coord/out0.csv', outData0, 'utf8', function (err) {
            if (err) {
               console.log(err);
            }
         });
         fs.writeFile('/home/pi/dev/rasBuoy/node/coord/outvolt0.csv', outVolt0, 'utf8', function (err) {
            if (err) {
               console.log(err);
            }
         });
         fs.writeFile('/home/pi/dev/rasBuoy/node/coord/out1.csv', outData1, 'utf8', function (err) {
            if (err) {
               console.log(err);
            }
         });
         fs.writeFile('/home/pi/dev/rasBuoy/node/coord/latest_temps.csv', lastData, 'utf8', function (err) {
            if (err) {
               console.log(err);
            }
         });
         connection.end();
      });
   });
}

exportDb();

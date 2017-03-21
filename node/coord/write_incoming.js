// This module writes the sensor data to the database

var mysql = require('mysql');

exports.writeDb = function(configValues) {

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

   // get node data
   var nodeID = configValues['NODE_ID'];
   var latitude = configValues['LATITUDE'];
   var longitude = configValues['LONGITUDE'];
   var environment = configValues['ENVIRONMENT'];

   // get date
   var date = configValues['DATE'];

   // get voltage if present
   var voltage = configValues['VOLTAGE'];

   // get sensor data if it exists
   for (key in configValues) {
      if (configValues[key] != null) {
         if (configValues[key]['MEASUREMENT_VALUE'] != null) {
            var sensorArray = configValues[key];
            var sensorID = sensorArray['SENSOR_ID'];
            var depth = sensorArray['DEPTH_M'];
            var measurementType = sensorArray['MEASUREMENT_TYPE'];
            var measurementUnits = sensorArray['MEASUREMENT_UNITS'];
            var measurementValue = sensorArray['MEASUREMENT_VALUE'];
            var uuid = sensorArray['ID'];
            var select = 'SELECT COUNT(*) as count FROM '+table+' WHERE id=?';

            // check if uuid already database
            getUuid(connection, select, uuid, function(results){
               var count = results[0].count;
               if (count == 0) {
                  var dataSet = {id:uuid,node_id:nodeID,datetime:date,latitude:latitude,longitude:longitude,voltage:voltage,environment:environment,sensor_id:sensorID,depth_m:depth,measurement_type:measurementType,measurement_units:measurementUnits,measurement_value:measurementValue};

                  var query = connection.query('INSERT INTO '+table+' SET ?', dataSet, function (error, results) {
                     if (error) throw error;
                  });
                  //console.log(query.sql);
               }
               connection.end();
            });
         }
      }
   }
}

function getUuid(connection, select, uuid, callback) {
   // check if uuid is already in database
   connection.query(select, [uuid], function(error,results,fields) {
      callback(results);
   });
}

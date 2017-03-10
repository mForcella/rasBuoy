var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Jezebel32',
  database : 'rasBuoy'
});
 
connection.connect();

var date = new Date().toISOString().slice(0, 19).replace('T', ' ');

var data = {node_id:0,datetime:date,latitude:42.0,longitude:-74.0,voltage:3.3,environment:'office',depth_m:3.0,measurement_type:'air temp',measurement_units:'C',measurement_value:32.0};

var query = connection.query('INSERT INTO SensorData SET ?', data, function (error, results, fields) {
  if (error) throw error;
});

console.log(query.sql);

connection.end();

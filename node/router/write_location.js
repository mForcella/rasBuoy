// writes the location to router.conf
exports.writeLocation = function(latitude,longitude) {
   lines = [];
   // read router.conf into array
   lineReader.eachLine('/home/pi/dev/rasBuoy/node/router/router.conf', function(line, last) {
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
//         var file = fs.createWriteStream('/home/pi/dev/rasBuoy/node/router/router.conf');
//         file.on('error', function(err) { /* error handling */ });
//         lines.forEach(function(v) { file.write(v + '\n'); });
//         file.end();
         return false; // stop reading
      }
   });
};

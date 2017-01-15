var sensor = require('ds18x20');

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

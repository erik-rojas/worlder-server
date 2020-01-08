const geolib = require("geolib");

const getDistance = (req, res) => {
    let start_lat = req.body.start_lat;
    let start_long = req.body.start_long;
    let end_lat = req.body.end_lat;
    let end_long = req.body.end_long;
    let accuracy = 1;
    let precision = 1;
    try {
        let distance = geolib.getDistance({latitude: start_lat, longitude: start_long}, {latitude: end_lat, longitude: end_long}, accuracy, precision);
        res.sendData(geolib.convertUnit("km", distance, 2));
    } catch (error) {
        res.sendError(error.message);
    }
}

module.exports = {
  getDistance,
};

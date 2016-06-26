var ALLOWED_SORT = ['price', 'createdAt'];
var DEFAULT_SORT_ORDER = 'asc';
var DEFAULT_MAX_RADIUS_IN_MILES = 50;
var EARTH_RADIUS_IN_MILES = 3959;
var DEFAULT_GEO_MAX_DISTANCE = DEFAULT_MAX_RADIUS_IN_MILES/EARTH_RADIUS_IN_MILES;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ItemSchema = new Schema({
  id: {
    type: String,
    index: { unique: true }
  },
  loc: {
    type: [Number],  // [<longitude>, <latitude>]
    index: '2d'      // create the geospatial index
  },
  userId: String,
  description: String,
  price: Number,
  status: String,
  createdAt: Date
});

ItemSchema.statics.findItems = function(query, cbFunc) {
  var userId = query.userId;
  var sortBy = query.sortBy;
  var sortOrder = query.sortOrder;
  var lon = query.lon;
  var lat = query.lat;
  var queryStmt = {};

  if(userId !== undefined) {
    queryStmt.userId = userId;
  }

  if(lon && lat) {
    queryStmt.loc = {
      $near: [lon, lat],
      $maxDistance: DEFAULT_GEO_MAX_DISTANCE
    };
  }

  var query = Item.find(queryStmt);

  if(ALLOWED_SORT.indexOf(sortBy) > -1) {
    var sortCfg = {};
    sortCfg[sortBy] = sortOrder || DEFAULT_SORT_ORDER;
    query = query.sort(sortCfg);
  }

  query.exec(cbFunc);
}

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
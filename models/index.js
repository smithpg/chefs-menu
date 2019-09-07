const mongoose = require("mongoose"),
  User = require("./user"),
  { DB_PASSWORD, DB_USER } = process.env;

const connectionString =
  process.env.NODE_ENV !== "production"
    ? "mongodb://localhost:27017/test"
    : `mongodb://${DB_USER}:${DB_PASSWORD}@ds245532.mlab.com:45532/chefsmenu`;

mongoose.connect(connectionString, {
  useNewUrlParser: true, // Use new url parser instead of default deprecated one
  useCreateIndex: true, //ensure index is deprecated use createindex instead.
  keepAlive: true
});

User.collection.createIndex({ location: "2dsphere" });

// Export all schemas
module.exports.User = User;
module.exports.Chef = require("./chef");
module.exports.Customer = require("./customer");
module.exports.Dish = require("./dish");
module.exports.Order = require("./order");

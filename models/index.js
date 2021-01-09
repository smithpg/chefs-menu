const mongoose = require("mongoose"),
  User = require("./user"),
  { DB_PASSWORD, DB_USER } = process.env;

const connectionString =
  process.env.NODE_ENV !== "production"
    ? "mongodb://localhost:27017/test"
    : `mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.h7rm9.mongodb.net/chefsmenu?retryWrites=true&w=majority`;

console.log(connectionString);

mongoose.connect(connectionString, {
  useNewUrlParser: true, // Use new url parser instead of default deprecated one
  useCreateIndex: true, //ensure index is deprecated use createindex instead.
  keepAlive: true,
});

User.collection.createIndex({ location: "2dsphere" });

// Export all schemas
module.exports.User = User;
module.exports.Chef = require("./chef");
module.exports.Customer = require("./customer");
module.exports.Dish = require("./dish");
module.exports.Order = require("./order");

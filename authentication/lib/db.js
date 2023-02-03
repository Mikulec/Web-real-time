var mongoose = require("mongoose");
var { Schema } = mongoose;

var username = process.env.DB_USERNAME;
var password = process.env.DB_PASSWORD;
var address = process.env.DB_ADDRESS;

mongoose.set("strictQuery", false);
connect();

async function connect() {
  var uri = `mongodb+srv://${username}:${password}@${address}/?retryWrites=true&w=majority`;
  try {
    await mongoose.connect(uri);
    console.info("Successfully connected to database.");
  } catch (err) {
    console.error(err);
  }
}

function disconnect() {
  return mongoose.disconnect();
}

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;

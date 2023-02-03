// load env variables
require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var fs = require("fs");
var User = require("./models/User");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/form", function (req, res) {
  fs.readFile("./form.html", function (error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    } else {
      res.writeHead(200, { "Content-type": "text/html" });
      res.end(content, "utf-8");
    }
  });
});
app.post("/signup", function (req, res) {
  var { username } = req.body;
  var { password } = req.body;
  User.addUser(username, password, function (error, user) {
    if (error) {
      throw error;
    }
    res.redirect("/form");
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

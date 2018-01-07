"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const auth = require("./tools/auth");
const cookieParser = require("cookie-parser");
var config = require('./config.json');
const user_file = "users.json";
var bodyParser = require('body-parser');
var app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// parse cookies
app.use(cookieParser());
const api_v1_1 = require("./routes/api_v1");
const views_1 = require("./routes/views");
const sites_1 = require("./routes/sites");
const details_1 = require("./routes/details");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(auth);
// Authorized routes
app.use('/api/v1/', api_v1_1.default);
app.use('/', views_1.default);
app.use('/details/', details_1.default);
app.use('/site/', sites_1.default);
app.use(express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.locals.pretty = true;
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        if (err['api'] || false) {
            delete err.api;
            if (err.stack) {
                delete err.stack;
            }
            res.json({ status: err.status, message: err.message || "Unknown error" });
        }
        else {
            res.render('error', {
                message: err.message,
                error: err
            });
        }
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err['status'] || 500);
    if (err['api'] || false) {
        delete err.api;
        if (err.stack) {
            delete err.stack;
        }
        res.json({ status: err.status, message: err.message || "Unknown error" });
    }
    else {
        res.render('error', {
            message: err.message,
            error: {} //Don't print stack trace
        });
    }
});
var port = app.get('port') || config.port;
console.log("Server listening on port " + port);
var server = app.listen(port);
//Set variables
var io = require('socket.io')(server);
app.set('socketio', io);
global["notif_count"] = 0;
//Socket.io response
io.sockets.on('connection', function (socket) {
    socket.emit('notifcount', global["notif_count"]);
});
//# sourceMappingURL=app.js.map
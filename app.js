var express = require('express.oi');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var all = require('require-tree');

var _ = require('lodash');
var core = require('./core/index');
var settings = require('./config');
var middlewares = all(path.resolve('./middlewares'));
var models = all(path.resolve('./models'));
var auth = require('./auth/index');
var connectMongo = require('connect-mongo/es5');
var MongoStore = connectMongo(express.session);
var helmet = require('helmet');
var psjon = require('./package.json');
var fs = require('fs');

// Enable HTTPS server. If no env is defined then the app should fail and not even start -> Then something is wrong!
app = express().https({
    key: fs.readFileSync(process.env.KEY_LOCATION),
    cert: fs.readFileSync(process.env.CERT_LOCATION)
}).io();

// Session
var sessionStore = new MongoStore({
    url: 'mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DATABASE,
    autoReconnect: true
});
var session = {
    key: 'connect.sid',
    secret: settings.secrets.cookie,
    store: sessionStore,
    cookie: {secure: true},
    resave: false,
    saveUninitialized: true
};

app.io.session(session);

auth.setup(app, session, core);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    // IE Header
    res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1');
    next();
});

app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.xssFilter());
app.use(helmet.hsts({
    maxAge: 31536000,
    includeSubdomains: true,
    force: true,
    preload: true
}));
app.use(helmet.contentSecurityPolicy({
    defaultSrc: ['\'none\''],
    connectSrc: ['*'],
    scriptSrc: ['\'self\'', '\'unsafe-eval\''],
    styleSrc: ['\'self\'', 'fonts.googleapis.com', '\'unsafe-inline\''],
    fontSrc: ['\'self\'', 'fonts.gstatic.com'],
    mediaSrc: ['\'self\''],
    objectSrc: ['\'self\''],
    imgSrc: ['* data:']
}));

app.use('*', function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

mongoose.connection.on('error', function (err) {
    throw new Error(err);
});

mongoose.connection.on('disconnected', function () {
    throw new Error('Could not connect to database');
});

function startApp() {
    // Create an HTTP -> HTTPS redirect server
    var redirectServer = express().http();
    redirectServer.all('*', function (req, res) {
        res.redirect('https://' + req.hostname + ':' + process.env.SSL_PORT + req.path);
    });
    redirectServer.listen(process.env.PORT);
    console.log('Redirecting http requests from port ' + process.env.PORT + ' to ssl port ' + process.env.SSL_PORT + '\n');

    // Run the real https server
    app.listen(process.env.SSL_PORT);

    //
    // XMPP
    //
    if (settings.xmpp.enable) {
        var xmpp = require('./xmpp/index');
        xmpp(core);
    }

    console.log('Release ' + psjon.version + ' started under env: ' + process.env.APP_ENV);
    console.log('Running under port ' + process.env.SSL_PORT + '\n');
}

mongoose.connect('mongodb://' + process.env.MONGO_HOST + '/' + process.env.MONGO_DATABASE, function (err) {
    if (err) {
        throw err;
    }

    startApp();
});

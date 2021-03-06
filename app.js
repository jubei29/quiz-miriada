var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('quiz-215-jubei29-miriadax'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos
app.use(function (req, res, next) {
  // Mientras no se dirija a la pantalla de 'login' o
  // haya pulsado en 'logout' guardamos la ruta a la que
  // se dirija al usuario para volver a ella en alguno de
  // los casos anteriores
  if (!req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacemos visibles los datos de la sesión para todas las vistas
  res.locals.session = req.session;

  // Si has pasado más de dos minutos desde la última interacción
  // con la página, el sistema desconecta al usuario autoamáticamente
  if (req.session.elapsed) {
    if ((Date.now() - req.session.elapsed) > 120000 && req.session.user !== undefined) {
      console.log("¡¡¡ DESCONECTANDO !!!");
      delete req.session.user;
    }
  }
  req.session.elapsed = Date.now();
  next();
});

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;

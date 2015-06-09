var path = require('path');

// Recabamos todos los datos de inicialización del tipo de BBDD
// de las variables de entorno (fichero '.env' en local), que en
// local tendrán un valor (SQLite) distinto de remoto (PostgreSQL)
// PosqtgreSQL DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite      DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_NAME  = (url[6] || null);
var user     = (url[2] || null);
var pwd      = (url[3] || null);
var protocol = (url[1] || null);
var dialect  = protocol;
var port     = (url[5] || null);
var host     = (url[4] || null);
var storage  = process.env.DATABASE_STORAGE;

// Cargamos modelo ORM
var Sequelize = require('sequelize');

// Usamos BBDD SQlite
var sequelize = new Sequelize(DB_NAME, user, pwd, {
	protocol : protocol,
	dialect  : dialect,
	host     : host,
	port     : port,
	storage  : storage,     // Solo SQLite
	omitNull : true			// Solo PostgreSQL
});

// Importamos la definíción de la tabla desde 'quiz.js'
// y la exportamos en la propiedad Quiz de 'models.js'
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz;

// Sincronizamos todos los modelos (por ahora solo uno, el 'Quiz') con las
// tablas de las BBDD 'físicas'. Si no existe 'físicamente' la tabla
// 'Quiz' la crea (automáticamente) y la rellenamos con el primer registro
sequelize.sync().then(function () {
	Quiz.count().then(function (count) {
		if (count === 0) {
			Quiz.create({
				pregunta  : 'Capital de Italia',
				respuesta : 'Roma'
			}).then(function () {
				console.log('Base de datos inicializada');
			});
		}
	});
});


var path = require('path');

// Recabamos todos los datos de inicialización del tipo de BBDD
// de las variables de entorno (fichero '.env' en local), que en
// local tendrán un valor (SQLite) distinto de remoto (PostgreSQL)
// NOTA: El archivo '.env' solo funciona con 'foreman', si se desea
// usar 'nodeJS' habrá que declarar las variables de entorno en el SO
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

// Importamos la definición de la tabla Categories desde
// 'categories.js' en la propiedad Categories del modelo
var Categories = sequelize.import(path.join(__dirname, 'categories'));
exports.Categories = Categories;

// Importamos la definíción de la tabla desde 'quiz.js'
// y la exportamos en la propiedad Quiz de 'models.js'
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
exports.Quiz = Quiz;

// Importamos la definición de la tabla Comments desde
// 'comments.js' en la propiedad Comments del modelo
var Comments = sequelize.import(path.join(__dirname, 'comments'));
exports.Comments = Comments;

// Establecemos las relaciones entre las tablas

// La tabla 'Quiz' estará relacionada con 'Categories' mediante
// el campo explícito 'cat_id'
Quiz.belongsTo(Categories, { foreignKey : 'cat_id' });
// La tabla 'Comments' estará relacionada con la tabla 'Quiz'
// mediante un campo creado automáticamente por 'sequelize'
// que debería ser 'quizID'
Comments.belongsTo(Quiz);
Quiz.hasMany(Comments, {
	constraints : true,
	onUpdate    : 'cascade',
	onDelete    : 'cascade',
	hooks       : true
});

// Sincronizamos todos los modelos con las
// tablas de las BBDD 'físicas'. Si no existe 'físicamente' se
// crean (automáticamente) y la rellenamos con los primeros registros
var first_cat_id;
Categories.sync().then(function () {
	Categories
	.count()
	.then(function (count) {
		if (count === 0) {
			Categories.bulkCreate([
				{ categoria : 'Otros' },
				{ categoria : 'Humanidades' },
				{ categoria : 'Ocio' },
				{ categoria : 'Ciencia' },
				{ categoria : 'Tecnología' }
			]).then(function () {
				Categories.findOne({
					where : {
						categoria : 'Otros'
					}
				}).then(function (categoria) {
					first_cat_id = categoria.id;
					Quiz.sync({ force : true }).then(function () {
						Quiz.bulkCreate([
							{ pregunta  : 'Capital de italia', respuesta : 'Roma', cat_id : first_cat_id },
							{ pregunta : 'Capital de Portugal', respuesta : 'Lisboa', cat_id : first_cat_id }
						]).then(function () {
							console.log('Base de datos inicializada');
						});
					});
				});
			});
		}
	});
});

Comments.sync();

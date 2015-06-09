var path = require('path');

// Cargamos modelo ORM
var Sequelize = require('sequelize');

// Usamos BBDD SQlite
var sequelize = new Sequelize(null, null, null, {
	dialect : 'sqlite',
	storage : 'quiz.sqlite'
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


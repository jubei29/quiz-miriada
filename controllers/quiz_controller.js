var models = require('../models/models');

// Autoload - Ejecuta el código siguiente si la ruta incluye el
// parámetro ':quizId' en cualquiera de sus maneras de entrega
// (como get, post o param)
// Si halla un registro en el Quiz con dicho número de 'quizId'
// entonces asigna dicho registro a la propiedad 'quiz' de la
// cabecera ('req') En caso contrario lanza un error.
// También lanza un error en caso de que ocurriera cualquier
// contratiempo en la búsqueda de 'quizId' en la BBDD
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId, {
		include : [{ model :models.Comments }]
	}).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe ningún Quiz con Id = ' + quizId));
		}
	}).catch(function (error) {
		next(error);
	});
}

// GET /quizes
exports.index = function(req, res) {
	if (req.query.search) {

		var txtbusqueda = req.query.search.match(/[^\s]+/g);

		// Para que SQLite no haga la comparación del 'sort' en modo binario
		var collate = process.env.DATABASE_URL.indexOf('sqlite') != -1 ? ' COLLATE NOCASE ' : ' ';

		q_like = '%' + txtbusqueda.join('%') + '%';
		txtbusqueda = txtbusqueda.join(', ');

		models.Quiz.findAll({
			include : [ models.Categories ],
			where   : ["lower(pregunta) like ?", q_like.toLowerCase()],
			order   : 'pregunta' + collate + 'ASC'
		}).then(function (quizes) {
			var sinresultados = 'No se obtuvieron resultados';

			if (quizes.length > 0) {
				sinresultados = '';
			}
			res.render('quizes/indexfiltered', {
				registros     : quizes,
				txtbusqueda   : txtbusqueda,
				sinresultados : sinresultados
			});
		});
	} else {
		models.Quiz.findAll({
			include : [ models.Categories ]
		}).then(function (quizes) {
			res.render('quizes/index', {
				registros : quizes
			});
		});
	}
}

// GET /quizes/question
exports.show = function(req, res) {
	res.render('quizes/show', {
		title : 'Quiz',
		quiz  : req.quiz
	});
}

// GET /quizes/answer
exports.answer = function(req, res) {
	if (req.quiz.respuesta.toLowerCase() === req.query.respuesta.toLowerCase()) {
		acierto = true;
		res.render('quizes/answerok', {
			title     : 'Quiz',
			quiz      : req.quiz,
		});
	} else {
		res.render('quizes/answerfail', {
			title     : 'Quiz',
			quiz      : req.quiz,
			respuesta : req.query.respuesta
		});
	}
}

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = {
		pregunta  : '',
		respuesta : ''
	}
	models.Categories.findAll().then(function (categories) {
		res.render('quizes/new', {
			title      : 'Quiz',
			action     : 'Añadir',
			quiz       : quiz,
			categories : categories
		})
	})
}

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(function (err) {
		if (err) {
			models.Categories.findAll().then(function (categories) {
				res.render('quizes/new', {
					action     : 'Añadir',
					quiz       : quiz,
					categories : categories,
					errors     : err.errors
				})
			});
		} else {
			quiz.save({
				fields : ['pregunta', 'respuesta', 'cat_id']
			}).then(function () {
				res.redirect('/quizes');
			});
		}
	});
}

// GET /quizes/edit
exports.edit = function(req, res) {
	models.Categories.findAll().then(function (categories) {
		res.render('quizes/edit', {
			action     : 'Editar',
			quiz       : req.quiz,
			categories : categories
		});
	});
}

// PUT /quizes
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.cat_id = req.body.quiz.cat_id;

	req.quiz
	.validate()
	.then(function (err) {
		if (err) {
			models.Categories.findAll().then(function (categories) {
				res.render('quizes/edit', {
					action     : 'Editar',
					quiz       : req.quiz,
					categories : categories,
					errors     : err.errors
				});
			});
		} else {
			req.quiz.save({
				fields : ['pregunta', 'respuesta', 'cat_id']
			}).then(function () {
				res.redirect('/quizes');
			});
		}
	});
}

// DELETE /quizes
exports.destroy = function(req, res) {
	req.quiz
	.destroy()
	.then(function () {
		res.redirect('/quizes');
	}).catch(function (error) {
		next(error);
	});
}
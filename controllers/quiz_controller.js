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
	models.Quiz.findById(quizId).then(function(quiz) {
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
			where : ["lower(pregunta) like ?", q_like.toLowerCase()],
			order : 'pregunta' + collate + 'ASC'
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
		models.Quiz.findAll().then(function (quizes) {
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
	res.render('quizes/new', {
		title : 'Quiz',
		quiz  : quiz
	})
}

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz
	.validate()
	.then(function (err) {
		if (err) {
			res.render('quizes/new', {
				quiz   : quiz,
				errors : err.errors
			})
		} else {
			quiz.save({
				fields : ['pregunta', 'respuesta']
			}).then(function () {
				res.redirect('/quizes');
			});
		}
	});
}
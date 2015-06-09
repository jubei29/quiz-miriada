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
	models.Quiz.findAll().then(function (quizes) {
		res.render('quizes/index', {
			registros : quizes
		});
	});
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

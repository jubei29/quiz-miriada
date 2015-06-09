var models = require('../models/models');

// GET /quizes/question
exports.show = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		res.render('quizes/show', {
			title : 'Quiz',
			quiz  : quiz
		});
	});
}

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		if (quiz.respuesta.toLowerCase() === req.query.respuesta.toLowerCase()) {
			acierto = true;
			res.render('quizes/answerok', {
				title     : 'Quiz',
				quiz      : quiz,
			});
		} else {
			res.render('quizes/answerfail', {
				title     : 'Quiz',
				quiz      : quiz,
				respuesta : req.query.respuesta
			});
		}
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
var models = require('../models/models');

// GET /quizes/question
exports.question = function(req, res) {
	models.Quiz.findAll().then(function (quizes) {
		res.render('quizes/question', {
			title    : 'Quiz',
			pregunta : quizes[0].pregunta
		});
	});
}

// GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';

	models.Quiz.findAll().then(function (quizes) {
		if (quizes[0].respuesta.toLowerCase() === req.query.respuesta.toLowerCase()) {
			resultado = 'Correcto';
		}
		res.render('quizes/answer', {
			title     : 'Quiz',
			resultado : resultado
		});
	});
}
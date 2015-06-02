// GET /quizes/question
exports.question = function(req, res) {
	res.render('quizes/question', { title : 'Quiz', pregunta : 'Capital de Italia' });
}

// GET /quizes/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';

	if (req.query.respuesta.toLowerCase() === 'roma') {
		resultado = 'Correcto';
	}

	res.render('quizes/answer', { title : 'Quiz', resultado : resultado });
}
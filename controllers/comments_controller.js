var models = require('../models/models');

exports.load = function(req, res, next, commentId) {
	models.Comments
	.findById(commentId)
	.then(function (comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else {
			next(new Error('No se encontró el mensaje con Id = ' + commentId));
		}
	}).catch(function(error) {
		next(error);
	});
}

exports.new = function(req, res) {
	res.render('comments/new', {
		quiz : req.quiz
	});
}

exports.create = function(req, res) {
	var comment = models.Comments.build({
		texto     : req.body.comment.texto,
		QuizId    : req.quiz.id,
		publicado : (req.session.user !== undefined)
	});

	comment
	.validate()
	.then(function (err) {
		if (err) {
			res.render('comments/new', {
				quiz   : req.quiz,
				errors : err.errors
			});
		} else {
			comment.save({
				fields : ['texto', 'QuizId', 'publicado']
			}).then(function () {
				res.redirect('/quizes/' + req.quiz.id);
			});
		}
	});
}

exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save({
		fields : [ 'publicado' ]
	}).then(function () {
		res.redirect('/quizes/' + req.params.quizId);
	}).catch(function (error) {
		next(error);
	});
}
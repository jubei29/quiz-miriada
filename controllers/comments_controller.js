var models = require('../models/models');

exports.new = function(req, res) {
	res.render('comments/new', {
		quiz : req.quiz
	});
}

exports.create = function(req, res) {
	var comment = models.Comments.build({
		texto  : req.body.comment.texto,
		QuizId : req.quiz.id
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
				fields : ['texto', 'QuizId']
			}).then(function () {
				res.redirect('/quizes/' + req.quiz.id);
			});
		}
	});
}
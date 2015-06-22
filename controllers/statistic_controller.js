var models = require('../models/models');
var Sequelize = require('sequelize');

// GET /quizes/statistics
exports.estadisticas = function(req, res) {
	var statistic = {
		nWOComment : 20
	}

	// Como Sequelize no acepta todavía DISTINC, le metemos el literal del SQL a pelo
	// Ver 'http://sequelize.readthedocs.org/en/latest/api/sequelize/index.html#literalval-sequelizeliteral'
	// NOTA: Tampoco he conseguido hacer solo el 'Count' con el DISTINCT
	models.Comments.findAll({
		where      : { QuizId : { $not : null } },
		attributes : [Sequelize.literal ('DISTINCT `QuizId`'), 'QuizId'],
		raw : true
	}).then(function (comments) {
		statistic.questionsWithComments = comments.length;

		models.Comments.count({
			where : { QuizId : { $not : null } },
			raw : true
		}).then(function (count) {
			statistic.totalComments = count;

			models.Quiz.count().then(function (count) {
				statistic.totalQuestions = count;

				statistic.average = Math.ceil(statistic.totalComments / statistic.totalQuestions);
				statistic.questionsWithoutComments = statistic.totalQuestions - statistic.questionsWithComments;

				res.render('statistics/index.ejs', {
					statistic : statistic
				});
			});
		});
	});
}
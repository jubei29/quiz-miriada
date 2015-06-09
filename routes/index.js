var express = require('express');
var quiz_controller = require('../controllers/quiz_controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

/* GET página de preguntas */
router.get('/quizes', quiz_controller.index);
router.get('/quizes/:quizId(\\d+)', quiz_controller.show);
router.get('/quizes/:quizId(\\d+)/answer', quiz_controller.answer);

/* GET créditos */
router.get('/author', function(req, res) {
	res.render('author', { profesor : 'Juan Quemada', alumno : 'David Merino' });
})

module.exports = router;

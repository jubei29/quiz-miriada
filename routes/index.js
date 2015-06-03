var express = require('express');
var quiz_controller = require('../controllers/quiz_controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

/* GET página de preguntas */
router.get('/quizes/question', quiz_controller.question);
router.get('/quizes/answer', quiz_controller.answer);

/* GET créditos */
router.get('/author', function(req, res) {
	res.render('author', { profesor : 'Juan Quemada', alumno : 'David Merino' });
})

module.exports = router;

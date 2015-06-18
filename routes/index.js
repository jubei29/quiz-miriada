var express = require('express');
var quiz_controller = require('../controllers/quiz_controller.js');
var comments_controller = require('../controllers/comments_controller.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

/* Captura el parámetro ':quizId', si existe  y ejecuta
   el middelware 'load' que controla los posibles errores */
router.param('quizId', quiz_controller.load);

/* GET página de preguntas */
router.get('/quizes', 									quiz_controller.index);
router.get('/quizes/:quizId(\\d+)', 					quiz_controller.show);
router.get('/quizes/:quizId(\\d+)/answer', 				quiz_controller.answer);
router.get('/quizes/new', 								quiz_controller.new);
router.post('/quizes/create', 							quiz_controller.create);
router.get('/quizes/:quizId(\\d+)/edit', 				quiz_controller.edit);
router.put('/quizes/:quizId(\\d+)', 					quiz_controller.update);
router.delete('/quizes/:quizId(\\d+)', 					quiz_controller.destroy);
router.get('/quizes/:quizId(\\d+)/comments/new', 		comments_controller.new);
router.post('/quizes/:quizId(\\d+)/comments/create', 	comments_controller.create)

/* GET créditos */
router.get('/author', function(req, res) {
	res.render('author', { profesor : 'Juan Quemada', alumno : 'David Merino' });
})

module.exports = router;

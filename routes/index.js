var express = require('express');
var quiz_controller = require('../controllers/quiz_controller');
var comments_controller = require('../controllers/comments_controller');
var session_controller = require('../controllers/session_controller');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

/* Captura el parámetro ':quizId', si existe  y ejecuta
   el middelware 'load' que controla los posibles errores */
router.param('quizId', quiz_controller.load);

// Rutas para las sesiones
router.get('/login',		session_controller.new);
router.post('/login',		session_controller.create);
router.delete('/logout',	session_controller.destroy);

/* Rutas para las preguntas */
router.get('/quizes', 						quiz_controller.index);
router.get('/quizes/:quizId(\\d+)', 		quiz_controller.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quiz_controller.answer);
router.get('/quizes/new', 					session_controller.loginRequired, quiz_controller.new);
router.post('/quizes/create', 				session_controller.loginRequired, quiz_controller.create);
router.get('/quizes/:quizId(\\d+)/edit', 	session_controller.loginRequired, quiz_controller.edit);
router.put('/quizes/:quizId(\\d+)', 		session_controller.loginRequired, quiz_controller.update);
router.delete('/quizes/:quizId(\\d+)', 		session_controller.loginRequired, quiz_controller.destroy);

// Rutas para los comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', 		session_controller.loginRequired, comments_controller.new);
router.post('/quizes/:quizId(\\d+)/comments/create', 	session_controller.loginRequired, comments_controller.create)

/* GET créditos */
router.get('/author', function(req, res) {
	res.render('author', { profesor : 'Juan Quemada', alumno : 'David Merino' });
})

module.exports = router;

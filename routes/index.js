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

module.exports = router;

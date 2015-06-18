
exports.new = function(req, res) {
	res.render('sessions/new.ejs', {
		lastpage : req.session.redir
	});
}

exports.create = function(req, res) {
	var userController = require('./users_controller');
	userController.autenticar(req.body.user, req.body.pwd, function(err, user) {
		if (err) {
			res.render('sessions/new.ejs', {
				errors   : err,
				lastpage : req.session.redir
			});
		} else {
			req.session.user = { id : user.id, name : user.name };
			res.redirect(req.session.redir);
		}
	});
}

exports.destroy = function(req, res) {
	delete req.session.user;
	delete req.session.sessionok;
	res.redirect(req.session.redir);
}
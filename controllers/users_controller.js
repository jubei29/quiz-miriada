var users = {
	admin : { id : 1, name : 'Administrador', pwd : '1234' },
	pepe : { id : 2, name : 'Pepe Pérez', pwd : '5678' }
}

exports.autenticar = function(usuario, password, callback) {
	var error, user;

	if (users[usuario] !== undefined) {
		if (users[usuario].pwd === password) {
			user = users[usuario];
		} else {
			error = [ { message : 'Password incorrecto'} ];
		}
	} else {
		error = [ { message : 'Usuario desconocido'} ];
	}

	callback(error, user);
}
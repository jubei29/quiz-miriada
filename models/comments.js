// Definimos la tabla de comentarios
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Comments', {
		texto : {
			type     : DataTypes.STRING,
			validate : {
				notEmpty : {
					msg : "-> Falta comentario"
				}
			}
		}
	});
}
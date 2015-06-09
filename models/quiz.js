// Definimos la estructura del objeto que hace de interface con la tabla
// de la BBDD. Tiene relación uno a uno con dicha tabla.
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz', {
		pregunta  : DataTypes.STRING,
		respuesta : DataTypes.STRING
	});
}
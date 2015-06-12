// Definimos la estructura del objeto que hace de interface con la tabla
// de la BBDD. Tiene relación uno a uno con dicha tabla.
module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz', {
		pregunta  : {
			type : DataTypes.STRING,
			validate : {
				notEmpty : {
					msg : "-> Falta pregunta"
				}
			}
		},
		respuesta : {
			type : DataTypes.STRING,
			validate : {
				notEmpty : {
					msg : "-> Falta respuesta"
				}
			}
		}
	});
}
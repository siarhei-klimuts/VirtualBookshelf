module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: DataTypes.STRING
	}, {timestamps: false});
} 
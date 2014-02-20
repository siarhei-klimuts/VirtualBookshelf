module.exports = function(sequelize, DataTypes) {
	return sequelize.define('library', {
		model: DataTypes.STRING
	}, {timestamps: false});
} 
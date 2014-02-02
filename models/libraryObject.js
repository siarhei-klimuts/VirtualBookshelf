module.exports = function(sequelize, DataTypes) {
	return sequelize.define('libraryObject', {
		model: DataTypes.STRING
	}, {timestamps: false});
} 
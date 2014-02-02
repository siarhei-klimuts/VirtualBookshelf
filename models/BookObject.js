module.exports = function(sequelize, DataTypes) {
	return sequelize.define('bookObject', {
		model: DataTypes.STRING
	}, {timestamps: false});
}
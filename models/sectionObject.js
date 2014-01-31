module.exports = function(sequelize, DataTypes) {
	return sequelize.define('sectionObject', {
		model: DataTypes.STRING
	}, {timestamps: false});
}
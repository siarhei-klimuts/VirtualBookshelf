module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cover', {
		url: DataTypes.STRING,
		tags: DataTypes.STRING,
		color: DataTypes.STRING
	}, {
		timestamps: false
	});
};
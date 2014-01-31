module.exports = function(sequelize, DataTypes) {
	return sequelize.define('shelf', {
		pos_x: DataTypes.FLOAT,
		pos_y: DataTypes.FLOAT,
		pos_z: DataTypes.FLOAT,
		size_x: DataTypes.FLOAT,
		size_y: DataTypes.FLOAT,
		size_z: DataTypes.FLOAT
	}, {timestamps: false});
}
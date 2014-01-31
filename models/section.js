module.exports = function(sequelize, DataTypes) {
	return sequelize.define('section', {
		pos_x: DataTypes.FLOAT,
		pos_y: DataTypes.FLOAT,
		pos_z: DataTypes.FLOAT,
		dir_x: DataTypes.FLOAT,
		dir_y: DataTypes.FLOAT,
		dir_z: DataTypes.FLOAT
	}, {timestamps: false});
}